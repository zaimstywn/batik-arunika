import { PackageSearch } from "lucide-react";
import { cn } from "@/lib/utils";

type EmptyStateProps = {
  title?: string;
  message?: string;
  className?: string;
  action?: React.ReactNode;
};

export function EmptyState({
  title = "Tidak ada data yang ditemukan",
  message = "Belum ada data untuk ditampilkan saat ini.",
  className,
  action,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-card px-6 py-12 text-center",
        className
      )}
    >
      <PackageSearch className="size-8 text-muted-foreground" aria-hidden="true" />
      <p className="text-sm font-semibold text-foreground">{title}</p>
      <p className="max-w-sm text-sm text-muted-foreground">{message}</p>
      {action}
    </div>
  );
}
