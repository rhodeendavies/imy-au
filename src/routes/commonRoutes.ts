import { Roles } from './../utils/constants';
import { RouteConfig } from 'aurelia-router';
import { PLATFORM } from 'aurelia-pal';
import { IRouterSettings } from './routeManager';
import { RouteRoleVisibility } from './routeRoleVisibility';

export class CommonRoutes {
	constructor() { }

	static getRoutes(): RouteConfig[] {
		let visibility = new RouteRoleVisibility(Roles.Common);
		let roles = [
			Roles.Admin,
			Roles.Student
		];

		return [{
			route: ['', 'login'],
			name: 'login',
			moduleId: PLATFORM.moduleName('Login/login'),
			nav: true,
			title: 'Login',
			settings: {
				icon: "",
				visible: true,
				roles: roles,
				show: visibility
			} as IRouterSettings
		}]
	}
}