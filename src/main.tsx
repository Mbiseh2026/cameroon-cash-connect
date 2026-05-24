import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { getLang } from "./lib/i18n";

document.documentElement.lang = getLang();

createRoot(document.getElementById("root")!).render(<App />);
