import { AppLayout } from "@/components/layout/AppLayout";

export default function Placeholder({ title }: { title: string }) {
  return (
    <AppLayout headerTitle={title}>
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold">{title}</h2>
          <p className="text-muted-foreground mt-2 max-w-md">
            This page is a placeholder. Continue the conversation to generate its full contents.
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
