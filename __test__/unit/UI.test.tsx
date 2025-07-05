import App from "../../src/App";
import { render } from "@testing-library/react";

test("should render search input", () => {
  const { getByRole } = render(<App />);

  const searchInput = getByRole("searchbox");
  expect(searchInput).toBeVisible();
});
