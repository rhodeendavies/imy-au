import { StudentRoutes } from './studentRoutes';
import { AdminRoutes } from './adminRoutes';
import { RouteConfig } from 'aurelia-router';
import { CommonRoutes } from './commonRoutes';

export class RouteManager {
	static CreateRoutes(): RouteConfig[] {
		let routes = [];
		routes = routes.concat(CommonRoutes.getRoutes());
		routes = routes.concat(AdminRoutes.getRoutes());
		routes = routes.concat(StudentRoutes.getRoutes());
		
		return routes;
	}
}

export interface IRouterSettings {
	roles: string[]
}