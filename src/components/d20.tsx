import * as THREE from 'three';
import React, { useEffect, useRef } from 'react';

import { useDiceTexture } from '@/hooks';
import { useFrame } from '@react-three/fiber';

const values: Record<number, [number, number, number]> = {
	1: [-1.1311609752348697, -0.8785275623985437, -1.8104122383077315],
	2: [-0.627376190250239, 0.9189636470442307, 0.5193773846078179],
	3: [0.4451392523146158, 0.5965161646779429, -0.26070805469818353],
	4: [1.1133288057375992, -0.8718574125819198, 0.21497667326327924],
	5: [3.1387975917621347, -1.3553944948750039, 1.9332568972846207],
	6: [-0.6317087678872684, -0.20594937420103424, 0.6372822487202139],
	7: [-1.4564508523408426, -0.34764750066681643, -2.8148708241853937],
	8: [-3.141559091205637, -0.6917467107586933, 1.207395936057699],
	9: [1.557232890389001, -0.3644384567420802, -0.037186467289829966],
	10: [1.5156291650210274, -0.95334228391924, 2.288927298796364],
	11: [-2.4173422662816915, 0.5200904416969081, -1.1989093661256967],
	12: [-0.45774431257795783, -0.634137520460768, 2.857594750924704],
	13: [1.8269957032668218, -1.1938397480646654, -1.29762989877987],
	14: [0.6611722616925824, 0.3475106397308129, 2.0972246932081546],
	15: [0.0007324038036477566, 0.8446347287278473, 1.9348335436273598],
	16: [-1.6063266618844048, -0.3646603556504727, -0.09936466376257255],
	17: [-2.130411163975979, -0.8213956725160818, 1.6478652422008524],
	18: [0.9932352365747941, 0.8151559105021201, 3.0847330399022326],
	19: [1.5448590848483785, 0.36479312618916226, 0.072569263482698],
	20: [0.0024073432305624248, 0.7696434066181004, 1.2032477385938132],
};

interface D20Props {
	value: number;
}

export const D20 = ({ value }: D20Props) => {
	const numberOfFaces = useRef(20).current;
	const texture = useDiceTexture(numberOfFaces, { color: '#AAAAAA', backgroundColor: '#202020', fontSize: 40 });

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

		const targetRotation = new THREE.Vector3(values[value][0], values[value][1], values[value][2]);
		const targetEuler = new THREE.Euler().setFromVector3(targetRotation);
		const targetQuaternion = new THREE.Quaternion().setFromEuler(targetEuler);

		meshRef.current.quaternion.slerp(targetQuaternion, 0.2);
	});

	return (
		<mesh ref={meshRef} castShadow receiveShadow position={[0, 0, 0]}>
			<icosahedronBufferGeometry ref={geometryRef} attach="geometry" args={[1, 0]} />
			<meshPhongMaterial
				attach="material"
				map={texture}
				shininess={40}
				specular={0x172022}
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
