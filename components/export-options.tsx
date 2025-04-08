"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { WorkEntry } from "./work-calendar";
import { formatWorkEntriesForExport } from "@/lib/utils";

interface ExportOptionsProps {
  entries: WorkEntry[];
  month?: Date;
}

export function ExportOptions({ entries, month }: ExportOptionsProps) {
  const [isExporting, setIsExporting] = useState(false);

  const getFileName = () => {
    let fileName = "work-schedule";
    if (month) {
      fileName += `-${month.toLocaleString("default", {
        month: "long",
      })}-${month.getFullYear()}`;
    }
    return fileName;
  };

  const exportToExcel = async () => {
    try {
      setIsExporting(true);

      // Dynamically import xlsx to reduce bundle size
      const XLSX = await import("xlsx");

      const formattedData = formatWorkEntriesForExport(entries);
      const worksheet = XLSX.utils.json_to_sheet(formattedData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Work Schedule");

      // Generate file and trigger download
      XLSX.writeFile(workbook, `${getFileName()}.xlsx`);
    } catch (error) {
      console.error("Failed to export to Excel:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const exportToPDF = async () => {
    try {
      setIsExporting(true);

      // Dynamically import jspdf and jspdf-autotable
      const jsPDF = (await import("jspdf")).default;
      const { default: autoTable } = await import("jspdf-autotable");

      const formattedData = formatWorkEntriesForExport(entries);

      const doc = new jsPDF();

      // Add title
      doc.setFontSize(16);
      doc.text("Work Schedule Report", 14, 15);

      // Add date range or month if available
      if (month) {
        doc.setFontSize(12);
        doc.text(
          `${month.toLocaleString("default", {
            month: "long",
          })} ${month.getFullYear()}`,
          14,
          25
        );
      }

      // Create table
      autoTable(doc, {
        head: [["Date", "Type", "Start Time", "End Time", "Hours Worked"]],
        body: formattedData.map((entry) => [
          entry.Date,
          entry.Type,
          entry["Start Time"],
          entry["End Time"],
          entry["Hours Worked"],
        ]),
        startY: month ? 30 : 20,
      });

      // Add summary at the bottom
      const totalHours = formattedData.reduce(
        (sum, entry) => sum + entry["Hours Worked"],
        0
      );
      const fullTimeDays = formattedData.filter(
        (entry) => entry.Type === "Full-time"
      ).length;
      const partTimeDays = formattedData.filter(
        (entry) => entry.Type === "Part-time"
      ).length;

      const finalY = (doc as any).lastAutoTable.finalY + 10;

      doc.text(`Total Hours: ${totalHours.toFixed(2)}`, 14, finalY);
      doc.text(`Full-time Days: ${fullTimeDays}`, 14, finalY + 7);
      doc.text(`Part-time Days: ${partTimeDays}`, 14, finalY + 14);

      // Save PDF
      doc.save(`${getFileName()}.pdf`);
    } catch (error) {
      console.error("Failed to export to PDF:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          disabled={isExporting || entries.length === 0}
        >
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={exportToExcel} disabled={isExporting}>
          Export to Excel (.xlsx)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToPDF} disabled={isExporting}>
          Export to PDF (.pdf)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
