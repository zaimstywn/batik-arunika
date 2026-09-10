import { CircleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ErrorStateProps = {
  title?: string;
  message?: string;
  className?: string;
  onRetry?: () => void;
  retryLabel?: string;
};

export function ErrorState({
  title = "Terjadi kesalahan",
  message = "Terjadi kesalahan saat memuat data. Silakan coba lagi.",
  className,
  onRetry,
  retryLabel = "Coba lagi",
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-xl border border-destructive/30 bg-destructive/5 px-6 py-12 text-center",
        className
      )}
      role="alert"
    >
      <CircleAlert className="size-8 text-destructive" aria-hidden="true" />
      <p className="text-sm font-semibold text-foreground">{title}</p>
      <p className="max-w-sm text-sm text-muted-foreground">{message}</p>
      {onRetry ? (
        <Button variant="outline" size="sm" onClick={onRetry} className="mt-1">
          {retryLabel}
        </Button>
      ) : null}
    </div>
  );
}
