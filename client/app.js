import MapSea from './MapSea';

const map = new MapSea('sea', 10, 30);
console.log(map.getCanvas());
console.log('map.setCurrentShip(2, 9, 3, \'VERTICAL\')', map.setCurrentShip(2, 9, 3, 'VERTICAL'));
console.log('map.getCurrentShip()', map.getCurrentShip());
console.log('map.addShipToMap()', map.addShipToMap());
console.log('map.getCurrentShip()', map.getCurrentShip());
console.log('map.setCurrentShip(9, 8, 3, \'HORIZONTAL\')', map.setCurrentShip(9, 8, 3, 'HORIZONTAL'));
console.log('map.getCurrentShip()', map.getCurrentShip());
console.log('map.addShipToMap()', map.addShipToMap());
console.log('map.getCurrentShip()', map.getCurrentShip());
console.log('map.attackCell(8, 2)', map.attackCell(2, 8));
console.log('map.setCurrentShip(4, 8, 1, \'HORIZONTAL\')', map.setCurrentShip(4, 8, 1, 'HORIZONTAL'));
console.log('map.addShipToMap()', map.addShipToMap());
console.log('map.moveShip(4, 8)', map.moveShip(4, 8));
console.log('map.getCurrentShip()', map.getCurrentShip());

console.log('map.renderGrid()', map.renderGrid());
console.log('map.renderShips()', map.renderShips());

