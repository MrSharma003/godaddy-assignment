import { useState } from "react";
import { Home } from "./pages/Home";
import RepoDetails from "./pages/RepoDetails";

export default function App() {
  const [view, setView] = useState<"list" | "details">("list");
  const [selectedRepo, setSelectedRepo] = useState<string | null>(null);

  const handleRepoSelect = (repoName: string) => {
    setSelectedRepo(repoName);
    setView("details");
  };

  const handleBack = () => {
    setSelectedRepo(null);
    setView("list");
  };

  if (view === "details" && selectedRepo) {
    return <RepoDetails repoName={selectedRepo} onBack={handleBack} />;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-center m-1">
        GoDaddy Repositories
      </h1>
      <Home onRepoClick={handleRepoSelect} />;
    </div>
  );
}
