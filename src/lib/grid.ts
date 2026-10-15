export function targetCell(
  index: number,
  key: string,
  size: number,
  ctrlKey = false,
) {
  const row = Math.floor(index / size);
  const column = index % size;
  const last = size - 1;

  switch (key) {
    case "ArrowLeft":
      return row * size + Math.max(column - 1, 0);
    case "ArrowRight":
      return row * size + Math.min(column + 1, last);
    case "ArrowUp":
      return Math.max(row - 1, 0) * size + column;
    case "ArrowDown":
      return Math.min(row + 1, last) * size + column;
    case "Home":
      return ctrlKey ? 0 : row * size;
    case "End":
      return ctrlKey ? size * size - 1 : row * size + last;
    default:
      return null;
  }
}
