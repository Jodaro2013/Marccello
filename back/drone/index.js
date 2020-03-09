const drones = {};

function Drone(id,coords, destination, cb) {
	const [x,y] = coords.split(",").map(n=>Number(n));
	const [x2,y2] = destination.split(",").map(n=>Number(n));
	this.x = x;
	this.y = y;

	this.destination = {x: x2, y: y2};

	this.orientation = Math.atan((this.destination.y-this.y)/(this.destination.x-this.x))
	//console.log((this.destination.y-this.y), (this.destination.x-this.x), (this.destination.y-this.y)/(this.destination.x-this.x), this.orientation)

	this.speed = 0.002;

	drones[id] = this;
}

Drone.prototype.step = function () {
	if (this.distance() < this.speed) return;
	this.x += Math.cos(this.orientation)*this.speed;
	this.y += Math.sin(this.orientation)*this.speed;
}

Drone.prototype.distance = function () {
	return Math.sqrt((this.destination.x - this.x)**2+(this.destination.y - this.y)**2)
}

function startDrone(id, destination) {
	new Drone(id, "-34.667468,-58.361285", destination);

	if (Object.keys(drones).length !== 1) return;
	let interval = setInterval(()=>{
		for (let key in drones) drones[key].step()
		if (Object.keys(drones).length === 0) clearInterval(interval);
	}, 1000)
}

function statusDrone(id) {
	return { x: drones[id].x, y: drones[id].y, distance: drones[id].distance() }
}

function clearDrone(id) {
	return delete drones[id];
}

module.exports = { startDrone, statusDrone, clearDrone }