"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { ConfirmDialog } from "./confirm-dialog";

interface DeleteAllButtonProps {
  onDeleteAll: () => void;
  disabled?: boolean;
}

export function DeleteAllButton({
  onDeleteAll,
  disabled = false,
}: DeleteAllButtonProps) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleDeleteConfirmed = () => {
    onDeleteAll();
    setShowConfirmDialog(false);
  };

  return (
    <>
      <Button
        variant="destructive"
        size="sm"
        onClick={() => setShowConfirmDialog(true)}
        disabled={disabled}
        className="flex items-center cursor-pointer"
      >
        <Trash2 className="mr-1 h-4 w-4" />
        Delete All
      </Button>

      <ConfirmDialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={handleDeleteConfirmed}
        title="Delete All Work Records"
        description="Are you sure you want to delete all work records? This action cannot be undone."
        confirmLabel="Delete All"
        cancelLabel="Cancel"
      />
    </>
  );
}
