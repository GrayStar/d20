import React from 'react';
import { useRef } from 'react';
import { SpotLightHelper } from 'three';
import { SpotLightProps } from '@react-three/fiber';
import { useHelper } from '@react-three/drei';

export function SpotLight(props: SpotLightProps) {
	const spotLightRef = useRef();
	// useHelper(spotLightRef, SpotLightHelper, 'hotpink');

	return <spotLight ref={spotLightRef} {...props} />;
}
