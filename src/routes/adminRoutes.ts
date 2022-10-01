import { Routes } from 'utils/constants';
import { RouteConfig } from 'aurelia-router';
import { RouterSettings } from './routeManager';
import { Roles } from 'utils/enums';

export class AdminRoutes {
	constructor() { }

	static getRoutes(): RouteConfig[] {
		return [{
			route: 'admin-dashboard',
			name: Routes.AdminDash,
			moduleId: 'AdminDashboard/admin-dashboard',
			nav: true,
			title: 'Admin Dashboard',
			settings: {
				roles: [Roles.Admin],
				navbar: true,
				authenticated: true
			} as RouterSettings
		}]
	}
}