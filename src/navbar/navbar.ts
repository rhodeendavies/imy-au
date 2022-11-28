import { EventAggregator, Subscription } from 'aurelia-event-aggregator';
import { autoinject } from 'aurelia-framework';
import { Router, NavModel } from 'aurelia-router';
import { Modal } from 'resources/modal/modal';
import { AuthenticationService } from 'services/authenticationService';
import { Events } from 'utils/constants';

@autoinject
export class Navbar {

	loginSub: Subscription;
	routes: NavModel[];
	logoutModal: Modal;

	constructor(private router: Router, private authService: AuthenticationService, private ea: EventAggregator) {

	}

	attached() {
		this.loginSub = this.ea.subscribe(Events.Login, () => this.createRoutes());
	}

	detached() {
		this.loginSub.dispose();
	}

	async createRoutes() {
		if (this.router.navigation == null || !(await this.authService.Authenticated())) return [];
		this.routes = this.router.navigation.filter(x =>
			x.settings.navbar && x.settings.roles.includes(this.authService.Role));
	}

	destroyRoutes() {
		this.routes = [];
	}


	async logout() {
		await this.authService.logout();
	}

	toggleLogoutModal() {
		this.logoutModal.toggle();
	}
}