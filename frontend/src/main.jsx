import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import ResultPage from "./ResultsPage.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App></App>}></Route>
        <Route path="/results/:id" element={<ResultPage></ResultPage>}></Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
