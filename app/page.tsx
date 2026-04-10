import DesktopLayout from "@/app/components/layout/DesktopLayout";
import BottomNav from "@/app/components/ui/BottomNav";
import AboutPanel from "@/app/components/views/AboutPanel";
import CompletedList from "@/app/components/views/CompletedList";
import SettingsPanel from "@/app/components/views/SettingsPanel";
import TaskList from "@/app/components/views/TaskList";
import { type AppView } from "@/app/config";

// TODO:
// 1) Check all sx attributes for unnecessary template literals
// 2) Update all handlers with synthetic event parameter
// 3) Write documentation

interface URLProps {
  searchParams: Promise<{ view?: AppView }>;
}
export default async function Home({ searchParams }: URLProps) {
  const { view = "tasks" } = await searchParams;

  function renderContent() {
    switch (view) {
      case "tasks":
        return <TaskList />;
      case "completed":
        return <CompletedList />;
      case "settings":
        return <SettingsPanel />;
      case "about":
        return <AboutPanel />;
      default:
        return <TaskList />;
    }
  }

  return <DesktopLayout content={renderContent()} navigation={<BottomNav />} />;
}
