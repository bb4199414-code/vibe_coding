import { render, screen, fireEvent } from "@testing-library/react";
import FanHub from "../fan-hub/page";
import { expect, test } from "vitest";

test("renders the Fan Portal layout and elements", () => {
  render(<FanHub />);

  // Check titles
  expect(screen.getByRole("heading", { name: "Fan Portal" })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "Match Status" })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "Transit & Access" })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "Quick Operations Intel" })).toBeInTheDocument();

  // Check buttons
  expect(screen.getByRole("button", { name: "🚌 Public Transit" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "♿ Accessibility Routes" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "🍔 Food Wait Times" })).toBeInTheDocument();
});

test("shows operations intel detail when faq button is clicked", () => {
  render(<FanHub />);

  // Click transit button
  const transitBtn = screen.getByRole("button", { name: "🚌 Public Transit" });
  fireEvent.click(transitBtn);

  // Check transit content is displayed
  expect(screen.getByText(/Shuttles run every 5 minutes/i)).toBeInTheDocument();

  // Click it again to close
  fireEvent.click(transitBtn);
  expect(screen.queryByText(/Shuttles run every 5 minutes/i)).not.toBeInTheDocument();
});

test("aria-expanded attribute toggles correctly on FAQ buttons", () => {
  render(<FanHub />);

  const transitBtn = screen.getByRole("button", { name: "🚌 Public Transit" });

  // Initially not expanded
  expect(transitBtn).toHaveAttribute("aria-expanded", "false");

  fireEvent.click(transitBtn);
  expect(transitBtn).toHaveAttribute("aria-expanded", "true");

  fireEvent.click(transitBtn);
  expect(transitBtn).toHaveAttribute("aria-expanded", "false");
});

test("clicking a different FAQ closes the previous one", () => {
  render(<FanHub />);

  const transitBtn = screen.getByRole("button", { name: "🚌 Public Transit" });
  const foodBtn = screen.getByRole("button", { name: "🍔 Food Wait Times" });

  fireEvent.click(transitBtn);
  expect(screen.getByText(/Shuttles run every 5 minutes/i)).toBeInTheDocument();

  // Clicking food should replace transit content
  fireEvent.click(foodBtn);
  expect(screen.queryByText(/Shuttles run every 5 minutes/i)).not.toBeInTheDocument();
  expect(screen.getByText(/Hot dog stand/i)).toBeInTheDocument();
});
