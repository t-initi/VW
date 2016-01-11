$(document).ready(function(){
	var container = document.getElementById('container');
	var renderer, scene, camera, mesh;



init();
animate();
/** initialize **/
function init () {

	// body...
    // on initialise le moteur de rendu
    renderer = new THREE.WebGLRenderer();
    // on initialise la scène
    scene = new THREE.Scene();	//0xcce0ff
    scene.fog = new THREE.Fog( 0xcde0ff, 500, 10000 );
    
    // renderer = new THREE.CanvasRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setClearColor( scene.fog.color );
    container.appendChild(renderer.domElement);

    

    // on initialise la camera que l’on place ensuite sur la scène
    camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.y = 50;
    camera.position.z=1500;
    scene.add(camera);

    //Lumiere
    var light, materials;
	scene.add( new THREE.AmbientLight( 0x666666 ) );

	light = new THREE.DirectionalLight( 0xdfebff, 1.1 ); //0xdfebff 1.75
	light.position.set( 50, 200, 100 );
	light.position.multiplyScalar( 1.3 );
	light.castShadow = true;
	light.shadowCameraVisible = true;

	light.shadowMapWidth = 1024;
	light.shadowMapHeight = 1024;

	var d = 300;

	light.shadowCameraLeft = -d;
	light.shadowCameraRight = d;
	light.shadowCameraTop = d;
	light.shadowCameraBottom = -d;

	light.shadowCameraFar = 1000;

	scene.add( light );
    
    //Terrain
	var groundTexture = THREE.ImageUtils.loadTexture( "./img/grasslight-big.jpg" );
	groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
	groundTexture.repeat.set( 25, 25 );
	groundTexture.anisotropy = 16;
							//
	var groundMaterial = new THREE.MeshPhongMaterial( { color: 0xffffff, specular: 0x111111, map: groundTexture } );
	ground = new THREE.Mesh( new THREE.PlaneBufferGeometry( 20000, 20000 ), groundMaterial );
	ground.position.y = -250;
	ground.rotation.x = - Math.PI / 2;
	ground.receiveShadow = true;
	scene.add( ground );

                
    // on créé un  cube au quel on définie un matériau puis on l’ajoute à la scène 
    /*var geometry = new THREE.CubeGeometry( 200, 100, 100 );
    var material = new THREE.MeshBasicMaterial( { color: 0xffff45, wireframe: false } );
    cube = new THREE.Mesh( geometry, material );
    scene.add( cube );*/
}
/**
* Mouvement de la souris
**/
function onDocumentMouseMove(event){

    event.preventDefault();
    if(isMouseDown){
        theta = - ((event.clientX - onMouseDownPosition.x) * 0.5) + onMouseDownTheta;
        phi = ((event.clientY - onMouseDownPosition.y) * 0.5) + onMouseDownPhi;

        phi = Math.min(180, Math.max(0,phi));

        camera.position.x = radious * Math.sin(theta * Math.PI / 360) * Math.cos(phi * Math.PI /360);
        camera.position.y = radious * Math.sin(phi * Math.PI /360);
        camera.position.z = radious * Math.cos(theta* Math.PI /360) * Math.cos(phi * Math.PI / 360);
        camera.updateMatrix();
    }

    mouse3D = projector.unprojectVector(new THREE.Vector3((event.clientX / renderer.domElement.width) * 2 - 1,
     - (event.clientY / renderer.domElement.height) * 2+1, 0.5), camera);
    ray.direction = mouse3D.subSelf(camera.position).normalize();
    interact();
    render();

}

function animate(){
    // on appel la fonction animate() récursivement à chaque frame
    requestAnimationFrame( animate );
    // on fait tourner le cube sur ses axes x et y

    //ground.rotation.x += 0.0001;
    //ground.rotation.y += 0.002;
    //ground.rotation.z += 0.009;

    //cube.rotation.x += 0.01;
    //cube.rotation.y += 0.009;
    //cube.rotation.z += 0.009;
    
    
    // on effectue le rendu de la scène
    renderer.render( scene, camera );
}



});