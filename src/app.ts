import { PLATFORM } from 'aurelia-pal';
import { RouteManager } from './routes/routeManager';
import { Router, RouterConfiguration } from 'aurelia-router';

export class App {
	public router: Router;

	public configureRouter(config: RouterConfiguration, router: Router): Promise<void> | PromiseLike<void> | void {
		config.title = 'Aurelia';
		// config.map([{
		// 	route: ['', 'login'],
		// 	name: 'login',
		// 	moduleId: PLATFORM.moduleName('./Login/login'),
		// 	nav: true,
		// 	title: 'Login',
		// 	// settings: {
		// 	// 	icon: "",
		// 	// 	visible: true,
		// 	// 	roles: roles,
		// 	// 	show: visibility
		// 	// } as IRouterSettings
		// }])
		config.map(RouteManager.CreateRoutes());

		this.router = router;
	}
}
