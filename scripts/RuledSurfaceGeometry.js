var THREE = THREE;

/**
 * A geometry defined by joining two curves. Faces are built by joining the curves with segments
 * @param {[Curve]} curves Array of curves from which to generate the surface, at least two are needed to create a surface.  
 * @param {Integer} [steps=50] number of subdivision of the curves
 * @param {Integer} [segments=10] number of subdivisions the generated segments will have.
 * @param {boolean} [surface=true] should the geometry contain the ruled surface?
 * @param {boolean} [lines=false] should the geometry contain the ruled lines? will create solid bars.
 */
THREE.RuledSurfaceGeometry = function ( curves, steps, segments, surface, lines, lineRadius ) {
    THREE.Geometry.call( this );

    steps = steps || 20;
    segments = segments || 10;
    lineRadius = lineRadius || 1;
    
    for(var c = 0; c < curves.length - 1; c++) {
        if(surface) {
            this.createSurfaceForCurves(curves[c], curves[c+1], steps, segments);
        }
        if(lines) {
            this.createLinesForCurves(curves[c], curves[c+1], steps, lineRadius);
        }
    }
    
    // re-compute normals
    this.computeFaceNormals();
    this.computeVertexNormals();

};

THREE.RuledSurfaceGeometry.prototype = new THREE.Geometry();
THREE.RuledSurfaceGeometry.prototype.constructor = THREE.RuledSurfaceGeometry;

THREE.RuledSurfaceGeometry.prototype.createSurfaceForCurves = function(curve1, curve2, steps, segments) {
    var stepSize = 1.0 / steps;
        
    // temporary normal
    var normal = new THREE.Vector3(0,0,1);
    
    var vertexOffset = this.vertices.length;

    // create vertices and faces
    var vStart, vEnd, v, sideStartIndex, faceStartIndex;
    // for each side,
    for ( var i = 0; i <= steps; i ++ ) {
        vStart = curve1.getPoint(i*stepSize);
        vEnd = curve2.getPoint(i*stepSize);

        this.vertices.push( vStart );

        // index of the first vertex of the current side
        sideStartIndex = vertexOffset + (i-1) * (segments+1);

        for( var l = 0; l < segments; l++) {

            v = new THREE.Vector3();
            v.subVectors(vEnd, vStart);
            v.multiplyScalar((l+1) / segments);
            v.add(vStart);

            this.vertices.push(v);

            faceStartIndex = sideStartIndex + l;

            // create two faces per level
            if( i > 0) {
                this.faces.push( new THREE.Face3(faceStartIndex, faceStartIndex+1, faceStartIndex + (segments+2), normal.clone() ));
                this.faces.push( new THREE.Face3(faceStartIndex, faceStartIndex + (segments+2), faceStartIndex + (segments+1), normal.clone() ));
            }
        }
    }
}

THREE.RuledSurfaceGeometry.prototype.createLinesForCurves = function(curve1, curve2, steps, barRadius) {

    var barRadialSegments = 4;

    var stepSize = 1.0 / steps;

    // temporary normal
    var normal = new THREE.Vector3(0,0,1);

    var vertexOffset = this.vertices.length;

    // create vertices and faces
    var vStart, vtStart, vEnd, vtEnd, v, sideStartIndex;
    // for each line
    for ( var i = 0; i <= steps; i ++ ) {

        sideStartIndex = vertexOffset + i * barRadialSegments * 2;

        // TODO, compute a vector orthogonal to this tangent:
        // fix a part of vnStart and then solve vtStart.vnStart = 0.
        // then get a point that is in this first direction and of the required distance.
        // then make it turn using the tangent and quaternions.
        
        vStart = curve1.getPoint(i*stepSize);
        vtStart = curve1.getTangent(i*stepSize);
        
        // this is temporary
        v = vStart.clone()
        v.y = v.y + barRadius
        this.vertices.push(v);
        v = vStart.clone()
        v.z = v.z + barRadius
        this.vertices.push(v);
        v = vStart.clone()
        v.y = v.y - barRadius
        this.vertices.push(v);
        v = vStart.clone()
        v.z = v.z - barRadius
        this.vertices.push(v);

        vEnd = curve2.getPoint(i*stepSize);
        vtEnd = curve1.getTangent(i*stepSize);

        // this is temporary
        v = vEnd.clone()
        v.y = v.y + barRadius
        this.vertices.push(v);
        v = vEnd.clone()
        v.z = v.z + barRadius
        this.vertices.push(v);
        v = vEnd.clone()
        v.y = v.y - barRadius
        this.vertices.push(v);
        v = vEnd.clone()
        v.z = v.z - barRadius
        this.vertices.push(v);

        for( var l = 0; l < barRadialSegments; l++) {
            this.faces.push( new THREE.Face3(sideStartIndex + l, sideStartIndex + (l + 1) % barRadialSegments, sideStartIndex + barRadialSegments + (l + 1) % barRadialSegments, normal.clone() ));
            this.faces.push( new THREE.Face3(sideStartIndex + l, sideStartIndex + barRadialSegments + (l + 1) % barRadialSegments, sideStartIndex + barRadialSegments + l, normal.clone() ));
        }

    }
}