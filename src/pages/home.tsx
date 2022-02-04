import React, { useRef, useState } from 'react';
import * as THREE from 'three';
import { Canvas, MeshProps, useFrame } from '@react-three/fiber';

function Box(props: MeshProps) {
	// This reference gives us direct access to the THREE.Mesh object
	const ref = useRef<THREE.Mesh>();

	// Hold state for hovered and clicked events
	const [hovered, hover] = useState(false);
	const [clicked, click] = useState(false);

	// Subscribe this component to the render-loop, rotate the mesh every frame
	useFrame((state, delta) => {
		if (!ref.current) {
			return;
		}

		ref.current.rotation.x += 0.01;
	});

	// Return the view, these are regular Threejs elements expressed in JSX
	return (
		<mesh
			{...props}
			ref={ref}
			scale={clicked ? 1.5 : 1}
			onClick={(event) => click(!clicked)}
			onPointerOver={(event) => hover(true)}
			onPointerOut={(event) => hover(false)}
		>
			<boxGeometry args={[1, 1, 1]} />
			<meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
		</mesh>
	);
}

export const Home = () => {
	return (
		<div>
			<Canvas
				dpr={window.devicePixelRatio}
				style={{ width: 500, height: 500, backgroundColor: '#D4EFFF', margin: '0 auto' }}
				shadows
			>
				<ambientLight />
				<pointLight position={[10, 10, 10]} />
				<Box position={[-1.2, 0, 0]} />
				<Box position={[1.2, 0, 0]} />
			</Canvas>
		</div>
	);
};
