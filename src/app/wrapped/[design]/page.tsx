import { Suspense } from "react";
import { notFound } from "next/navigation";
import WrappedViewer from "@/components/WrappedViewer";
import { DESIGNS, isDesignId } from "@/designs";

export function generateStaticParams() {
  return Object.keys(DESIGNS).map((design) => ({ design }));
}

// params dibaca di dalam Suspense supaya navigasi tetap instan (aturan Instant Navigation Next.js).
async function DesignViewer({ params }: { params: PageProps<"/wrapped/[design]">["params"] }) {
  const { design } = await params;
  if (!isDesignId(design)) notFound();
  return <WrappedViewer design={design} />;
}

export default function WrappedDesignPage(props: PageProps<"/wrapped/[design]">) {
  return (
    <Suspense fallback={null}>
      <DesignViewer params={props.params} />
    </Suspense>
  );
}
