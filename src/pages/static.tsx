import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Stats } from '@react-three/drei';

import { useTexture } from '@/hooks';
import { SpotLight } from '@/components';

const Icosahedron = () => {
	const numberOfFaces = useRef(20).current;
	const texture = useTexture(numberOfFaces, { color: 'white', backgroundColor: '#3C6891', fontSize: 32 });

	const meshRef = useRef<THREE.Mesh>();
	const geometryRef = useRef<THREE.IcosahedronBufferGeometry>();

	useEffect(() => {
		if (!geometryRef.current) {
			return;
		}

		const numberOfFaceSides = 3;
		const base = new THREE.Vector2(0, 0.5);
		const center = new THREE.Vector2(0, 0);
		const angle = THREE.MathUtils.degToRad(360 / numberOfFaceSides);
		const baseUVs = [];

		for (let i = 0; i < numberOfFaceSides; i++) {
			baseUVs.push(
				base
					.clone()
					.rotateAround(center, angle * (i + 1))
					.addScalar(0.5)
			);
		}

		const uvs: number[] = [];
		const sides: number[] = [];

		for (let i = 0; i < numberOfFaces; i++) {
			uvs.push(baseUVs[1].x, baseUVs[1].y, baseUVs[2].x, baseUVs[2].y, baseUVs[0].x, baseUVs[0].y);
			sides.push(i, i, i);
		}

		geometryRef.current.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
		geometryRef.current.setAttribute('sides', new THREE.Float32BufferAttribute(sides, 1));
	}, [numberOfFaces]);

	useFrame(() => {
		if (!meshRef.current) {
			return;
		}

		meshRef.current.rotation.y += 0.01;
		meshRef.current.rotation.z += 0.01;
	});

	return (
		<mesh ref={meshRef}>
			<icosahedronBufferGeometry ref={geometryRef} attach="geometry" args={[1, 0]} />
			<meshPhongMaterial
				attach="material"
				map={texture}
				onBeforeCompile={(shader) => {
					shader.vertexShader = `
                        attribute float sides;
                        ${shader.vertexShader}
                    `.replace(
						`#include <uv_vertex>`,
						`#include <uv_vertex>
                        vUv.x = (1./${numberOfFaces}.) * (vUv.x + sides);`
					);
				}}
			/>
		</mesh>
	);
};

export const Static = () => {
	const camera = useRef();

	return (
		<div>
			<Canvas shadows dpr={window.devicePixelRatio} style={{ width: 500, height: 500, margin: '0 auto' }}>
				<color attach="background" args={['gray']} />

				<hemisphereLight intensity={0.35} />
				<SpotLight
					position={[0, 16, 0]}
					angle={0.5}
					penumbra={1}
					intensity={1}
					castShadow
					shadow-mapSize-width={2048}
					shadow-mapSize-height={2048}
				/>

				<Icosahedron />
				<gridHelper args={[10, 10, `white`, `gray`]} />

				<PerspectiveCamera makeDefault ref={camera} position={[0, 8, 0]} />
				<OrbitControls camera={camera.current} />
				<Stats />
			</Canvas>
		</div>
	);
};
