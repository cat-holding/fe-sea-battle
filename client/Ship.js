const Ship = (posStart, posEnd, color = '#2f4f4f') => {
  const cells = [];
  const sizeX = Math.abs(posStart.x - posEnd.x);
  const sizeY = Math.abs(posStart.y - posEnd.y);
  const size = sizeX > 0 ? sizeX + 1 : sizeY > 0 ? sizeY + 1 : 1;

  for (let i = 0; i < size; i++) {
    cells.push({
      x: sizeX ? posStart.x + i : posStart.x,
      y: sizeY ? posStart.y + i : posStart.y,
      state: true,
    });
  }

  return {
    size,
    color,
    cells,
  };
};

export default Ship;
