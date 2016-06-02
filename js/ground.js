//Variables Globales
var statsDiv;
/// Rotation
var mouse3D, isMouseDown = false,
    onMouseDownPosition, radious = 1600,
    theta = 90,
    onMouseDownTheta = 45,
    phi = 60,
    onMouseDownPhi = 60,
    isShiftDown = false;

/** Key codes**/
var UP=38, DOWN = 40, LEFT= 37, RIGHT = 39;
var cameraSpeed = 100;
var presentPeriod = 0;

//MAIN
$(document).ready(function(){
    var doc = $(document);
	var renderer, scene, camera, mesh, tree, cylinder, waterGeometry, waterMesh, controls ;
    var timer = new Date();
    var tick = 0;
    var clock = new THREE.Clock();
    var ambientLight, light;
//CREATE DOM ELEMENTS
    //CONTAINER
    var container = document.getElementById('container');
    //INFO
    var info = document.createElement( 'div' );
        info.setAttribute("id","infos");
        info.innerHTML = 'Bienvenue sur Virtual World<br/><span style="font-style: italic;">par Ine Thierry & Hamidou Toure</span>';
        container.appendChild( info );

    //STATS
    var statsContainer = document.createElement('div');
    //INIT
    init();
    doc.keydown(function(event){ keyPressed(event); });
    //onWindowsResize();
    animate();
    
/** initialize **/
function init () {
    
    // on initialise le moteur de rendu
    renderer = new THREE.WebGLRenderer();
    // on initialise la scène
    scene = new THREE.Scene();	
    scene.fog = new THREE.Fog( 0xcce0ff, 500, 10000 ); // 10000, 40000 
    
    // renderer = new THREE.CanvasRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setClearColor( scene.fog.color );
    container.appendChild(renderer.domElement);

    // on initialise la camera que l’on place ensuite sur la scène
    camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 10000 );

    camera.position.y = 300;
    camera.position.z=1500;
    scene.add(camera);
    
    /*
    controls = new THREE.FirstPersonControls( camera, container );
    controls.movementSpeed = 50;
    controls.lookSpeed = 0.5; 
    controls.noFly =false;
    controls.lookVertical = true;
    controls.constrainVertical = false;*/
    //controls.verticalMin = 1.1;
    //controls.verticalMax = 2.2;
    
    //Lumiere
    var materials;
    ambientLight = new THREE.AmbientLight( 0x666666 );//0x404040 0x666666 
	scene.add( ambientLight );

	light = new THREE.DirectionalLight( 0xdfebff, 1.75 ); //0xdfebff 1.75 0xdfebff
	light.position.set( 50, 00, 100 );
	light.position.multiplyScalar( 1.3 );
	light.castShadow = true;
	light.shadowCameraVisible = true;

	light.shadowMapWidth = 2024;
	light.shadowMapHeight = 2024;


	var d = 300;

	light.shadowCameraLeft = -d;
	light.shadowCameraRight = d;
	light.shadowCameraTop = d;
	light.shadowCameraBottom = -d;

	light.shadowCameraFar = 1000;

	scene.add( light );
    
    //Terrain 1
	var groundTexture = THREE.ImageUtils.loadTexture( "./img/grasslight-big.jpg" );
	groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
	groundTexture.repeat.set( 25, 25 );
	groundTexture.anisotropy = 16;
	
	var groundMaterial = new THREE.MeshPhongMaterial( { color: 0xffffff, specular: 0x111111, map: groundTexture} );
	ground = new THREE.Mesh( new THREE.PlaneBufferGeometry( 20000, 20000 ), groundMaterial );
	//ground.position.y = -250;
    ground.position.set(0,0,0);
	ground.rotation.x = - Math.PI / 2;
	ground.receiveShadow = true;
	scene.add( ground );
    ambientLight.visible =true;
    drawForest(2, -9);
    drawForest(-11, -9);
   

    //Seperating walls
    var wallGeometry = new THREE.BoxGeometry( 500, 500, 500 );
    var WallMaterial = new THREE.MeshBasicMaterial( {color: 0xff0000, map: groundTexture} );
    var wall = new THREE.Mesh( wallGeometry, WallMaterial);
    wall.position.set(0, 300, 11100);
    scene.add( wall );

    //Terrain 2

    var groundTexture2 = THREE.ImageUtils.loadTexture( "./img/desert.jpg" );
    groundTexture2.wrapS = groundTexture2.wrapT = THREE.RepeatWrapping;
    groundTexture2.repeat.set( 25, 25 );
    groundTexture2.anisotropy = 16;
                            //
    var groundMaterial = new THREE.MeshPhongMaterial( { color: 0xffffff, specular: 0x111111, map: groundTexture2} );
    ground2 = new THREE.Mesh( new THREE.PlaneBufferGeometry( 20000, 20000 ), groundMaterial );
    ground2.position.set(0,0,20050);
    ground2.rotation.x = - Math.PI / 2;
    ground2.receiveShadow = true;
    scene.add( ground2 );
    

    //draw walls

   // camera.position.set(0,300,31000);
   //Water
   waterGeometry = new THREE.PlaneBufferGeometry(20000, 20000);
   waterGeometry.rotateX( - Math.PI / 2);

   var vertices = waterGeometry.attributes.position.array;
   for ( var i = 0, l = vertices.length; i < l; i ++ ) {
        vertices[ i ].y = 35 * Math.sin( i / 2 );
     }
     var waterTexture = THREE.ImageUtils.loadTexture( "./js/textures/waternormals.jpg" );
    waterTexture.wrapS = waterTexture.wrapT = THREE.RepeatWrapping;
    waterTexture.repeat.set( 5, 5 );
    waterMaterial = new THREE.MeshBasicMaterial( { color: 0x0044ff, map: waterTexture} );
    waterMesh = new THREE.Mesh( waterGeometry, waterMaterial );
    waterMesh.position.set(0,0,-20000);
    scene.add( waterMesh );

     //Brick Terrain 1

    var brickTexture1 = THREE.ImageUtils.loadTexture( "./js/textures/brick_diffuse.jpg" );
    brickTexture1.wrapS = brickTexture1.wrapT = THREE.RepeatWrapping;
    brickTexture1.repeat.set( 25, 25 );
    brickTexture1.anisotropy = 16;
                            //
    var brickMat1 = new THREE.MeshPhongMaterial( { color: 0xffffff, specular: 0x111111, map: brickTexture1} );
    brick1 = new THREE.Mesh( new THREE.PlaneBufferGeometry( 20000, 20000 ), brickMat1 );
    brick1.position.set(0,0, -40000);
    brick1.rotation.x = - Math.PI / 2;
    brick1.receiveShadow = true;
    scene.add( brick1 );

     //Brick Terrain 2

    var brickTexture2 = THREE.ImageUtils.loadTexture( "./js/textures/brick_bump.jpg" );
    brickTexture2.wrapS = brickTexture1.wrapT = THREE.RepeatWrapping;
    brickTexture2.repeat.set( 5, 1 );
    brickTexture2.anisotropy = 16;
                            //
    var brickMat2 = new THREE.MeshPhongMaterial( { color: 0xffffff, specular: 0x111111, map: brickTexture2} );
    brick2 = new THREE.Mesh( new THREE.PlaneBufferGeometry( 20000, 20000 ), brickMat2 );
    brick2.position.set(0,0, -60000);
    //brick2.rotation.x = - Math.PI / 2;
    brick2.receiveShadow = true;
    scene.add( brick2 );

     camera.position.z = 30000;
}

function drawForest(initX, initZ){
    var intervalX = 550;
    var intervalZ = 0;
    var cylGeom = new THREE.CylinderGeometry(40, 50, 700, 20);
    var cylMaterial = new THREE.MeshBasicMaterial( {color: 0x1a0d00} );

    var geometry = new THREE.SphereGeometry( 200, 8, 6 );
    var material = new THREE.MeshBasicMaterial( {  color:0x009900} );
    

    for(intervalZ =initZ ; intervalZ < 450 * 5; intervalZ+=450){
        for(var i =initX; i< initX + 9; i++){
            cylinder = new THREE.Mesh( cylGeom, cylMaterial );
            cylinder.position.x = i * intervalX;
            cylinder.position.z = intervalZ;
            scene.add( cylinder );

            var sphere = new THREE.Mesh( geometry, material );
            sphere.position.x = i *intervalX;
            sphere.position.z = intervalZ;
            sphere.position.y=380;
            scene.add( sphere );

        }
    }

}

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
             $("#info").text("Valeur de Phi = "+phi+" Valeur de Theta ="+ theta);
        });
    }


