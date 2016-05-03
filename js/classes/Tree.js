
function Tree(){
    
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
//scene.add( sphere );
sphere.position.y=375;
    
    return sphere;
    
}

function Personne(name){
    var name = name;
    alert(name);
}