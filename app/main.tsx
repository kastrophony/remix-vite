import { createRoot } from "remix/ui";
import { SPA } from "remix/ui/spa";

import { Fallback } from "./components/layout.tsx";
import { router } from "./router.tsx";
import "./styles.css";

let root = createRoot(document.getElementById("app")!, {
  frameInit: {
    resolveFrame(src, options) {
      let headers = new Headers();
      if (options?.target) headers.set("x-remix-target", options.target);
      return router.fetch(src, { headers, signal: options?.signal });
    },
  },
});

root.addEventListener("error", (event) => {
  console.error("Remix UI root failed:", event.error);
});

root.render(<SPA router={router} fallback={<Fallback />} />);
