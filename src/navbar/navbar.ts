import { EventAggregator, Subscription } from 'aurelia-event-aggregator';
import { autoinject } from 'aurelia-framework';
import { Router, NavModel } from 'aurelia-router';
import { AuthenticationService } from 'services/authenticationService';
import { Events, Routes } from 'utils/constants';

@autoinject
export class Navbar {

	loginSub: Subscription;
	routes: NavModel[];
	profileRoute: NavModel;

	constructor(private router: Router, private authService: AuthenticationService, private ea: EventAggregator) {

	}

	attached() {
		this.loginSub = this.ea.subscribe(Events.Login, () => {
			this.createRoutes();
		});
	}

	detached() {
		this.loginSub.dispose();
	}

	createRoutes() {
		if (this.router.navigation == null || !this.authService.authenticated) return [];
		this.routes = this.router.navigation.filter(x =>
			x.settings.navbar && x.settings.roles.includes(this.authService.role));

		this.profileRoute = this.router.navigation.find(x => 
			x.settings.roles.includes(this.authService.role) && x.config.name == Routes.Profile);
	}

	destroyRoutes() {
		this.routes = [];
		this.profileRoute = null;
	}
}