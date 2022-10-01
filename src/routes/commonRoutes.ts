import { RouteConfig } from 'aurelia-router';
import { Routes } from 'utils/constants';
import { RouterSettings } from './routeManager';

export class CommonRoutes {
	constructor() { }

	static getRoutes(): RouteConfig[] {
		return [{
			route: ['', 'login'],
			name: Routes.Login,
			moduleId: 'Login/login',
			nav: true,
			title: 'Login',
			settings: {
				roles: [""],
				navbar: false,
				authenticated: false
			} as RouterSettings
		}]
	}
}