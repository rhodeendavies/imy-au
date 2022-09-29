import { Roles } from 'utils/constants';
import { RouteConfig } from 'aurelia-router';
import { IRouterSettings } from './routeManager';

export class AdminRoutes {
	constructor() { }

	static getRoutes(): RouteConfig[] {
		return [{
			route: ['admin-dashboard'],
			name: 'admin-dashboard',
			moduleId: 'AdminDashboard/admin-dashboard',
			nav: true,
			title: 'Admin Dashboard',
			settings: {
				roles: [Roles.Admin]
			} as IRouterSettings
		}]
	}
}