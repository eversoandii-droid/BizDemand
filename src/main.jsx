import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import BizDemand from "../BizDemand.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BizDemand />
  </StrictMode>,
);
