import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ChatModal from "../ChatModal";
import { expect, test, vi, beforeEach } from "vitest";

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

beforeEach(() => {
  mockFetch.mockReset();
  // Mock scrollIntoView since jsdom doesn't support it
  window.HTMLElement.prototype.scrollIntoView = vi.fn();
});

test("toggles the chat modal open and close", async () => {
  render(<ChatModal />);

  // Modal should not be visible initially
  expect(screen.queryByText("Nexus AI Assistant")).not.toBeInTheDocument();

  // Click fab to open
  const fab = screen.getByRole("button", { name: "Open AI Assistant" });
  fireEvent.click(fab);

  // Modal header should be present
  expect(screen.getByText("Nexus AI Assistant")).toBeInTheDocument();

  // Click close button
  const closeBtn = screen.getByRole("button", { name: "Close chat" });
  fireEvent.click(closeBtn);

  // Modal should close
  expect(screen.queryByText("Nexus AI Assistant")).not.toBeInTheDocument();
});

test("sends message and renders reply", async () => {
  mockFetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({ reply: "Yes, I am Nexus AI. Gate C is at the north side." }),
  });

  render(<ChatModal />);

  // Open modal
  const fab = screen.getByRole("button", { name: "Open AI Assistant" });
  fireEvent.click(fab);

  // Find input
  const input = screen.getByLabelText("Type your message for Nexus AI");
  fireEvent.change(input, { target: { value: "Where is Gate C?" } });

  // Find send button and click
  const sendBtn = screen.getByRole("button", { name: "Send message" });
  fireEvent.click(sendBtn);

  // Verify it fetches chat API
  expect(mockFetch).toHaveBeenCalledWith("/api/chat", expect.objectContaining({
    method: "POST",
    body: JSON.stringify({ message: "Where is Gate C?" }),
  }));

  // Wait for AI response to render
  await waitFor(() => {
    expect(screen.getByText("Yes, I am Nexus AI. Gate C is at the north side.")).toBeInTheDocument();
  });
});

test("shows error message when network request fails", async () => {
  mockFetch.mockRejectedValueOnce(new Error("Network Error"));

  render(<ChatModal />);

  const fab = screen.getByRole("button", { name: "Open AI Assistant" });
  fireEvent.click(fab);

  const input = screen.getByLabelText("Type your message for Nexus AI");
  fireEvent.change(input, { target: { value: "Test message" } });

  const sendBtn = screen.getByRole("button", { name: "Send message" });
  fireEvent.click(sendBtn);

  await waitFor(() => {
    expect(screen.getByText(/trouble connecting/i)).toBeInTheDocument();
  });
});

test("submits message when Enter key is pressed", async () => {
  mockFetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({ reply: "Food wait times: Tacos 8 min" }),
  });

  render(<ChatModal />);

  const fab = screen.getByRole("button", { name: "Open AI Assistant" });
  fireEvent.click(fab);

  const input = screen.getByLabelText("Type your message for Nexus AI");
  fireEvent.change(input, { target: { value: "Food wait times?" } });
  fireEvent.keyDown(input, { key: "Enter" });

  await waitFor(() => {
    expect(screen.getByText("Food wait times: Tacos 8 min")).toBeInTheDocument();
  });
});

test("send button is disabled when input is empty", () => {
  render(<ChatModal />);

  const fab = screen.getByRole("button", { name: "Open AI Assistant" });
  fireEvent.click(fab);

  const sendBtn = screen.getByRole("button", { name: "Send message" });
  expect(sendBtn).toBeDisabled();
});
