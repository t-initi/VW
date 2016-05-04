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
var presentPeriod;

//CREATE DOM ELEMENTS

//CONTAINER
var container = document.getElementById('container');
//INFO
var info = document.createElement( 'div' );
    info.style.position = 'absolute';
    info.setAttribute("id","info");
    info.style.top = '10px';
    info.style.width = '100%';
    info.style.textAlign = 'center';
    info.innerHTML = 'Bienvenue sur Virtual World<br/><span style="font-style: italic;">par Ine Thierry & Hamidou Toure</span>';
    container.appendChild( info );
//STATS

$(document).ready(function(){
    var doc = $(document);
	var renderer, scene, camera, mesh, tree, cylinder, controls ;
    var timer = new Date();
    var tick =0;
    var clock = new THREE.Clock();
    var ambientLight, light;
   

    init();
    //onWindowsResize();
    animate();
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
    ambientLight = new THREE.AmbientLight( 0xFF4500 );
	scene.add( ambientLight );

	light = new THREE.DirectionalLight( 0xdfebff, 1.1 ); //0xdfebff 1.75
	light.position.set( 50, 200, 100 );
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

    //console.log(light);
	scene.add( light );
    
    //Terrain 1
	var groundTexture = THREE.ImageUtils.loadTexture( "./img/grasslight-big.jpg" );
	groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
	groundTexture.repeat.set( 25, 25 );
	groundTexture.anisotropy = 16;
							//
	var groundMaterial = new THREE.MeshPhongMaterial( { color: 0xffffff, specular: 0x111111, map: groundTexture} );
	ground = new THREE.Mesh( new THREE.PlaneBufferGeometry( 20000, 20000 ), groundMaterial );
	//ground.position.y = -250;
    ground.position.set(0,0,0);
	ground.rotation.x = - Math.PI / 2;
	ground.receiveShadow = true;
	scene.add( ground );
     //drawTree();
     drawForest();
     ambientLight.visible =false;


    //Terrain 2

    var groundTexture2 = THREE.ImageUtils.loadTexture( "./img/desert.jpg" );
    groundTexture2.wrapS = groundTexture2.wrapT = THREE.RepeatWrapping;
    groundTexture2.repeat.set( 25, 25 );
    groundTexture2.anisotropy = 16;
                            //
    var groundMaterial = new THREE.MeshPhongMaterial( { color: 0xffffff, specular: 0x111111, map: groundTexture2} );
    ground2 = new THREE.Mesh( new THREE.PlaneBufferGeometry( 20000, 20000 ), groundMaterial );
    //ground2.position.y = -250;
    ground2.position.set(0,0,20050);
    //ground2.position.x = 2000;
    ground2.rotation.x = - Math.PI / 2;
    ground2.receiveShadow = true;
    scene.add( ground2 );
    

    //draw walls

}


function drawTree(){
    var cylGeom = new THREE.CylinderGeometry(40, 50, 700, 20);
    var cylMaterial = new THREE.MeshBasicMaterial( {color: 0x1a0d00} );
    cylinder = new THREE.Mesh( cylGeom, cylMaterial );
    scene.add( cylinder );
    
    //Feuilles de l'arbre
    var treeLeaves = THREE.ImageUtils.loadTexture('./img/tree1.png');
    treeLeaves.wrapS = treeLeaves.wrapT = THREE.RepeatWrapping

    var geometry = new THREE.SphereGeometry( 200, 8, 6 );
    var material = new THREE.MeshBasicMaterial( {  color:0x009900} );
    
    var sphere = new THREE.Mesh( geometry, material );
    scene.add( sphere );
    sphere.position.y=375;
    //sphere.position.z= 100;

}

function drawForest(){
    var intervalX = 550;
    var intervalZ = 0;
    var cylGeom = new THREE.CylinderGeometry(40, 50, 700, 20);
    var cylMaterial = new THREE.MeshBasicMaterial( {color: 0x1a0d00} );

    var geometry = new THREE.SphereGeometry( 200, 8, 6 );
    var material = new THREE.MeshBasicMaterial( {  color:0x009900} );
    

    for(intervalZ =0 ; intervalZ < 450 * 9; intervalZ+=450){
        for(var i =0;i<9; i++){
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

/**
*   Menu du jeu
*/

/**
* Change la couleur du ciel en fonction du temps
**/
function changeSkyColor(){

}

//Affiche un message
function updateInfo(message){
    info.innerHTML = 'Bienvenue sur Virtual World<br/><span style="font-style: italic;">par Ine Thierry & Hamidou Toure</span>';
    $("#info").html(message);
}

function animate(){
    var delta = clock.getDelta();
    tick += delta;
    updateInfo(" Time : <br /> "+tick.toFixed(3)+' presentPeriod : '+presentPeriod); //Affiche les information
    setPeriod();
    // on appel la fonction animate() récursivement à chaque frame
    requestAnimationFrame( animate );
    // on effectue le rendu de la scène
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
    presentPeriod = Math.floor(tick / 30);
    scene.fog.color = this.periods[presentPeriod];
    //renderer.setClearColor( scene.fog.color );
 
}

//animation des cubes
function animateCubes(){
    /*cube.rotation.x += 0.01;
    cube.rotation.y += 0.009;
    cube.rotation.z += 0.009;*/

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
/**
* TO DO
* Eau, desert , arbres
* Agrandir le terrain
* Implementer la souris
**/



});