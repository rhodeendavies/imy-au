import { RouteConfig } from 'aurelia-router';
import { RouterSettings } from './routeManager';
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
				roles: [Roles.Student],
				navbar: true
			} as RouterSettings
		}, {
			route: ['profile'],
			name: 'profile',
			moduleId: 'Profile/profile',
			nav: true,
			title: 'Profile',
			settings: {
				roles: [Roles.Student],
				navbar: false
			} as RouterSettings
		}]
	}
}