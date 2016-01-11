			var renderer, scene, camera, mesh;

init();
animate();

function init(){
    // on initialise le moteur de rendu
    renderer = new THREE.WebGLRenderer();

    // si WebGL ne fonctionne pas sur votre navigateur vous pouvez utiliser le moteur de rendu Canvas à la place
    // renderer = new THREE.CanvasRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.getElementById('container').appendChild(renderer.domElement);

    // on initialise la scène
    scene = new THREE.Scene();

    // on initialise la camera que l’on place ensuite sur la scène
    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.set(0, 0, 1000);
    scene.add(camera);
    
    //Terrain
    /*var groundTexture = THREE.ImageUtils.loadTexture( "../img/grasslight-big.jpg" );
    groundTexture.wrapS = THREE.RepeatWrapping;
    groundTexture.wrapT = THREE.RepeatWrapping;
    groundTexture.reapeat.set(25,25);
    var groundMaterial = new MeshPongMaterial({color:0xffffff, map:groundTexture, specular: 0x111111});

    var groundMesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 20000, 20000 ), groundMaterial );
                groundMesh.position.y = -250;
                groundMesh.rotation.x = - Math.PI / 2;
                groundMesh.receiveShadow = true;
                scene.add( groundMesh );

                */
    // on créé un  cube au quel on définie un matériau puis on l’ajoute à la scène 
    var geometry = new THREE.CubeGeometry( 1000, 50, 500 );
    var material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: false } );
    mesh = new THREE.Mesh( geometry, material );
    scene.add( mesh );
}

function animate(){
    // on appel la fonction animate() récursivement à chaque frame
    requestAnimationFrame( animate );
    // on fait tourner le cube sur ses axes x et y
    mesh.rotation.x += 0;
    mesh.rotation.y += 0.002;
    //mesh.rotation.z += 0.1;
    // on effectue le rendu de la scène
    renderer.render( scene, camera );
}