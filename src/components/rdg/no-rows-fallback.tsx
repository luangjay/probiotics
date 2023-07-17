export function NoRowsFallback() {
  return (
    <div
      className="flex h-full w-full items-center justify-center"
      style={{ textAlign: "center", gridColumn: "1/-1" }}
    >
      Nothing to show (´・ω・`)
    </div>
  );
}
