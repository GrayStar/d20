import * as THREE from 'three';
import React, { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';

import { useDiceTexture } from '@/hooks';

const values: Record<number, [number, number, number]> = {
	1: [-2.053790729917857, 0.8578087169477046, 1.3938591907844389],
	2: [-0.627376190250239, 0.9189636470442307, 0.5193773846078179],
	3: [0.4451392523146158, 0.5965161646779429, -0.26070805469818353],
	4: [1.1133288057375992, -0.8718574125819198, 0.21497667326327924],
	5: [3.1387975917621347, -1.3553944948750039, 1.9332568972846207],
	6: [-1.0818443027638107, 0.8570324908317721, 1.7432721451090027],
	7: [-1.6040938343319464, -0.36554947774272545, 3.0486532605335133],
	8: [3.1317814378763766, -1.2648977185110049, 1.1982820755738663],
	9: [1.2935152928041054, -0.23849613782100965, -0.8835785890855902],
	10: [1.6938423455266833, 0.950703998701375, -0.9354907317104614],
	11: [-2.4185244900272695, 0.5105237970986565, -1.1924917181010137],
	12: [-1.3514975185509848, 1.1954634735265697, -1.805933398200249],
	13: [0.3832259433961166, -0.30830707328583284, -3.0187358053993285],
	14: [1.575065603923566, -0.9566836488722972, -2.3521668690561306],
	15: [-3.1415851965554626, -0.2935171035158681, -1.2071541741320149],
	16: [-1.730252802630784, -0.3281700295903368, -0.4550875233752118],
	17: [-1.6928317151935606, 0.9504348846580337, -0.6337150031360983],
	18: [1.7877321264511148, 0.9372827583825708, 2.0883879616774874],
	19: [1.6001240013039641, -0.3619908309773738, -3.057578053468725],
	20: [0.0000925742084236608, -1.4745750016928687, 1.2037298586698615],
};

interface D12Props {
	value: number;
	color: string;
	backgroundColor: string;
}

export const D12 = ({ value, color, backgroundColor }: D12Props) => {
	const numberOfFaces = useRef(12).current;
	const diceTexture = useDiceTexture(numberOfFaces, { color, backgroundColor, fontSize: 48 });

	const meshRef = useRef<THREE.Mesh>();
	const geometryRef = useRef<THREE.DodecahedronBufferGeometry>();

	const targetQuaternion = useMemo(() => {
		if (value === 0) {
			return new THREE.Quaternion();
		}

		const targetRotation = values[value];
		const [xRotation, yRotation, zRotation] = targetRotation;

		const targetVector = new THREE.Vector3(xRotation, yRotation, zRotation);
		const targetEuler = new THREE.Euler().setFromVector3(targetVector);

		return new THREE.Quaternion().setFromEuler(targetEuler);
	}, [value]);

	useEffect(() => {
		if (!geometryRef.current) {
			return;
		}

		const edgesPerFace = 5;
		const base = new THREE.Vector2(0, 0.5);
		const center = new THREE.Vector2(0, 0);
		const externalAngleOfFace = THREE.MathUtils.degToRad(360 / edgesPerFace);
		const baseUVs: THREE.Vector2[] = [];

		for (let i = 0; i < edgesPerFace; i++) {
			baseUVs.push(
				base
					.clone()
					.rotateAround(center, externalAngleOfFace * i)
					.addScalar(0.5)
			);
		}
		const uvs: number[] = [];
		const sides: number[] = [];

		for (let i = 0; i < numberOfFaces; i++) {
			const sets = baseUVs.length - 2;

			for (let j = 0; j < sets; j++) {
				const vertexA = baseUVs[j];
				const vertexB = baseUVs[j + 1];
				const vertexC = baseUVs[baseUVs.length - 1];

				uvs.push(vertexA.x, vertexA.y, vertexB.x, vertexB.y, vertexC.x, vertexC.y);
			}

			for (let k = 0; k < sets * 3; k++) {
				sides.push(i);
			}
		}

		geometryRef.current.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
		geometryRef.current.setAttribute('sides', new THREE.Float32BufferAttribute(sides, 1));
	}, [numberOfFaces]);

	useFrame(() => {
		if (!meshRef.current) {
			return;
		}

		if (value === 0) {
			meshRef.current.rotation.x += 0.02;
			meshRef.current.rotation.y += 0.02;
			return;
		}

		meshRef.current.quaternion.slerp(targetQuaternion, 0.1);
	});

	return (
		<mesh ref={meshRef} castShadow receiveShadow position={[0, 0, 0]}>
			<dodecahedronBufferGeometry ref={geometryRef} attach="geometry" args={[0.5, 0]} />
			<meshPhongMaterial
				attach="material"
				map={diceTexture}
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
