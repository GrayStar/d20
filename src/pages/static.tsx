import React, { useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, OrthographicCamera, Stats } from '@react-three/drei';
import { D12, D20 } from '@/components';

const buttons = Array.apply(null, Array(21)).map(function (_x, i) {
	return i;
});

export const Static = () => {
	const camera = useRef();
	const [value, setValue] = useState(0);

	const [textColor, setTextColor] = useState('#E5361D');
	const [backgroundColor, setBackgroundColor] = useState('#2B2B2B');

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

				<D20 value={value} color={textColor} backgroundColor={backgroundColor} />

				<OrthographicCamera makeDefault ref={camera} position={[0, 8, 0]} zoom={48} />
				<OrbitControls camera={camera.current} />
				<Stats />
			</Canvas>

			<div style={{ textAlign: 'center' }}>
				<input
					type="color"
					id="text-color"
					name="text-color"
					value={textColor}
					onChange={(event) => {
						setTextColor(event.currentTarget.value);
					}}
				/>
				<input
					type="color"
					id="background-color"
					name="background-color"
					value={backgroundColor}
					onChange={(event) => {
						setBackgroundColor(event.currentTarget.value);
					}}
				/>
			</div>

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
