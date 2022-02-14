import React, { useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, OrthographicCamera, PerspectiveCamera, Stats } from '@react-three/drei';

import { D20 } from '@/components';

function Plane() {
	return (
		<mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} scale={[10, 10, 10]} position={[0, -1, 0]}>
			<planeBufferGeometry attach="geometry" />
			<shadowMaterial attach="material" color="#000000" opacity={0.12} />
		</mesh>
	);
}

const buttons = Array.apply(null, Array(20)).map(function (_x, i) {
	return i + 1;
});

export const Static = () => {
	const camera = useRef();
	const [value, setValue] = useState(1);

	return (
		<div>
			<Canvas shadows dpr={window.devicePixelRatio} style={{ width: 200, height: 200, margin: '0 auto' }}>
				{/* <color attach="background" args={['#F2F3F3']} /> */}

				<hemisphereLight intensity={0.35} />
				<spotLight
					position={[-2, 6, -2]}
					angle={0.5}
					penumbra={0}
					intensity={4}
					castShadow
					color={0xefdfd5}
					shadow-mapSize-width={2048}
					shadow-mapSize-height={2048}
				/>

				<D20 value={value} color="#AAAAAA" backgroundColor="#2B2B2B" />
				<Plane />

				<OrthographicCamera makeDefault ref={camera} position={[0, 8, 0]} zoom={48} />
				<OrbitControls camera={camera.current} />
				<Stats />
			</Canvas>

			<div style={{ textAlign: 'center' }}>
				{buttons.map((val) => {
					return (
						<button
							key={val}
							onClick={() => {
								setValue(val);
							}}
							style={{
								border: 0,
								borderRadius: 4,
								color: value === val ? 'white' : 'black',
								backgroundColor: value === val ? '#3654DA' : 'white',
							}}
						>
							{val}
						</button>
					);
				})}
			</div>
		</div>
	);
};
