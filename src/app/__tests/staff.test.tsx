import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import StaffDashboard from "../staff/page";
import { expect, test, vi, beforeEach } from "vitest";

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

beforeEach(() => {
  mockFetch.mockReset();
});

test("renders the Staff Dashboard with KPIs and heatmap", async () => {
  render(<StaffDashboard />);

  // Check titles
  expect(screen.getByRole("heading", { name: "Command Center" })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "Live Crowd Density Heatmap" })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "GenAI Incident Reports" })).toBeInTheDocument();

  // Check KPIs
  expect(screen.getByText("Total Attendance")).toBeInTheDocument();
  expect(screen.getByText("Gate Flow (Avg Wait)")).toBeInTheDocument();
  expect(screen.getByText("Sustainability Score")).toBeInTheDocument();

  // Check default reports
  expect(screen.getByText("AI Summary: Gate D Congestion")).toBeInTheDocument();
  expect(screen.getByText("Sustainability Alert")).toBeInTheDocument();
});

test("generates a new AI report when button is clicked", async () => {
  mockFetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({ report: "Test New Generated Report Summary" }),
  });

  render(<StaffDashboard />);

  const btn = screen.getByRole("button", { name: "Generate New AI Report" });
  fireEvent.click(btn);

  expect(btn).toHaveTextContent("Generating report...");

  await waitFor(() => {
    expect(screen.getByText(/AI Intelligence Report/)).toBeInTheDocument();
    expect(screen.getByText("Test New Generated Report Summary")).toBeInTheDocument();
  });
});

test("handles API error gracefully when generating report", async () => {
  mockFetch.mockResolvedValueOnce({
    ok: false,
    status: 500,
  });

  render(<StaffDashboard />);

  const btn = screen.getByRole("button", { name: "Generate New AI Report" });
  fireEvent.click(btn);

  // After failure, the button should return to its original state
  await waitFor(() => {
    expect(screen.getByRole("button", { name: "Generate New AI Report" })).toBeInTheDocument();
  });

  // No new AI Intelligence Report should have been added
  expect(screen.queryByText(/AI Intelligence Report/)).not.toBeInTheDocument();
});

test("generate button is disabled while loading", async () => {
  // Return a promise that never resolves to keep loading state
  mockFetch.mockImplementationOnce(() => new Promise(() => {}));

  render(<StaffDashboard />);

  const btn = screen.getByRole("button", { name: "Generate New AI Report" });
  fireEvent.click(btn);

  // Button should show loading text and be disabled
  expect(screen.getByRole("button", { name: "Generating report..." })).toBeDisabled();
});
