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

	// size of the texture for one face of the die
	const size = 128;
	canvas.width = size * numberOfFaces;
	canvas.height = size;

	ctx.fillStyle = backgroundColor;
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.font = `${fontSize}px Helvetica`;
	ctx.textAlign = 'center';
	ctx.fillStyle = color;
	ctx.textBaseline = 'middle';

	for (let i = 0; i < numberOfFaces; i++) {
		const currentNumber = i + 1;
		const xOffset = size * i;

		// Since the textAlign and textBaseline are centered,
		// draw the text right in the center
		const center = size * 0.5;

		ctx.fillText(String(currentNumber), center + xOffset, center);

		// Underline the six and nine so users can tell which is which
		if (currentNumber === 6 || currentNumber === 9) {
			const { width } = ctx.measureText(String(currentNumber));
			const halfWidth = width * 0.5;
			const height = 2;

			const xPosition = center + xOffset - halfWidth;
			const yPosition = center + fontSize * 0.5;

			ctx.fillRect(xPosition, yPosition, width, height);
		}
	}

	canvas.remove();

	return new THREE.CanvasTexture(canvas) as THREE.Texture;
};
