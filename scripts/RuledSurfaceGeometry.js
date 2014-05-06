var THREE = THREE;

/**
 * A geometry defined by joining two curves. Faces are built by joining the curves with segments
 * @param {Curve} curve1
 * @param {Curve} curve2 
 * @param {Integer} [steps=50] number of subdivision of the curves
 * @param {levels} [levels=10] number of subdivisions the generated segments will have.
 */
THREE.RuledSurfaceGeometry = function ( curve1, curve2, steps, levels ) {
    THREE.Geometry.call( this );

    steps = steps || 50;
    levels = levels || 10;

    var stepSize = 1.0 / steps;

    // temporary normal
    var normal = new THREE.Vector3(0,0,1);
    
    // create vertices and faces
    var vStart, vEnd, v, sideStartIndex, faceStartIndex;
    // for each side,
    for ( var i = 0; i < steps; i ++ ) {
        vStart = curve1.getPoint(i*stepSize);
        vEnd = curve2.getPoint(i*stepSize);

        this.vertices.push( vStart );

        // index of the first vertex of the current side
        sideStartIndex = (i-1) * (l+1);

        for( var l = 0; l < levels; l++) {

            v = new THREE.Vector3();
            v.subVectors(vEnd, vStart);
            v.multiplyScalar((l+1) / levels);
            v.add(vStart);

            this.vertices.push(v);

            faceStartIndex = sideStartIndex + l;

            // create two faces per level
            if( i > 0) {
                this.faces.push( new THREE.Face3(faceStartIndex, faceStartIndex+1, faceStartIndex + (levels+2), normal.clone() ));
                this.faces.push( new THREE.Face3(faceStartIndex, faceStartIndex + (levels+2), faceStartIndex + (levels+1), normal.clone() ));
            }
        }
    }

    // re-compute normals
    this.computeFaceNormals();
    this.computeVertexNormals();

};

THREE.RuledSurfaceGeometry.prototype = new THREE.Geometry();
THREE.RuledSurfaceGeometry.prototype.constructor = THREE.RuledSurfaceGeometry;