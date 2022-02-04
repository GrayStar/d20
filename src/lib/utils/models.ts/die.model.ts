export type Vector3DHelper = [x: number, y: number, z: number];

export interface Die {
	id: number;
	size: number;
	position: Vector3DHelper;
	velocity: Vector3DHelper;
	rotation: Vector3DHelper;
}
