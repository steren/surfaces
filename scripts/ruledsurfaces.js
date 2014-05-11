// to avoid undefined warning with JSHint
var THREE = THREE;

    // should we draw wireframe and normals?
    var drawHelpers = false;

    var camera, scene, renderer,
    geometry, material, mesh, pointLight, controls;

    init();
    animate();

    function init() {
        
        // initialize parameters
        var steps = 50;
        var segments = 20;
        var showSurface = true;
        var showLines = false;


        scene = new THREE.Scene();

        camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
        camera.position.z = 100;

    
        // TEST with LINES
        var lineCurve1 = new THREE.LineCurve3(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 50, 0));
        var lineCurve1b = new THREE.LineCurve3(new THREE.Vector3(0, 50, 0), new THREE.Vector3(0, 50, 50));
        var lineCurve2 = new THREE.LineCurve3(new THREE.Vector3(50, 0, 0), new THREE.Vector3(50, 50, 0));
        var lineCurve2b = new THREE.LineCurve3(new THREE.Vector3(50, 50, 0), new THREE.Vector3(50, 100, 50));
        var lineCurve3 = new THREE.LineCurve3(new THREE.Vector3(100, -50, 0), new THREE.Vector3(100, 100, 50));
        var lineCurvePath1 = new THREE.CurvePath();
        lineCurvePath1.add(lineCurve1);
        lineCurvePath1.add(lineCurve1b);
        var lineCurvePath2 = new THREE.CurvePath();
        lineCurvePath2.add(lineCurve2);
        lineCurvePath2.add(lineCurve2b);
        var lineCurvePath3 = new THREE.CurvePath();
        lineCurvePath3.add(lineCurve3);
        var lineSet = [lineCurvePath1, lineCurvePath2, lineCurvePath3];

        // var curveQuad1 = new THREE.QuadraticBezierCurve3(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 50, 50), new THREE.Vector3(0, 50, 100));
        var curveQuad2 = new THREE.QuadraticBezierCurve3(new THREE.Vector3(50, 0, 0), new THREE.Vector3(70, 50, 0), new THREE.Vector3(100, 10, 10));


        ////////////////////////
        // Rotated Cylinder
        ////////////////////////
        steps = 20;
        segments = 1;
        showSurface = false;
        showLines = true;
        
        // approximate a circle by four Bezier curves
        var c = 0.551915024494; // magic parameter
        var circleRadius = 50;
        var circleHeight = 200;
        var cylinderAngle = 2 * Math.PI / 3;
        
        function rotY(vec, angle) {
            return vec.clone().applyEuler(new THREE.Euler(0, angle, 0));
            
        }
        function rotYBezier(arc, angle) {
            return new THREE.CubicBezierCurve3(rotY(arc.v0, angle), rotY(arc.v1, angle), rotY(arc.v2, angle), rotY(arc.v3, angle));
        }
                
        var arcBottom = new THREE.CubicBezierCurve3(new THREE.Vector3(0, 0, circleRadius), new THREE.Vector3(c * circleRadius, 0, circleRadius), new THREE.Vector3(circleRadius, 0, c * circleRadius), new THREE.Vector3(circleRadius, 0, 0));
        var arcTop = new THREE.CubicBezierCurve3(new THREE.Vector3(0, circleHeight, circleRadius), new THREE.Vector3(c * circleRadius, circleHeight, circleRadius), new THREE.Vector3(circleRadius, circleHeight, c * circleRadius), new THREE.Vector3(circleRadius, circleHeight, 0));

        var curveCircleBottom = new THREE.CurvePath();
        curveCircleBottom.add( rotYBezier(arcBottom, 0                  ) );
        curveCircleBottom.add( rotYBezier(arcBottom, Math.PI / 2      ) );
        curveCircleBottom.add( rotYBezier(arcBottom, Math.PI          ) );
        curveCircleBottom.add( rotYBezier(arcBottom, 3 * Math.PI / 2  ) );
        
        var curveCircleTop = new THREE.CurvePath();
        curveCircleTop.add( rotYBezier(arcTop, cylinderAngle                          ) );
        curveCircleTop.add( rotYBezier(arcTop, cylinderAngle + Math.PI / 2            ) );
        curveCircleTop.add( rotYBezier(arcTop, cylinderAngle + Math.PI                ) );
        curveCircleTop.add( rotYBezier(arcTop, cylinderAngle + 3 * Math.PI / 2        ) );
                
        var circleSet = [curveCircleBottom, curveCircleTop];



        var curves = circleSet;

        // Let the magic begin
        geometry = new THREE.RuledSurfaceGeometry(curves, steps, segments, showSurface, showLines);
        
        
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
            for(var c = 0; c < curves.length; c++) {
                var lineGeo = curves[c].createPointsGeometry(100);
                // "Line" is a viewable curve
                var line = new THREE.Line( lineGeo,  new THREE.LineBasicMaterial( { color: 0xff0000, opacity: 1, linewidth: 3 } ) );
                scene.add(line);
            }

            
            // wireframe and normals
            scene.add( new THREE.FaceNormalsHelper( mesh, 3 ) );
            scene.add( new THREE.VertexNormalsHelper( mesh, 3 ) );
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
        
        // camera controls
        controls = new THREE.OrbitControls( camera, renderer.domElement); 
        controls.addEventListener( 'change', render );
        
        window.addEventListener( 'resize', onWindowResize, false );
        
        // GUI
        var Parameters = function() {
            this.export = exportObj;
            this.sketchfab = uploadToSketchfab;
            this.token = 'YOUR API TOKEN';
            this.title = 'Ruled Surface';
            this.tags = 'surface';
            this.description = 'Created with http://steren.fr/surfaces';
        };
        
        var params = new Parameters();
        var gui = new dat.GUI();

        gui.add(params, 'export').name('download .obj');        
        var f1 = gui.addFolder('Upload to Sketchfab');
        f1.add(params, 'title');
        f1.add(params, 'description');
        f1.add(params, 'tags');
        f1.add(params, 'token').name('API token');
        f1.add(params, 'sketchfab').name('Upload');

    }

    function animate() {

        // note: three.js includes requestAnimationFrame shim
        window.requestAnimationFrame( animate );
        render();

    }

    function onWindowResize() {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize( window.innerWidth, window.innerHeight );

        render();

    }

    function render() {
        renderer.render( scene, camera );
    }
    
    function exportObj() {
        var exporter = new THREE.OBJExporter();
        var objString = exporter.parse(geometry);
        var content = "data:text/plain;charset=utf-8," + escape( objString );
        window.open( content, '_blank' );
    }
    
    function uploadToSketchfab() {
        
        var exporter = new THREE.OBJExporter();
        var objString = exporter.parse(geometry);
        
        var fd = new FormData();


        fd.append('filenameModel', 'surface.obj');
        fd.append('fileModel', new Blob([objString]));
        fd.append('token', this.token);
        fd.append('title', this.title);
        fd.append('description', this.description);
        fd.append('tags', this.tags);

        var xhr = new XMLHttpRequest();
        xhr.open("POST", 'https://api.sketchfab.com/v1/models');

        var result = function(data) {
            var res = JSON.parse(xhr.responseText);
            if(res.success) {
                prompt("Success, open file at:", "https://sketchfab.com/models/" + res.result.id);
            } else {
                alert('Upload error: ' + res.error);
            }
        };

        xhr.addEventListener("load", result, false);
        xhr.send(fd);
    }