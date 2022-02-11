import * as THREE from 'three';

interface TextureConfig {
	color: string;
	backgroundColor: string;
	fontSize: number;
}

export const useTexture = (numberOfFaces: number, { color, backgroundColor, fontSize }: TextureConfig) => {
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
	ctx.font = `${fontSize}px Arial`;
	ctx.textAlign = 'center';
	ctx.fillStyle = color;
	ctx.textBaseline = 'middle';

	for (let i = 0; i < numberOfFaces; i++) {
		ctx.fillText(String(i + 1), step * 0.5 + step * i, step * 0.5);
	}

	return new THREE.CanvasTexture(canvas) as THREE.Texture;
};
