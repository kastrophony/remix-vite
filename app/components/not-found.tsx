import { routes } from "../routes.ts";

export function NotFoundPage() {
  return () => (
    <article>
      <p>404</p>
      <h1>Page not found</h1>
      <p>
        Try going back to the{" "}
        <a href={routes.home.href()}>
          home page
        </a>
        .
      </p>
    </article>
  );
}
