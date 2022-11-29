import { EventAggregator, Subscription } from 'aurelia-event-aggregator';
import { autoinject } from 'aurelia-framework';
import { Router, NavModel } from 'aurelia-router';
import { Modal } from 'resources/modal/modal';
import { AuthenticationService } from 'services/authenticationService';
import { Events } from 'utils/constants';

@autoinject
export class Navbar {

	loginSub: Subscription;
	logoutSub: Subscription;
	routes: NavModel[];
	logoutModal: Modal;
	showNavBar: boolean = false;

	constructor(private router: Router, private authService: AuthenticationService, private ea: EventAggregator) {

	}

	attached() {
		this.loginSub = this.ea.subscribe(Events.Login, () => this.createRoutes());
		this.logoutSub = this.ea.subscribe(Events.Logout, () => this.createRoutes());
	}

	detached() {
		this.loginSub.dispose();
		this.logoutSub.dispose();
	}

	async createRoutes() {
		this.showNavBar = this.router.navigation != null && (await this.authService.Authenticated());
		if (!this.showNavBar) return [];
		this.routes = this.router.navigation.filter(x =>
			x.settings.navbar && x.settings.roles.includes(this.authService.Role));
	}

	destroyRoutes() {
		this.routes = [];
	}


	async logout() {
		await this.authService.logout();
		this.toggleLogoutModal();
	}

	toggleLogoutModal() {
		this.logoutModal.toggle();
	}
}