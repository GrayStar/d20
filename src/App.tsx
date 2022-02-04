import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';

import { routes } from '@/routes';

// Wrapped by <BrowserRouter>, allows use of 'react-router-dom' hooks such as 'useLocation'
const RoutedApp = () => {
	const { pathname } = useLocation();

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [pathname]);

	return (
		<Routes>
			{routes.map((route, index) => {
				return <Route key={index} path={route.path} element={<route.main />} />;
			})}
		</Routes>
	);
};

// Wrapped by various <ThemeProviders>, allows use of 'jss' hooks
const ThemedApp = () => {
	return (
		<BrowserRouter>
			<RoutedApp />
		</BrowserRouter>
	);
};

// Exported App, not wrapped by anything, can add various context providers here
export const App = () => {
	return <ThemedApp />;
};
