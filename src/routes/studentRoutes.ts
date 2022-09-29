import { RouteConfig } from 'aurelia-router';
import { IRouterSettings } from './routeManager';
import { Roles } from 'utils/constants';

export class StudentRoutes {
	constructor() { }

	static getRoutes(): RouteConfig[] {
		return [{
			route: ['dashboard'],
			name: 'dashboard',
			moduleId: 'Dashboard/dashboard',
			nav: true,
			title: 'Dashboard',
			settings: {
				roles: [Roles.Student]
			} as IRouterSettings
		}]
	}
}