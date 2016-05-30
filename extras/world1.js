$(document).ready(function(){
	var container = $('#container'); //Div container

	/*
	 * Declaration des element de base
	 */
	var renderer, camera, mesh, scene;

	scene = new THREE.Scene();
	camera = THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
	renderer = new THREE.WebGLRender();
	renderer.setSize(window.innerWidth, window.innerHeight);
	$('#container').appendChild(renderer.domElement);

	var boxGeometry = new THREE.BoxGeometry(1,1,1);
	var material = new THREE.MeshBasicMaterial({color : "0x00ff00"});
	var cube = new THREE.Mesh(boxGeometry, material);

	scene.add(cube);
	camera.position.z = 5;

	function render() {
		requestAnimationFrame( render );
		renderer.render( scene, camera );
	}
	render();



});