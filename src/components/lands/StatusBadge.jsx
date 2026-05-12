import { cn } from "@/lib/utils";
import { CheckCircle2, Clock, AlertTriangle } from "lucide-react";

const map = {
  registered: {
    label: "Registered",
    className: "bg-success/10 text-success border-success/30",
    Icon: CheckCircle2,
  },
  pending_transfer: {
    label: "Pending transfer",
    className: "bg-warning/15 text-warning-foreground border-warning/40",
    Icon: Clock,
  },
  disputed: {
    label: "Disputed",
    className: "bg-destructive/10 text-destructive border-destructive/30",
    Icon: AlertTriangle,
  },
};

export function StatusBadge({ status, className }) {
  const cfg = map[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        cfg.className,
        className,
      )}
    >
      <cfg.Icon className="h-3.5 w-3.5" />
      {cfg.label}
    </span>
  );
}
