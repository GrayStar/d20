import * as THREE from 'three';

interface DiceTextureConfig {
	color: string;
	backgroundColor: string;
	fontSize: number;
}

export const useDiceTexture = (numberOfFaces: number, { color, backgroundColor, fontSize }: DiceTextureConfig) => {
	const canvas = document.createElement('canvas');
	const ctx = canvas.getContext('2d');

	if (!ctx) {
		return null;
	}

	const step = 128;
	canvas.width = step * numberOfFaces;
	canvas.height = step;

	ctx.fillStyle = backgroundColor;
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.font = `${fontSize}px Helvetica`;
	ctx.textAlign = 'center';
	ctx.fillStyle = color;
	ctx.textBaseline = 'middle';

	for (let i = 0; i < numberOfFaces; i++) {
		const currentNumber = i + 1;

		ctx.fillText(String(currentNumber), step * 0.5 + step * i, step * 0.5);

		if (currentNumber === 6 || currentNumber === 9) {
			const { width } = ctx.measureText(String(currentNumber));
			const height = 2;
			const xPosition = step * 0.5 + step * i - width * 0.5;
			const yPosition = step * 0.5 + fontSize * 0.5;

			ctx.fillRect(xPosition, yPosition, width, height);
		}
	}

	canvas.remove();

	return new THREE.CanvasTexture(canvas) as THREE.Texture;
};
