// to avoid undefined warning with JSHint
var THREE = THREE;

    // should we draw wireframe and normals?
    var drawHelpers = true;

    var camera, scene, renderer,
    geometry, material, mesh, pointLight;

    init();
    animate();

    function init() {

        scene = new THREE.Scene();

        camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
        camera.position.y = 25;
        scene.add( camera );

        var curve1, curve2;

        var lineCurve1 = new THREE.LineCurve3(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 50, 100));
        var lineCurve2 = new THREE.LineCurve3(new THREE.Vector3(50, 0, 0), new THREE.Vector3(70, 50, 0));
        var lineCurve1b = new THREE.LineCurve3(new THREE.Vector3(0, 50, 100), new THREE.Vector3(0, 50, 0));
        var lineCurve2b = new THREE.LineCurve3(new THREE.Vector3(70, 50, 0), new THREE.Vector3(40, 50, 10));

        var lineCurvePath1 = new THREE.CurvePath();
        lineCurvePath1.add(lineCurve1);
        lineCurvePath1.add(lineCurve1b);

        var lineCurvePath2 = new THREE.CurvePath();
        lineCurvePath2.add(lineCurve2);
        lineCurvePath2.add(lineCurve2b);

        var curveQuad1 = new THREE.QuadraticBezierCurve3(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 50, 50), new THREE.Vector3(0, 50, 100));
        var curveQuad2 = new THREE.QuadraticBezierCurve3(new THREE.Vector3(50, 0, 0), new THREE.Vector3(70, 50, 0), new THREE.Vector3(100, 10, 10));

        var c = 0.551915024494;
        var curveBezier1 = new THREE.CubicBezierCurve3(new THREE.Vector3(0, 1, 0), new THREE.Vector3(c, 1, 0), new THREE.Vector3(1, c, 0), new THREE.Vector3(1, 0, 0));
        var h = 10;
        var curveBezier2 = new THREE.CubicBezierCurve3(new THREE.Vector3(0, 1, h), new THREE.Vector3(c, 1, h), new THREE.Vector3(1, c, h), new THREE.Vector3(1, 0, h));


        curve1 = lineCurvePath1;
        curve2 = lineCurvePath2;

        geometry = new THREE.RuledSurfaceGeometry(curve1, curve2, 20 );
        //material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );
        material = new THREE.MeshLambertMaterial ( { color: 0xdddddd, shading: THREE.FlatShading } );
        //material = new THREE.MeshPhongMaterial( { ambient: 0x030303, color: 0xdddddd, specular: 0x009900, shininess: 30, shading: THREE.FlatShading } );

        material.side = THREE.DoubleSide;

        mesh = new THREE.Mesh( geometry, material );
        scene.add( mesh );

        // lights
        scene.add( new THREE.AmbientLight( 0x111111 ) );
        pointLight = new THREE.PointLight( 0xffffff, 1 );
        pointLight.position.x = 100;
        pointLight.position.y = 100;
        pointLight.position.z = 100;

        scene.add( pointLight );

        // helpers
        if(drawHelpers) {
            // draw curves
            var lineGeo1 = createGeometryFromCurve(curve1);
            var lineGeo2 = createGeometryFromCurve(curve2);
            // "line" is a viewable curve
            var line1 = new THREE.Line( lineGeo1,  new THREE.LineBasicMaterial( { color: 0x00ff00, opacity: 1, linewidth: 3 } ) );
            var line2 = new THREE.Line( lineGeo2,  new THREE.LineBasicMaterial( { color: 0xff0000, opacity: 1, linewidth: 3 } ) );
            scene.add(line1);
            scene.add(line2);
            
            // wireframe and normals
            scene.add( new THREE.FaceNormalsHelper( mesh, 10 ) );
            scene.add( new THREE.VertexNormalsHelper( mesh, 10 ) );
            var wireHelper = new THREE.WireframeHelper( mesh ) ;
            wireHelper.material.depthTest = false;
            wireHelper.material.opacity = 0.25;
            wireHelper.material.transparent = true;
            scene.add(wireHelper);
        }

        // renderer
        renderer = new THREE.WebGLRenderer();
        renderer.setSize( window.innerWidth, window.innerHeight );

        document.body.appendChild( renderer.domElement );

    }

    function animate() {

        // note: three.js includes requestAnimationFrame shim
        window.requestAnimationFrame( animate );
        render();

    }

    function render() {

        var time = - performance.now() * 0.0005;

        camera.position.x = 100 * Math.cos( time );
        camera.position.z = 100 * Math.sin( time );
        camera.lookAt( scene.position );

        renderer.render( scene, camera );

    }


    function createGeometryFromCurve(curve, steps) {
        var lineGeometry = new THREE.Geometry();

        var lineSteps = steps || 100;
        for(var i = 0; i < lineSteps; i++) {
            lineGeometry.vertices.push(curve.getPoint(i / lineSteps));
        }
        return lineGeometry;
    }