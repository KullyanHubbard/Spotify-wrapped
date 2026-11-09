import { notFound } from "next/navigation";
import WrappedViewer from "@/components/WrappedViewer";
import { DESIGNS, isDesignId } from "@/designs";

export function generateStaticParams() {
  return Object.keys(DESIGNS).map((design) => ({ design }));
}

export default async function WrappedDesignPage({ params }: PageProps<"/wrapped/[design]">) {
  const { design } = await params;
  if (!isDesignId(design)) notFound();
  return <WrappedViewer design={design} />;
}
