import { createController } from "remix/router";

import { routes } from "../routes.ts";
import { HomePage } from "../views/home.tsx";

export default createController(routes, {
  actions: {
    home(_context) {
      return <HomePage />;
    },
  },
});
