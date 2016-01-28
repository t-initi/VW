//Variables Globales

// Rotation
var mouse3D, isMouseDown = false,
    onMouseDownPosition, radious = 1600,
    theta = 90,
    onMouseDownTheta = 45,
    phi = 60,
    onMouseDownPhi = 60,
    isShiftDown = false;

/** Key codes**/
var UP = 38 , DOWN = 40, LEFT= 37, RIGHT = 39;
var cameraSpeed = 100;



$(document).ready(function(){
    var doc = $(document);
	var container = document.getElementById('container');
	var renderer, scene, camera, mesh, tree;



    init();
    animate();


    doc.mousemove(function(event){
       // moveCamera(event);

       //Affichage des coordonnees de la souris sur l'ecrn
        //$("#span1").text("Valeur de X = "+event.pageX+" Valeur de Y ="+ event.pageY);
        
    });

    doc.keydown(function(event){
        keyPressed(event);
        
    });

 


/** initialize **/
function init () {

	// body...
    // on initialise le moteur de rendu
    renderer = new THREE.WebGLRenderer();
    // on initialise la scène
    scene = new THREE.Scene();	//0xcce0ff
    scene.fog = new THREE.Fog( 0xcce0ff, 500, 10000 );
    
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
	var groundMaterial = new THREE.MeshPhongMaterial( { color: 0xffffff, specular: 0x111111, map: groundTexture} );
	ground = new THREE.Mesh( new THREE.PlaneBufferGeometry( 20000, 20000 ), groundMaterial );
	ground.position.y = -250;
	ground.rotation.x = - Math.PI / 2;
	ground.receiveShadow = true;
	scene.add( ground );

                
    // on créé un  cube au quel on définie un matériau puis on l’ajoute à la scène 
    var geometry = new THREE.CubeGeometry( 150, 150, 150 );
    var material = new THREE.MeshLambertMaterial( { color: 0xb54fa11 } );
    
    cube = new THREE.Mesh( geometry, material );
    scene.add( cube );


    /******************/
    // instantiate a loader
var loader = new THREE.ImageLoader();
//loader.load("./img/images/tree.png", function(){alert("Image loaded")});


// load a image resource

}
/**
* Mouvement de la souris
**/

/*
function onDocumentMouseMove(event){
        isMouseDown = true;
    event.preventDefault();
    if(isMouseDown){
        //theta = - ((event.clientX - onMouseDownPosition.x) * 0.5) + onMouseDownTheta;
        //phi = ((event.clientY - onMouseDownPosition.y) * 0.5) + onMouseDownPhi;

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
*/



function Document_OnMouseDown(event) {
    event.preventDefault();

    onMouseDownTheta = theta;
    onMouseDownPhi = phi;
   // onMouseDownPosition.x = event.clientX;
    //onMouseDownPosition.y = event.clientY;
}

   function moveCamera(event){
        event.preventDefault();
         camera.position.x += 0.9;
    }

    function mouseRotateCamera(event){
        event.preventDefault();
        
        doc.mousedown(function(){
            phi = 1;
            theta = 10;
             $("#span1").text("Valeur de Phi = "+phi+" Valeur de Theta ="+ theta);
        });
            

    }


/**
* Gère la déplacement (avant et arrière) de l'utilisateur
*/
function keyPressed(event){
    // UP = 38 , DOWN = 40 LEFT= 37 RIGHT = 39
    //alert(event.keyCode);

    var keycode = event.keyCode || event.which;
    //alert(keycode);
    switch(keycode){
        case UP:
            camera.position.z -= cameraSpeed
            break;
        case DOWN:
            camera.position.z += cameraSpeed;
        break;
        case RIGHT:
            camera.rotation.y -= 0.01;
            break;
        case LEFT:
            camera.rotation.y += 0.01;
        break;
    }
}

function animate(){
    // on appel la fonction animate() récursivement à chaque frame
    requestAnimationFrame( animate );
    
    // on fait tourner le cube sur ses axes x et y
    //camera.position.z -= 2;
    //cube.position.z -=5 ;
   // camera.position.y = yP;


    // on effectue le rendu de la scène
    renderer.render( scene, camera );
}

//animation des cubes
function animateCubes(){
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.009;
    cube.rotation.z += 0.009;

}
function animateGround(){
    ground.rotation.x += 0.009;
    ground.rotation.y += 0.002;
    ground.rotation.z += 0.009;

}
/**
* TO DO
* Eau, desert , arbres
* Agrandir le terrain
* Implementer la souris
**/



});