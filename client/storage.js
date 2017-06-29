export const data = {
  key: true,
  mapSize: 10,

};


export const Ship = (posStart, posEnd, color) => {
  const cells = [];
  const sizeX = Math.abs(posStart.x - posEnd.x);
  const sizeY = Math.abs(posStart.y - posEnd.y);
  const size = sizeX > 0 ? sizeX : sizeY > 0 ? sizeY : 1;

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
