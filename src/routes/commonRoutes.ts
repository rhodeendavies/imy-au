import { RouteConfig } from 'aurelia-router';
import { IRouterSettings } from './routeManager';

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
				roles: [""]
			} as IRouterSettings
		}]
	}
}