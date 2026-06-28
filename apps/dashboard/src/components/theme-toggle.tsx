import { cn } from "@repo/ui/lib/utils";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

const modes = [
  { id: "light" as const, label: "Light", icon: Sun },
  { id: "dark" as const, label: "Dark", icon: Moon },
  { id: "system" as const, label: "System", icon: Monitor },
];

export function ModePicker() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="grid grid-cols-3 gap-2">
      {modes.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          type="button"
          onClick={() => setTheme(id)}
          aria-pressed={theme === id}
          className={cn(
            "flex flex-col items-center gap-2 rounded-lg border px-3 py-3 text-sm font-medium transition-all",
            theme === id
              ? "border-primary bg-primary/5 text-primary shadow-sm"
              : "border-border bg-background text-foreground hover:border-primary/40 hover:bg-accent",
          )}
        >
          <Icon className="h-5 w-5" />
          <span className="text-xs">{label}</span>
        </button>
      ))}
    </div>
  );
}
