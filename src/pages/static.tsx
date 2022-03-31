import React, { Suspense, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, OrthographicCamera, Stats } from '@react-three/drei';

import { D20 } from '@/components';

import redDie from '@/assets/textures/red-die.png';
import cyanDie from '@/assets/textures/cyan-die.png';
import blueDie from '@/assets/textures/blue-die.png';
import yellowDie from '@/assets/textures/yellow-die.png';

const buttons = Array.apply(null, Array(21)).map(function (_x, i) {
	return i;
});

export const Static = () => {
	const camera = useRef();
	const [value, setValue] = useState(0);

	return (
		<div>
			<Canvas shadows dpr={[1, 2]} style={{ width: 80, height: 80, margin: '0 auto' }}>
				<color attach="background" args={['#141726']} />

				<hemisphereLight intensity={0.35} />
				<spotLight
					position={[0, 6, 0]}
					angle={1}
					penumbra={0}
					intensity={0.7}
					castShadow
					color={0xefdfd5}
					shadow-mapSize-width={256}
					shadow-mapSize-height={256}
				/>

				<Suspense fallback={null}>
					<D20 value={value} textureUrl={redDie} />
				</Suspense>

				<OrthographicCamera makeDefault ref={camera} position={[0, 8, 0]} zoom={40} />
				<OrbitControls camera={camera.current} enabled={false} />
			</Canvas>

			<Canvas shadows dpr={[1, 2]} style={{ width: 80, height: 80, margin: '0 auto' }}>
				<color attach="background" args={['#141726']} />

				<hemisphereLight intensity={0.35} />
				<spotLight
					position={[0, 6, 0]}
					angle={1}
					penumbra={0}
					intensity={0.7}
					castShadow
					color={0xefdfd5}
					shadow-mapSize-width={256}
					shadow-mapSize-height={256}
				/>

				<Suspense fallback={null}>
					<D20 value={value} textureUrl={cyanDie} />
				</Suspense>

				<OrthographicCamera makeDefault ref={camera} position={[0, 8, 0]} zoom={40} />
				<OrbitControls camera={camera.current} enabled={false} />
			</Canvas>

			<Canvas shadows dpr={[1, 2]} style={{ width: 80, height: 80, margin: '0 auto' }}>
				<color attach="background" args={['#141726']} />

				<hemisphereLight intensity={0.35} />
				<spotLight
					position={[0, 6, 0]}
					angle={1}
					penumbra={0}
					intensity={0.7}
					castShadow
					color={0xefdfd5}
					shadow-mapSize-width={256}
					shadow-mapSize-height={256}
				/>

				<Suspense fallback={null}>
					<D20 value={value} textureUrl={blueDie} />
				</Suspense>

				<OrthographicCamera makeDefault ref={camera} position={[0, 8, 0]} zoom={40} />
				<OrbitControls camera={camera.current} enabled={false} />
			</Canvas>

			<Canvas shadows dpr={[1, 2]} style={{ width: 80, height: 80, margin: '0 auto' }}>
				<color attach="background" args={['#141726']} />

				<hemisphereLight intensity={0.35} />
				<spotLight
					position={[0, 6, 0]}
					angle={1}
					penumbra={0}
					intensity={0.7}
					castShadow
					color={0xefdfd5}
					shadow-mapSize-width={256}
					shadow-mapSize-height={256}
				/>

				<Suspense fallback={null}>
					<D20 value={value} textureUrl={yellowDie} />
				</Suspense>

				<OrthographicCamera makeDefault ref={camera} position={[0, 8, 0]} zoom={40} />
				<OrbitControls camera={camera.current} enabled={false} />
			</Canvas>

			<div style={{ textAlign: 'center' }}>
				{buttons.map((val) => {
					return (
						<button
							key={val}
							onClick={() => {
								setValue(val);
							}}
							style={{ border: 0, backgroundColor: value === val ? '#ED7474' : 'white' }}
						>
							{val}
						</button>
					);
				})}
			</div>
		</div>
	);
};
