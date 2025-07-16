export default function BrushButton({ onClick, tool, value }) {
  return (
    <button
      value={value}
      onClick={onClick}
      className={tool === "brush" ? "active" : ""}
    >
      brush
    </button>
  );
}
