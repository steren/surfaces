var THREE = THREE;

// TODO: use CurvePath as input

/**
 * A geometry defined by joining two curves. Faces are built by joining the curves with segments
 * @param {Curve} curve1
 * @param {Curve} curve2 
 * @param {Integer} [steps=10] number of subdivision of the curves
 */
THREE.RuledSurfaceGeometry = function ( curve1, curve2, steps ) {
    THREE.Geometry.call( this );

    steps = steps || 10; 

    var stepSize = 1.0 / steps;

    for ( var i = 0; i < steps; i ++ ) {
    
        var v1 = curve1.getPoint(i*stepSize);
        this.vertices.push( new THREE.Vertex(v1) );
        
        var v2 = curve2.getPoint(i*stepSize);
        this.vertices.push( new THREE.Vertex(v2) );
    
    }
    
    var normal = new THREE.Vector3(0,0,1);
    
    for ( var i = 0; i < steps - 1; i++) {
        var face = new THREE.Face4(2*i, 2*i+1, 2*i+3, 2*i+2, normal.clone() );
        this.faces.push(face);
    }

};

THREE.RuledSurfaceGeometry.prototype = new THREE.Geometry();
THREE.RuledSurfaceGeometry.prototype.constructor = THREE.RuledSurfaceGeometry;