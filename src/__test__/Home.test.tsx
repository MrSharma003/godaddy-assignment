import "@testing-library/jest-dom";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Home } from "../pages/Home";
import { vi } from "vitest";

// Mock fetch to return a fake repo list
globalThis.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () =>
      Promise.resolve([
        {
          id: 1,
          name: "test-repo",
          html_url: "https://github.com/godaddy/test-repo",
          description: "A test repo",
          language: "TypeScript",
          stargazers_count: 10,
          watchers_count: 10,
          forks_count: 2,
          open_issues_count: 1,
          archived: false,
          updated_at: new Date().toISOString(),
        },
      ]),
  })
) as any;

test("renders loading state initially", () => {
  render(
    <MemoryRouter>
      <Home onRepoClick={() => {}} />
    </MemoryRouter>
  );
  expect(screen.getByText(/loading/i)).toBeInTheDocument();
});

test("calls onRepoClick when a repo is clicked", async () => {
  const handleRepoClick = vi.fn();

  render(
    <MemoryRouter>
      <Home onRepoClick={handleRepoClick} />
    </MemoryRouter>
  );

  // Wait for the repo to appear
  await waitFor(() => {
    expect(screen.getByText("test-repo")).toBeInTheDocument();
  });

  // Simulate clicking the repo link
  fireEvent.click(screen.getByText("test-repo"));

  expect(handleRepoClick).toHaveBeenCalledWith("test-repo");
});
