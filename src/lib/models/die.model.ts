import { Quad, Triplet } from '@react-three/cannon';

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
