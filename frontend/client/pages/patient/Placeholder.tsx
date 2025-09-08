import { ReactNode } from "react";

export default function Placeholder({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="rounded-xl border bg-white p-10 text-center shadow-sm">
      <h1 className="text-2xl font-semibold">{title}</h1>
      <p className="mt-2 text-muted-foreground">This page is not yet implemented. Continue prompting to fill in this page.</p>
      {children}
    </div>
  );
}
