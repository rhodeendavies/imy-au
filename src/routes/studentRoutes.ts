import { RouteConfig } from 'aurelia-router';
import { RouterSettings } from './routeManager';
import { Routes } from 'utils/constants';
import { Roles } from 'utils/enums';

export class StudentRoutes {
	constructor() { }

	static getRoutes(): RouteConfig[] {
		return [{
			route: 'dashboard',
			name: Routes.Dashboard,
			moduleId: 'Dashboard/dashboard',
			nav: true,
			title: 'Dashboard',
			settings: {
				roles: [Roles.Student],
				navbar: true,
				authenticated: true
			} as RouterSettings
		}, {
			route: 'profile',
			name: Routes.Profile,
			moduleId: 'Profile/profile',
			nav: true,
			title: 'Profile',
			settings: {
				roles: [Roles.Student],
				navbar: false,
				authenticated: true
			} as RouterSettings
		}]
	}

	static getDashboardSubRoutes(): RouteConfig[] {
		return [{
			route: ['', 'content/:contentId?'],
			name: Routes.ModuleContent,
			moduleId: 'Dashboard/ModuleContent/module-content',
			nav: true,
			title: 'Content',
			settings: {
				roles: [Roles.Student],
				navbar: true,
				authenticated: true
			} as RouterSettings
		}]
	}
}