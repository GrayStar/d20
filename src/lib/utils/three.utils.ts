import type { ConvexPolyhedronProps } from '@react-three/cannon';
import type { BufferGeometry } from 'three';
import { Geometry } from 'three-stdlib/deprecated/Geometry';

// Returns legacy geometry vertices, faces for ConvexPolyhedron
export function toConvexProps(bufferGeometry: BufferGeometry): ConvexPolyhedronProps['args'] {
	const geometry = new Geometry().fromBufferGeometry(bufferGeometry);

	// Merge duplicate vertices resulting from glTF export.
	// Cannon assumes contiguous, closed meshes to work
	geometry.mergeVertices();

	return [
		geometry.vertices.map((vertex) => [vertex.x, vertex.y, vertex.z]),
		geometry.faces.map((face) => [face.a, face.b, face.c]),
		[],
	];
}
