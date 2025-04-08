import { WorkCalendar } from "@/components/work-calendar";

export default function Home() {
  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Work Schedule Tracker</h1>
      <WorkCalendar />
    </main>
  );
}
