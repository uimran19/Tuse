import { FaPaintBrush } from "react-icons/fa";

export default function BrushButton({ onClick, tool, value, className }) {
  return (
    <button value={value} onClick={onClick} className={className}>
      <FaPaintBrush />
    </button>
  );
}
