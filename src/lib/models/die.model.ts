import { Quad, Triplet } from '@react-three/cannon';

export type Vector3DHelper = [x: number, y: number, z: number];

export interface Die {
	id: number;
	size: number;
	position: Triplet;
	quaternion: Quad;
	velocity: Triplet;
	angularVelocity: Triplet;
	rotation: Triplet;
	color: string;
	isFinished: boolean;
}
