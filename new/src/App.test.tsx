import { render, screen } from "@testing-library/react";
import App from "./App";
import { describe, it, expect } from "vitest";

describe("App", () => {
    it.skip("renders learn react link", () => {
        render(<App />);
        const app = screen.getByLabelText("App");
        expect(app).toBeInTheDocument();
    });
});
