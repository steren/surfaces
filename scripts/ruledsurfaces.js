// to avoid undefined warning with JSHint
var THREE = THREE;

    var camera, scene, renderer,
    geometry, material, mesh;

    init();
    animate();

    function init() {

        scene = new THREE.Scene();

        camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
        camera.position.z = 100;
        scene.add( camera );

        var linearCurve1 = new THREE.LineCurve3(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 50, 100));
        var linearCurve2 = new THREE.LineCurve3(new THREE.Vector3(50, 0, 0), new THREE.Vector3(70, 50, 0));

        var bezierCurve1 = new THREE.QuadraticBezierCurve3(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 50, 50), new THREE.Vector3(0, 10, 10));
        var bezierCurve2 = new THREE.QuadraticBezierCurve3(new THREE.Vector3(50, 0, 0), new THREE.Vector3(70, 50, 0), new THREE.Vector3(100, 10, 10));

        geometry = new THREE.RuledSurfaceGeometry(linearCurve1, linearCurve2, 20 );
        material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );

        mesh = new THREE.Mesh( geometry, material );
        scene.add( mesh );

        renderer = new THREE.CanvasRenderer();
        renderer.setSize( window.innerWidth, window.innerHeight );

        document.body.appendChild( renderer.domElement );

    }

    function animate() {

        // note: three.js includes requestAnimationFrame shim
        window.requestAnimationFrame( animate );
        render();

    }

    function render() {

        mesh.rotation.x += 0.01;
        mesh.rotation.y += 0.02;

        renderer.render( scene, camera );

    }




