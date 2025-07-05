import { useEffect, useState } from "react";
import { LoadingSpinner, ErrorDisplay, ExternalLinkIcon } from "./Home";

interface RepoDetail {
  name: string;
  description: string;
  html_url: string;
  language: string;
  forks_count: number;
  open_issues_count: number;
  watchers_count: number;
}

function RepoDetails({ repoName, onBack }: { repoName: string, onBack: () => void }) {
    const [repo, setRepo] = useState<RepoDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
  
    useEffect(() => {
      fetch(`https://api.github.com/repos/godaddy/${repoName}`)
        .then(res => {
          if (!res.ok) throw new Error(`Repo details fetch failed: ${res.status}`);
          return res.json();
        })
        .then(data => setRepo(data))
        .catch(err => setError(err.message))
        .finally(() => setLoading(false));
    }, [repoName]);
  
    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorDisplay message={error} />;
    if (!repo) return <ErrorDisplay message="Repository not found." />;
  
    return (
      <div className="min-h-screen bg-gray-100 font-sans p-4 sm:p-6 lg:p-8">
          <div className="max-w-4xl mx-auto">
              <button onClick={onBack} className="mb-6 px-4 py-2 text-sm font-medium bg-white border rounded-md hover:bg-gray-100 transition-colors">
                  &larr; Back to List
              </button>
              <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border">
                  <div className="flex justify-between items-start">
                      <h2 className="text-3xl font-bold text-gray-800">{repo.name}</h2>
                      <a href={repo.html_url} className="flex items-center space-x-2 px-4 py-2 text-sm font-semibold text-white bg-gray-800 rounded-lg hover:bg-gray-900 transition-colors" target="_blank" rel="noopener noreferrer">
                          <span>View on GitHub</span>
                          <ExternalLinkIcon />
                      </a>
                  </div>
                  <p className="mt-2 text-lg text-gray-600">{repo.description}</p>
                  <div className="mt-6 border-t pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                      <div><p className="text-sm text-gray-500">Language</p><p className="text-xl font-bold text-gray-800">{repo.language || 'N/A'}</p></div>
                      <div><p className="text-sm text-gray-500">Watchers</p><p className="text-xl font-bold text-gray-800">{repo.watchers_count.toLocaleString()}</p></div>
                      <div><p className="text-sm text-gray-500">Forks</p><p className="text-xl font-bold text-gray-800">{repo.forks_count.toLocaleString()}</p></div>
                      <div><p className="text-sm text-gray-500">Open Issues</p><p className="text-xl font-bold text-gray-800">{repo.open_issues_count.toLocaleString()}</p></div>
                  </div>
              </div>
          </div>
      </div>
    );
  }

export default RepoDetails;
