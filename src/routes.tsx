import { Static } from '@/pages';

export const routes = [
	{
		path: '/',
		exact: true,
		private: true,
		main: Static,
	},
];
