import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AppProvider } from "./context/AppProvider";
import { Page } from "./components/layout/Page";

export default function App() {
    return (
        <BrowserRouter>
            <AppProvider>
                <Routes>
                    <Route path="*" element={<Page />} />
                </Routes>
            </AppProvider>
        </BrowserRouter>
    );
}
