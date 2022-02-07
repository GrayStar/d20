import type { ConvexPolyhedronProps } from '@react-three/cannon';
import type { BufferGeometry } from 'three';
import { Geometry } from 'three-stdlib/deprecated/Geometry';

// Returns legacy geometry vertices, faces for ConvP
export function toConvexProps(bufferGeometry: BufferGeometry): ConvexPolyhedronProps['args'] {
	const geo = new Geometry().fromBufferGeometry(bufferGeometry);
	// Merge duplicate vertices resulting from glTF export.
	// Cannon assumes contiguous, closed meshes to work
	geo.mergeVertices();
	return [geo.vertices.map((v) => [v.x, v.y, v.z]), geo.faces.map((f) => [f.a, f.b, f.c]), []];
}
