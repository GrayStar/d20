import { Home, Static } from '@/pages';

export const routes = [
	{
		path: '/home',
		exact: true,
		private: true,
		main: Home,
	},
	{
		path: '/',
		exact: true,
		private: true,
		main: Static,
	},
];
