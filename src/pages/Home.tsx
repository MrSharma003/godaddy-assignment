import React, { useEffect, useState, useMemo } from "react";

// --- HELPER COMPONENTS ---

export const ExternalLinkIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="inline-block ml-1 opacity-60 group-hover:opacity-100"
  >
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

export const LoadingSpinner = () => (
  <div className="flex justify-center items-center min-h-screen bg-gray-50">
    <div className="text-center">
      <svg
        className="mx-auto h-12 w-12 text-gray-400 animate-spin"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      <p className="mt-4 text-lg text-gray-600 font-semibold">Loading...</p>
    </div>
  </div>
);

export const ErrorDisplay = ({ message }: { message: string | null }) => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div className="text-center p-6 bg-red-50 border-2 border-red-200 text-red-700 rounded-lg shadow-md max-w-lg">
      <h3 className="font-bold text-xl mb-2">Error Fetching Data</h3>
      <p className="text-base mb-4">{message}</p>
      <p className="text-sm">
        Please check your network connection and try again.
      </p>
    </div>
  </div>
);

interface Repo {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  watchers_count: number;
  forks_count: number;
  open_issues_count: number;
  archived: boolean;
  updated_at: string;
}

type SortKey =
  | "name"
  | "watchers_count"
  | "forks_count"
  | "open_issues_count"
  | "updated_at";
type SortDirection = "asc" | "desc";

export function Home({
  onRepoClick,
}: {
  onRepoClick: (repoName: string) => void;
}) {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>("watchers_count");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRepos, setTotalRepos] = useState(0);

  useEffect(() => {
    const fetchRepos = async () => {
      setLoading(true);
      try {
        const orgResponse = await fetch("https://api.github.com/orgs/godaddy");
        if (!orgResponse.ok)
          throw new Error(`Org fetch failed: ${orgResponse.status}`);
        const orgData = await orgResponse.json();
        setTotalRepos(orgData.public_repos);

        const reposResponse = await fetch(
          `https://api.github.com/orgs/godaddy/repos?per_page=${pageSize}&page=${currentPage}`
        );
        if (!reposResponse.ok)
          throw new Error(`Repos fetch failed: ${reposResponse.status}`);
        const data: Repo[] = await reposResponse.json();
        setRepos(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRepos();
  }, [currentPage, pageSize]);

  const sortedRepos = useMemo(() => {
    const sorted = [...repos];
    sorted.sort((a, b) => {
      const valA = a[sortKey];
      const valB = b[sortKey];
      let comparison = 0;
      if (typeof valA === "string" && typeof valB === "string") {
        comparison = valA.localeCompare(valB);
      } else if (typeof valA === "number" && typeof valB === "number") {
        comparison = valA - valB;
      } else if (sortKey === "updated_at") {
        comparison = new Date(valA).getTime() - new Date(valB).getTime();
      }
      return sortDirection === "desc" ? -comparison : comparison;
    });
    return sorted;
  }, [repos, sortKey, sortDirection]);

  const handleSort = (key: SortKey) => {
    setSortKey(key);
    setSortDirection((prev) =>
      sortKey === key ? (prev === "asc" ? "desc" : "asc") : "desc"
    );
  };

  const SortArrow = ({ columnKey }: { columnKey: SortKey }) => {
    if (sortKey !== columnKey)
      return <span className="w-4 h-4 inline-block"></span>;
    return (
      <span className="text-blue-600">
        {sortDirection === "desc" ? "↓" : "↑"}
      </span>
    );
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay message={error} />;

  const totalPages = Math.ceil(totalRepos / pageSize);

  return (
    <div className="min-h-screen bg-gray-100 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* pagination logic */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700">Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="p-1 border border-gray-300 rounded-md bg-white text-sm"
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm font-medium bg-white border rounded-md hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage((p) => p + 1)}
                disabled={currentPage >= totalPages}
                className="px-3 py-1 text-sm font-medium bg-white border rounded-md hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
        {/* List logic */}
        <div className="overflow-x-auto bg-white rounded-lg shadow-lg border border-gray-200">
          <table className="min-w-full table-auto border-collapse">
            <thead className="bg-gray-50">
              <tr>
                {[
                  { key: "name", label: "Name" },
                  { key: "watchers_count", label: "Wathcers" },
                  { key: "forks_count", label: "Forks" },
                  { key: "open_issues_count", label: "Issues" },
                  { key: "updated_at", label: "Last Updated" },
                ].map((col) => (
                  <th
                    key={col.key}
                    onClick={() => handleSort(col.key as SortKey)}
                    className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider cursor-pointer select-none border-b-2 border-gray-200 hover:bg-gray-100"
                  >
                    <div className="flex items-center space-x-1">
                      <span>{col.label}</span>
                      <SortArrow columnKey={col.key as SortKey} />
                    </div>
                  </th>
                ))}
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider border-b-2 border-gray-200">
                  Language
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider border-b-2 border-gray-200">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sortedRepos.map((repo) => (
                <tr
                  key={repo.id}
                  onClick={() => onRepoClick(repo.name)}
                  className="hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-blue-600 group">
                      {repo.name}
                    </div>
                    <p
                      className="text-xs text-gray-500 max-w-xs truncate mt-1"
                      title={repo.description || ""}
                    >
                      {repo.description || "No description"}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800 font-medium text-center">
                    {repo.watchers_count.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800 font-medium text-center">
                    {repo.forks_count.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800 font-medium text-center">
                    {repo.open_issues_count.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                    {new Date(repo.updated_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {repo.language || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {repo.archived ? (
                      <span className="px-3 py-1 text-xs font-semibold text-red-800 bg-red-100 rounded-full">
                        Archived
                      </span>
                    ) : (
                      <span className="px-3 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
                        Active
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
