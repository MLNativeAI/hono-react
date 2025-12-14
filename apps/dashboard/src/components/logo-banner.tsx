export function LogoBanner() {
  return (
    <div className="flex items-center gap-2 px-2 py-1">
      <img src="/logo.svg" alt="PaperJet" className="h-8 w-8" />
      <span className="font-semibold text-lg">Hono + React</span>
    </div>
  );
}
