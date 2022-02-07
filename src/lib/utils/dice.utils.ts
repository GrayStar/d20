import { Die } from '@/lib/models';

export const generateDie = (index: number): Die => {
	const yRandom = Math.random() * 20;
	const random = Math.random() * 5;

	const xPosition = -15 - (index % 3) * 1.5;
	const yPosition = 2 + Math.floor(index / 3) * 1.5;
	const zPosition = -15 + (index % 3) * 1.5;

	const xQuaternion = ((Math.random() * 90 - 45) * Math.PI) / 180;
	const yQuaternion = 0;
	const zQuaternion = ((Math.random() * 90 - 45) * Math.PI) / 180;
	const wQuaternion = 0;

	const xVelocity = 25 + random;
	const yVelocity = 40 + yRandom;
	const zVelocity = 15 + random;

	const xAngularVelocity = 20 * Math.random() - 10;
	const yAngularVelocity = 20 * Math.random() - 10;
	const zAngularVelocity = 20 * Math.random() - 10;

	return {
		id: index,
		size: 1.5,
		position: [xPosition, yPosition, zPosition],
		quaternion: [xQuaternion, yQuaternion, zQuaternion, wQuaternion],
		velocity: [xVelocity, yVelocity, zVelocity],
		angularVelocity: [xAngularVelocity, yAngularVelocity, zAngularVelocity],
		rotation: [0, 0, 0],
		color: '#F7AE2C',
		isFinished: false,
	};
};
