import { render, screen } from "@testing-library/react";
import Home from "../page";
import { expect, test } from "vitest";

test("renders the Home landing page with FIFA Nexus AI title", () => {
  render(<Home />);
  
  // Check the title is rendered
  const heading = screen.getByRole("heading", { level: 1 });
  expect(heading).toHaveTextContent(/Welcome to/i);
  expect(heading).toHaveTextContent(/FIFA Nexus AI/i);

  // Check the Fan Portal and Command Center sections
  expect(screen.getByText("Fan Portal")).toBeInTheDocument();
  expect(screen.getByText("Command Center")).toBeInTheDocument();

  // Check buttons/links are rendered
  expect(screen.getByRole("link", { name: /Enter Fan Hub/i })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /Staff Dashboard/i })).toBeInTheDocument();
});
