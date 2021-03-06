import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Stats } from '@react-three/drei';
import { ConvexPolyhedronProps, Physics, usePlane, useConvexPolyhedron, PlaneProps } from '@react-three/cannon';

import { generateDie, toConvexProps } from '@/lib/utils';
import { SpotLight } from '@/components/spot-light';
import { Die } from '@/lib/models';
import { useDiceTexture } from '@/hooks';

const Plane = (props: PlaneProps) => {
	const [ref] = usePlane(() => ({
		rotation: [-Math.PI / 2, 0, 0],
		...props,
	}));

	return (
		<mesh ref={ref} receiveShadow>
			<planeBufferGeometry attach="geometry" args={[2048, 2048]} />
			<shadowMaterial attach="material" color="#000000" opacity={0.12} />
		</mesh>
	);
};

type IcosahedronProps = ConvexPolyhedronProps & {
	size: number;
	color: string;
	isFinished: boolean;
	onIsFinishedChange: (isFinished: boolean) => void;
};

const Icosahedron = ({ size, color, isFinished, onIsFinishedChange, ...props }: IcosahedronProps) => {
	const numberOfFaces = useRef(20).current;
	const texture = useDiceTexture(numberOfFaces, { color: '#AAAAAA', backgroundColor: '#202020', fontSize: 40 });

	const geometryRef = useRef<THREE.IcosahedronBufferGeometry>();
	const geometry = useMemo(() => new THREE.IcosahedronGeometry(size, 0), [size]);
	const args = useMemo(() => toConvexProps(geometry), [geometry]);
	const [ref, api] = useConvexPolyhedron(() => ({
		args,
		mass: 4,
		inertia: 0.06,
		...props,
	}));

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

	/* Track velocity on each frame */
	const velocityRef = useRef([0, 0, 0]);
	useEffect(() => {
		return api.velocity.subscribe((v) => (velocityRef.current = v));
	}, [api.velocity]);

	/* Track angular velocity on each frame */
	const angularVelocityRef = useRef([0, 0, 0]);
	useEffect(() => {
		return api.angularVelocity.subscribe((av) => (angularVelocityRef.current = av));
	}, [api.angularVelocity]);

	/* Track rotation on each frame */
	const rotationRef = useRef([0, 0, 0]);
	useEffect(() => {
		return api.rotation.subscribe((r) => (rotationRef.current = r));
	}, [api.rotation]);

	/* Helper to check if dice is finished rolling */
	const checkIsFinished = useCallback(() => {
		const threshold = 0.1;

		return (
			angularVelocityRef.current.every((vector) => Math.abs(vector) < threshold) &&
			velocityRef.current.every((vector) => Math.abs(vector) < threshold)
		);
	}, []);

	/* Check each frame to set state if finished rolling */
	useFrame(() => {
		if (checkIsFinished() && !isFinished) {
			onIsFinishedChange(true);

			console.log(rotationRef.current);
		}

		if (!checkIsFinished() && isFinished) {
			onIsFinishedChange(false);
		}
	});

	useEffect(() => {
		if (!props.position || !props.velocity || !props.angularVelocity) {
			return;
		}

		api.position.set(props.position[0], props.position[1], props.position[2]);
		api.velocity.set(props.velocity[0], props.velocity[1], props.velocity[2]);
		api.angularVelocity.set(props.angularVelocity[0], props.angularVelocity[1], props.angularVelocity[2]);
	}, [api.angularVelocity, api.position, api.velocity, props.angularVelocity, props.position, props.velocity]);

	return (
		<mesh ref={ref} castShadow receiveShadow>
			<icosahedronBufferGeometry ref={geometryRef} attach="geometry" args={[size, 0]} />
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

export const Home = () => {
	const camera = useRef();
	const [dice, setDice] = useState<Die[]>([]);

	useEffect(() => {
		throwDice();
	}, []);

	const handleButtonClick = () => {
		throwDice();
	};

	const throwDice = () => {
		const generatedDice = [];

		for (var i = 0; i < 1; i++) {
			generatedDice.push(generateDie(i));
		}

		setDice(generatedDice);
	};

	return (
		<div>
			<Canvas shadows dpr={window.devicePixelRatio} style={{ width: 500, height: 500, margin: '0 auto' }}>
				<color attach="background" args={['#F7F7F7']} />

				<hemisphereLight intensity={0.35} />
				<SpotLight
					position={[0, 56, 4]}
					angle={0.5}
					penumbra={1}
					intensity={1}
					castShadow
					shadow-mapSize-width={2048}
					shadow-mapSize-height={2048}
				/>

				<Physics
					gravity={[0, -9.81 * 20, 0]}
					size={256}
					iterations={16}
					defaultContactMaterial={{ restitution: 0.5 }}
				>
					<Plane />

					{dice.map((die, index) => {
						return (
							<Icosahedron
								key={die.id}
								size={die.size}
								position={die.position}
								velocity={die.velocity}
								angularVelocity={die.angularVelocity}
								color={die.color}
								isFinished={die.isFinished}
								onIsFinishedChange={(isFinished) => {
									const newDice = [...dice];
									const newDie = { ...die, isFinished };
									newDice[index] = newDie;

									setDice(newDice);
								}}
							/>
						);
					})}
				</Physics>

				<PerspectiveCamera makeDefault ref={camera} position={[0, 24, 0]} />
				<OrbitControls camera={camera.current} />
				<Stats />
			</Canvas>

			<div style={{ textAlign: 'center' }}>
				<button onClick={handleButtonClick}>THROW</button>
			</div>
		</div>
	);
};
