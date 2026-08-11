import { type Handle, type RemixNode } from "remix/ui";
import { SPA } from "remix/ui/spa";

interface LayoutProps {
  children?: RemixNode;
}

export function Fallback() {
  return () => (
    <Layout>
      <LoadingPage />
    </Layout>
  );
}

export function Layout(handle: Handle<LayoutProps>) {
  let router = handle.context.get(SPA);

  return () => {
    let isPending = router.pending != null;
    if (isPending) return <LoadingPage />;
    return handle.props.children;
  };
}

function LoadingPage() {
  return () => <>Loading&hellip;</>;
}
