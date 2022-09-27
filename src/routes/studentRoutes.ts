import { RouteConfig } from 'aurelia-router';
import { PLATFORM } from 'aurelia-pal';
import { Roles } from 'utils/constants';
import { IRouterSettings } from './routeManager';
import { RouteRoleVisibility } from './routeRoleVisibility';

export class StudentRoutes {
	constructor() { }

	static getRoutes(): RouteConfig[] {
		let visibility = new RouteRoleVisibility(Roles.Student);
		let roles = [Roles.Student];

		return [{
			route: ['dashboard'],
			name: 'dashboard',
			moduleId: PLATFORM.moduleName('Dashboard/dashboard'),
			nav: true,
			title: 'Dashboard',
			settings: {
				icon: "",
				visible: true,
				roles: roles,
				show: visibility
			} as IRouterSettings
		}]
	}
}