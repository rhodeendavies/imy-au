import { RouteConfig } from 'aurelia-router';
import { RouterSettings } from './routeManager';

export class CommonRoutes {
	constructor() { }

	static getRoutes(): RouteConfig[] {
		return [{
			route: ['', 'login'],
			name: 'login',
			moduleId: 'Login/login',
			nav: true,
			title: 'Login',
			settings: {
				roles: [""],
				navbar: false
			} as RouterSettings
		}]
	}
}