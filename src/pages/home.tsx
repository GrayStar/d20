import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Stats } from '@react-three/drei';
import { ConvexPolyhedronProps, Physics, usePlane, useConvexPolyhedron } from '@react-three/cannon';

import { toConvexProps } from '@/lib/utils';
import { SpotLight } from '@/components/spot-light';
import { Die } from '@/lib/utils/models.ts';

const Plane = (props: any) => {
	const [ref] = usePlane(() => ({
		rotation: [-Math.PI / 2, 0, 0],
		...props,
	}));

	return (
		<mesh ref={ref} receiveShadow>
			<planeBufferGeometry args={[2048, 2048]} />
			<shadowMaterial color="#000000" opacity={0.12} />
		</mesh>
	);
};

type IcosahedronProps = ConvexPolyhedronProps & {
	size: number;
	color: string;
};

const Icosahedron = ({ size, color, ...props }: IcosahedronProps) => {
	const geometry = useMemo(() => new THREE.IcosahedronGeometry(size, 0), [size]);
	const args = useMemo(() => toConvexProps(geometry), [geometry]);
	const [ref, api] = useConvexPolyhedron(() => ({
		args,
		mass: 1,
		...props,
	}));

	useEffect(() => {
		if (!props.position || !props.rotation || !props.velocity) {
			return;
		}

		api.position.set(props.position[0], props.position[1], props.position[2]);
		api.rotation.set(props.rotation[0], props.rotation[1], props.rotation[2]);
		api.velocity.set(0, 0, 0);
		api.applyImpulse(props.velocity, [0, 0, 0]);
	}, [api, api.position, api.rotation, props.position, props.rotation, props.velocity]);

	return (
		<mesh ref={ref} castShadow receiveShadow>
			<icosahedronBufferGeometry attach="geometry" args={[size, 0]} />
			<meshPhongMaterial attach="material" color={color} />
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
		for (var i = 0; i < 5; i++) {
			const yRandom = Math.random() * 20;
			const random = Math.random() * 5;
			const xPosition = -15 - (i % 3) * 1.5;
			const yPosition = 2 + Math.floor(i / 3) * 1.5;
			const zPosition = -15 + (i % 3) * 1.5;
			const xVelocity = 25 + random;
			const yVelocity = 40 + yRandom;
			const zVelocity = 25 + random;

			const die: Die = {
				id: i,
				size: 2,
				position: [xPosition, yPosition, zPosition],
				velocity: [xVelocity, yVelocity, zVelocity],
				rotation: [0, 0, 0],
				color: '#88D3E7',
			};

			generatedDice.push(die);
		}

		for (var j = 0; j < 5; j++) {
			const yRandom = Math.random() * 20;
			const random = Math.random() * 5;
			const xPosition = -15 - (j % 3) * 1.5;
			const yPosition = 2 + Math.floor(j / 3) * 1.5;
			const zPosition = -15 + (j % 3) * 1.5;
			const xVelocity = 25 + random;
			const yVelocity = 40 + yRandom;
			const zVelocity = 25 + random;

			const die: Die = {
				id: j,
				size: 2,
				position: [-xPosition, yPosition, -zPosition],
				velocity: [-xVelocity, yVelocity, -zVelocity],
				rotation: [0, 0, 0],
				color: '#ED7474',
			};

			generatedDice.push(die);
		}

		setDice(generatedDice);
	};

	return (
		<div>
			<Canvas shadows dpr={window.devicePixelRatio} style={{ width: 600, height: 600, margin: '0 auto' }}>
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

				<Physics gravity={[0, -9.81 * 20, 0]} size={256} iterations={16}>
					<Plane />

					{dice.map((die) => {
						return (
							<Icosahedron
								key={die.id}
								size={die.size}
								position={die.position}
								velocity={die.velocity}
								rotation={die.rotation}
								color={die.color}
							/>
						);
					})}
				</Physics>

				<PerspectiveCamera makeDefault ref={camera} position={[0, 48, 0]} />
				<OrbitControls camera={camera.current} />
				<Stats />
			</Canvas>

			<div style={{ textAlign: 'center' }}>
				<button onClick={handleButtonClick}>THROW</button>
			</div>
		</div>
	);
};