/**
* Gère la déplacement (avant et arrière) de l'utilisateur
*/
function keyPressed(event){
    //alert(event.keyCode);
    event.preventDefault();
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


/***  MENU  ***/

//Affiche un message
function updateInfo(message){
    //info.innerHTML = 'Bienvenue sur Virtual World<br/><span style="font-style: italic;">par Ine Thierry & Hamidou Toure</span>';
    $("#infos").html(message);
}

function animate(){
    var delta = clock.getDelta();
    tick += delta;
    if( camera.position.z > -48000) camera.position.z -= 20;
    
    updateInfo(" Time : <br /> "+tick.toFixed(3)+' presentPeriod : '+presentPeriod +' periodColor: '+ this.periods[presentPeriod]+'camera position '+camera.position.x+' '+camera.position.y+' '+camera.position.z); //Affiche les information
    setPeriod();
    // on appel la fonction animate() récursivement à chaque frame
    requestAnimationFrame( animate );
    render();
}

function render() {
    renderer.render( scene, camera );
}

//Mettre à jour le temps
//30 secs = 1h
//30 x 24 = 1j
//1j = 720 seconds
function setPeriod(){
    if(tick >= 720 ){ tick = 0; } //reset tick
    presentPeriod = Math.floor(tick / 10);
    //scene.fog.color = this.periods[presentPeriod];
    //renderer.setClearColor( scene.fog.color );
    //light.color = this.periods[presentPeriod];
}


function animateGround(){
    ground.rotation.x += 0.009;
    ground.rotation.y += 0.002;
    ground.rotation.z += 0.009;
}

function onWindowsResize(e){
     camera.aspect = window.innerWidth / window.innerHeight;
     camera.updateProjectionMatrix();
     renderer.setSize(window.innerWidth , window.innerHeight);
     controls.handleResize();
}

/**
* TO DO
* Eau, desert , arbres
* Agrandir le terrain
* Implementer la souris
**/



});