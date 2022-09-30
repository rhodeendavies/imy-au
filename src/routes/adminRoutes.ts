import { Roles } from 'utils/constants';
import { RouteConfig } from 'aurelia-router';
import { RouterSettings } from './routeManager';

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
				roles: [Roles.Admin],
				navbar: true
			} as RouterSettings
		}]
	}
}