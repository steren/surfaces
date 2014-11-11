// to avoid undefined warning with JSHint
var THREE = THREE;

var preset = 'maewest';

    // should we draw wireframe and normals?
    var drawCurves = true;
    var wireframe = false;

    var camera, scene, renderer,
    geometry, material, mesh, pointLight, pointLight2, controls;


    var c = 0.551915024494; // magic parameter to draw circles from Bezier

    init();
    animate();

    function init() {
        
        // initialize parameters
        var steps = 50;
        var segments = 20;
        var showSurface = true;
        var showLines = false;
        var lineRadius = 1;


        scene = new THREE.Scene();

        camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
        camera.position.z = 100;

        //material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );
        material = new THREE.MeshLambertMaterial ( { color: 0xdddddd, shading: THREE.FlatShading } );
        //material = new THREE.MeshPhongMaterial( { ambient: 0x030303, color: 0xdddddd, specular: 0x009900, shininess: 30, shading: THREE.FlatShading } );
        material.side = THREE.DoubleSide;


        // var curveQuad1 = new THREE.QuadraticBezierCurve3(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 50, 50), new THREE.Vector3(0, 50, 100));
        //var curveQuad2 = new THREE.QuadraticBezierCurve3(new THREE.Vector3(50, 0, 0), new THREE.Vector3(70, 50, 0), new THREE.Vector3(100, 10, 10));
        

        
        if (preset == 'maewest') {

            steps = 24;
            segments = 10;
            showSurface = true;
            showLines = false;

            function rotY(vec, angle) {
                return vec.clone().applyEuler(new THREE.Euler(0, angle, 0));

            }
            function rotYBezier(arc, angle) {
                return new THREE.CubicBezierCurve3(rotY(arc.v0, angle), rotY(arc.v1, angle), rotY(arc.v2, angle), rotY(arc.v3, angle));
            }


            // approximate a circle by four Bezier curves
            var circleRadius = 60;
            var circleHeight = 80;
            var cylinderAngle =  4 * Math.PI /6 ;

            //var c = 0.551915024494;

            var arcBottom = new THREE.CubicBezierCurve3(new THREE.Vector3(0, 0, circleRadius), new THREE.Vector3(c * circleRadius, 0, circleRadius), new THREE.Vector3(circleRadius, 0, c * circleRadius), new THREE.Vector3(circleRadius, 0, 0));
            var arcTop = new THREE.CubicBezierCurve3(new THREE.Vector3(0, circleHeight, circleRadius), new THREE.Vector3(c * circleRadius, circleHeight, circleRadius), new THREE.Vector3(circleRadius, circleHeight, c * circleRadius), new THREE.Vector3(circleRadius, circleHeight, 0));
            
            var curveCircleBottom = new THREE.CurvePath();
            curveCircleBottom.add( rotYBezier(arcBottom, 0                ) );
            curveCircleBottom.add( rotYBezier(arcBottom, Math.PI / 2      ) );
            curveCircleBottom.add( rotYBezier(arcBottom, Math.PI          ) );
            curveCircleBottom.add( rotYBezier(arcBottom, 3 * Math.PI / 2  ) );

            // two circles
            /*
            curveCircleBottom.add( rotYBezier(arcBottom, 0                ) );
            curveCircleBottom.add( rotYBezier(arcBottom, Math.PI / 2      ) );
            curveCircleBottom.add( rotYBezier(arcBottom, Math.PI          ) );
            curveCircleBottom.add( rotYBezier(arcBottom, 3 * Math.PI / 2  ) );
            */
            
            var curveCircleTop = new THREE.CurvePath();
            curveCircleTop.add( rotYBezier(arcTop, cylinderAngle                          ) );
            curveCircleTop.add( rotYBezier(arcTop, cylinderAngle + Math.PI / 2            ) );
            curveCircleTop.add( rotYBezier(arcTop, cylinderAngle + Math.PI                ) );
            curveCircleTop.add( rotYBezier(arcTop, cylinderAngle + 3 * Math.PI / 2        ) );
            // two circles
            /*
            curveCircleTop.add( rotYBezier(arcTop, - cylinderAngle                          ) );
            curveCircleTop.add( rotYBezier(arcTop, - cylinderAngle + Math.PI / 2            ) );
            curveCircleTop.add( rotYBezier(arcTop, - cylinderAngle + Math.PI                ) );
            curveCircleTop.add( rotYBezier(arcTop, - cylinderAngle + 3 * Math.PI / 2        ) );
            */
            
            var circleSet = [curveCircleBottom, curveCircleTop];
            
            curves = circleSet;
            
        } else if (preset == 'pinakothek') {

            steps = 50;
            segments = 10;
            showSurface = false;
            showLines = true;
            lineRadius = 0.5;

            var lineCurve1 = new THREE.LineCurve3(new THREE.Vector3(-100, 25, 50), new THREE.Vector3(-100, 25, -50));
            var lineCurvePath1 = new THREE.CurvePath();
            lineCurvePath1.add(lineCurve1);

            var lineCurve2a = new THREE.LineCurve3(new THREE.Vector3(-50, 0, 50), new THREE.Vector3(-50, 25, 0));
            var lineCurve2b = new THREE.LineCurve3(new THREE.Vector3(-50, 25, 0), new THREE.Vector3(-50, 0, -50));
            var lineCurvePath2 = new THREE.CurvePath();
            lineCurvePath2.add(lineCurve2a);
            lineCurvePath2.add(lineCurve2b);
            
            var lineCurve3a = new THREE.LineCurve3(new THREE.Vector3(0, 25, 50), new THREE.Vector3(0, 0, 0));
            var lineCurve3b = new THREE.LineCurve3(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 25, -50));
            var lineCurvePath3 = new THREE.CurvePath();
            lineCurvePath3.add(lineCurve3a);
            lineCurvePath3.add(lineCurve3b);

            var lineCurve4a = new THREE.LineCurve3(new THREE.Vector3(50, 0, 50), new THREE.Vector3(50, 25, 0));
            var lineCurve4b = new THREE.LineCurve3(new THREE.Vector3(50, 25, 0), new THREE.Vector3(50, 0, -50));
            var lineCurvePath4 = new THREE.CurvePath();
            lineCurvePath4.add(lineCurve4a);
            lineCurvePath4.add(lineCurve4b);

            var lineCurve5 = new THREE.LineCurve3(new THREE.Vector3(100, 25, 50), new THREE.Vector3(100, 25, -50));
            var lineCurvePath5 = new THREE.CurvePath();
            lineCurvePath5.add(lineCurve5);

            var lineSet = [lineCurvePath1, lineCurvePath2, lineCurvePath3, lineCurvePath4, lineCurvePath5];
            
            curves = lineSet; 
            
        } else if (preset === 'tensegrity') {

            steps = 10;
            segments = 10;
            showSurface = false;
            showLines = true;
            lineRadius = 0.5;

            var lineCurve1 = new THREE.LineCurve3(new THREE.Vector3(0, 0, 0), new THREE.Vector3(50, 50, 50));
            var lineCurvePath1 = new THREE.CurvePath();
            lineCurvePath1.add(lineCurve1);

            var lineCurve2 = new THREE.LineCurve3(new THREE.Vector3(0, 50, 0), new THREE.Vector3(50, 0, 0));
            var lineCurvePath2 = new THREE.CurvePath();
            lineCurvePath2.add(lineCurve2);
            
            var lineCurve3 = new THREE.LineCurve3(new THREE.Vector3(0, 0, 50), new THREE.Vector3(0, 100, 0));
            var lineCurvePath3 = new THREE.CurvePath();
            lineCurvePath3.add(lineCurve3);

            var lineCurve1b = new THREE.LineCurve3(new THREE.Vector3(0, 0, 0), new THREE.Vector3(-50, -50, -50));

            var lineSet = [lineCurvePath1, lineCurvePath2];
            
            curves = lineSet; 

            
        } else if (preset === 'dna') {
            
        } else if (preset === 'wingspan') {
            
            steps = 40;
            segments = 20;
            showSurface = false;
            showLines = true;
            lineRadius = 0.5;

            var ay = 50;            
            var az = 60;
            
            
            var b0y = 30; 
            var bx = -40;
            var by = -60;
            
            var arcUp1 = new THREE.CurvePath();
            arcUp1.add( new THREE.CubicBezierCurve3(new THREE.Vector3(0, ay, az), new THREE.Vector3(0, c * ay, az), new THREE.Vector3(0, 0, c * az), new THREE.Vector3(0, 0, 0) ));
            arcUp1.add( new THREE.CubicBezierCurve3(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -c * az), new THREE.Vector3(0, c * ay, -az), new THREE.Vector3(0, ay, -az) ));
            
            // same as arcUp1, but in reverse
            var arcUp2 = new THREE.CurvePath();
            arcUp2.add( new THREE.CubicBezierCurve3(
                                                    new THREE.Vector3(0, ay, -az),
                                                    new THREE.Vector3(0, c * ay, -az), 
                                                    new THREE.Vector3(0, 0, -c * az), 
                                                    new THREE.Vector3(0, 0, 0)
                                                    ));
            arcUp2.add( new THREE.CubicBezierCurve3(
                                                    new THREE.Vector3(0, 0, 0),
                                                    new THREE.Vector3(0, 0, c * az), 
                                                    new THREE.Vector3(0, c * ay, az), 
                                                    new THREE.Vector3(0, ay, az)
                                                    ));

            var arcDown = new THREE.CurvePath();
            arcDown.add( new THREE.CubicBezierCurve3(new THREE.Vector3(3 * bx, by, 0), new THREE.Vector3(bx, c * (by + b0y) , 0), new THREE.Vector3(c * bx, b0y, 0), new THREE.Vector3(0, b0y, 0) ));
            arcDown.add( new THREE.CubicBezierCurve3(new THREE.Vector3(0, b0y, 0), new THREE.Vector3(- c * bx, b0y, 0), new THREE.Vector3(-bx, c * (by + b0y) , 0), new THREE.Vector3(-bx, by, 0) ));

            
            var wingspanSet = [arcUp1, arcDown, arcUp2];
            
            curves = wingspanSet;
            
        } else if (preset === 'lovers') {

            var lineCurve1 = new THREE.LineCurve3(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 200, 0));
            var lineCurvePath1 = new THREE.CurvePath();
            lineCurvePath1.add(lineCurve1);

            var height = 100;
            var radius = 50;

            var circleRadius = 50;

            var arcBottom = new THREE.CubicBezierCurve3(
                                    new THREE.Vector3(0, 0, circleRadius), 
                                    new THREE.Vector3(c * circleRadius, 0, circleRadius), 
                                    new THREE.Vector3(circleRadius, 0, c * circleRadius), 
                                    new THREE.Vector3(circleRadius, 0, 0)
                                    );
            var arc = new THREE.CurvePath();
            arc.add(arcBottom);
            
            var loversSet = [lineCurvePath1, arc];
            
            curves = loversSet;

        } else if (preset === 'small') {

            steps = 100;
            segments = 30;

            h = 100;
            r = 50;

            var arcUp = new THREE.CurvePath();
            arcUp.add( new THREE.CubicBezierCurve3(
                                                    new THREE.Vector3(0, -h, 0),
                                                    new THREE.Vector3(0, -h, 0), 
                                                    new THREE.Vector3(0, -h, r), 
                                                    new THREE.Vector3(0, -h + r, r)
                                                    ));
            arcUp.add( new THREE.CubicBezierCurve3(
                                                    new THREE.Vector3(0, -h + r, r),
                                                    new THREE.Vector3(0, -h, r), 
                                                    new THREE.Vector3(0, -h, 0),
                                                    new THREE.Vector3(0, -h, 0)
                                                    ));
            arcUp.add( new THREE.CubicBezierCurve3(
                                                    new THREE.Vector3(0, -h, 0),
                                                    new THREE.Vector3(0, -h, 0), 
                                                    new THREE.Vector3(0, -h, -r), 
                                                    new THREE.Vector3(0, -h + r, -r)
                                                    ));
            arcUp.add( new THREE.CubicBezierCurve3(
                                                    new THREE.Vector3(0, -h + r, -r),
                                                    new THREE.Vector3(0, -h, -r), 
                                                    new THREE.Vector3(0, -h, 0),
                                                    new THREE.Vector3(0, -h, 0)
                                                    ));


            var arcDown = new THREE.CurvePath();
            arcDown.add( new THREE.CubicBezierCurve3(
                                                    new THREE.Vector3(-r, -r, 0),
                                                    new THREE.Vector3(-r, 0, 0), 
                                                    new THREE.Vector3(0, 0, 0), 
                                                    new THREE.Vector3(0, 0, 0)
                                                    ));

            arcDown.add( new THREE.CubicBezierCurve3(
                                                    new THREE.Vector3(0, 0, 0),
                                                    new THREE.Vector3(0, 0, 0), 
                                                    new THREE.Vector3(r, 0, 0), 
                                                    new THREE.Vector3(r, - r, 0)
                                                    ));
            arcDown.add( new THREE.CubicBezierCurve3(
                                                    new THREE.Vector3(r, -r, 0),
                                                    new THREE.Vector3(r, 0, 0), 
                                                    new THREE.Vector3(0, 0, 0), 
                                                    new THREE.Vector3(0, 0, 0)
                                                    ));

            arcDown.add( new THREE.CubicBezierCurve3(
                                                    new THREE.Vector3(0, 0, 0),
                                                    new THREE.Vector3(0, 0, 0), 
                                                    new THREE.Vector3(-r, 0, 0), 
                                                    new THREE.Vector3(-r, - r, 0)
                                                    ));
            var eggSet = [arcDown, arcUp];
            
            curves = eggSet;
        } else if (preset === 'egg') {

            steps = 100;
            segments = 30;

            h = 200;
            r = 50;

            var arcDown = new THREE.CurvePath();
            arcDown.add( new THREE.CubicBezierCurve3(
                                                    new THREE.Vector3(-r, -r, 0),
                                                    new THREE.Vector3(-r, 0, 0), 
                                                    new THREE.Vector3(0, 0, 0), 
                                                    new THREE.Vector3(0, 0, 0)
                                                    ));

            arcDown.add( new THREE.CubicBezierCurve3(
                                                    new THREE.Vector3(0, 0, 0),
                                                    new THREE.Vector3(0, 0, 0), 
                                                    new THREE.Vector3(r, 0, 0), 
                                                    new THREE.Vector3(r, - r, 0)
                                                    ));

            var point = new THREE.CurvePath();
            point.add(new THREE.LineCurve3(new THREE.Vector3(0, -h + r, r), new THREE.Vector3(0, -h+0.000001 + r, r)));


            var eggSet = [arcDown, point];
            
            curves = eggSet;
        } 

        // Let the magic begin
        geometry = new THREE.RuledSurfaceGeometry(curves, steps, segments, showSurface, showLines, lineRadius);

        mesh = new THREE.Mesh( geometry, material );
        scene.add( mesh );


        // lights
        scene.add( new THREE.AmbientLight( 0x333333 ) );
        pointLight = new THREE.PointLight( 0xffffff, 1 );
        pointLight.position.x = 100;
        pointLight.position.y = 100;
        pointLight.position.z = 100;
        scene.add( pointLight );
        pointLight2 = new THREE.PointLight( 0xffffff, 0.5 );
        pointLight2.position.x = -100;
        pointLight2.position.y = -100;
        pointLight2.position.z = -100;
        scene.add( pointLight2 );


        // helpers
        if(drawCurves) {
            var colors = [0xff0000, 0x00ff00, 0x0000ff]
            // draw curves
            for(var cur = 0; cur < curves.length; cur++) {
                var lineGeo = curves[cur].createPointsGeometry(100);
                // "Line" is a viewable curve
                var line = new THREE.Line( lineGeo,  new THREE.LineBasicMaterial( { color: colors[cur % 3], opacity: 1, linewidth: 3 } ) );
                scene.add(line);
            }
        }

        if(wireframe) {
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