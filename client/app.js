import EnemyMap from './EnemyMap';
import MyMap from './MyMap';
// import MapSea from './MapSea';

// const map = new MapSea('sea', 10, 30);
// console.log(map.getCanvas());
// console.log('map.setCurrentShip(2, 9, 3, \'VERTICAL\')',
// map.setCurrentShip(2, 9, 3, 'VERTICAL'));
// console.log('map.getCurrentShip()', map.getCurrentShip());
// console.log('map.addShipToMap()', map.addShipToMap());
// console.log('map.getCurrentShip()', map.getCurrentShip());
// console.log('map.setCurrentShip(9, 8, 3, \'HORIZONTAL\')',
// map.setCurrentShip(9, 8, 3, 'HORIZONTAL'));
// console.log('map.getCurrentShip()', map.getCurrentShip());
// console.log('map.addShipToMap()', map.addShipToMap());
// console.log('map.getCurrentShip()', map.getCurrentShip());
// console.log('map.attackCell(8, 2)', map.attackCell(2, 8));
// console.log('map.setCurrentShip(4, 8, 1, \'HORIZONTAL\')',
// map.setCurrentShip(4, 8, 1, 'HORIZONTAL'));
// console.log('map.addShipToMap()', map.addShipToMap());
// console.log('map.moveShip(4, 8)', map.moveShip(4, 8));
// console.log('map.getCurrentShip()', map.getCurrentShip());

// console.log('map.renderGrid()', map.renderGrid());
// console.log('map.renderShips()', map.renderShips());
// console.log('map.renderInactiveCell(2, 3, \'red\')', map.renderInactiveCell(2, 3, 'red'));
// console.log('map.renderInactiveCell(3, 3, \'red\')', map.renderInactiveCell(3, 3, 'red'));
// console.log('map.renderInactiveCell(4, 3)', map.renderInactiveCell(4, 4));
// console.log('map.renderInactiveCell(5, 3)', map.renderInactiveCell(5, 4));

window.EnemyMap = new EnemyMap('sea', 10, 30);
const myMap = new MyMap('sea', 10, 30);

// const map = new EnemyMap('sea', 10, 30);
// console.log(map.setInactiveCell(2, 2));
// console.log(map.setInactiveCell(3, 2));
// console.log(map.setInactiveCellShip(9, 9));
// console.log(map.setInactiveSpaceShip({ x: 0, y: 7 }, { x: 4, y: 7 }));
// console.log(map.renderCanvas());

console.log(myMap.setCurrentShip(2, 2, 3, 'HORIZONTAL'));
console.log(myMap.addShipToMap());

console.log(myMap.renderCanvas());

