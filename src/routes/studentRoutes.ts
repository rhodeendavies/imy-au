import { RouteConfig } from 'aurelia-router';
import { RouterSettings } from './routeManager';
import { Routes } from 'utils/constants';
import { Roles } from 'utils/enums';

export class StudentRoutes {
	constructor() { }

	static getRoutes(): RouteConfig[] {
		return [{
			route: 'home',
			name: Routes.Dashboard,
			moduleId: 'Dashboard/dashboard',
			nav: true,
			title: 'Home',
			settings: {
				roles: [Roles.Student],
				navbar: true,
				authenticated: true
			} as RouterSettings
		}, {
			route: 'reflections',
			name: Routes.Reflections,
			moduleId: 'Reflections/reflections',
			nav: true,
			title: 'Reflections',
			settings: {
				roles: [Roles.Student],
				navbar: true,
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