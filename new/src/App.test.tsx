import { render, screen } from "@testing-library/react";
import App from "./App";

test.skip("renders learn react link", () => {
    render(<App />);
    const app = screen.getByLabelText("App");
    expect(app).toBeInTheDocument();
});
