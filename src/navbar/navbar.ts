import { ApplicationState } from 'applicationState';
import { EventAggregator, Subscription } from 'aurelia-event-aggregator';
import { autoinject, computedFrom } from 'aurelia-framework';
import { Router, NavModel } from 'aurelia-router';
import { Modal } from 'resources/modal/modal';
import { AuthenticationService } from 'services/authenticationService';
import { Events, Routes } from 'utils/constants';
import { Roles } from 'utils/enums';

@autoinject
export class Navbar {

	loginSub: Subscription;
	logoutSub: Subscription;
	routes: NavModel[];
	logoutModal: Modal;
	showNavBar: boolean = false;

	constructor(
		private router: Router,
		private authService: AuthenticationService,
		private ea: EventAggregator,
		private appState: ApplicationState
	) {

	}

	async attached() {
		this.loginSub = this.ea.subscribe(Events.Login, () => this.createRoutes());
		this.logoutSub = this.ea.subscribe(Events.Logout, () => this.createRoutes());
		if (await this.authService.Authenticated()) {
			this.createRoutes();
		}
	}

	detached() {
		this.loginSub.dispose();
		this.logoutSub.dispose();
	}

	async createRoutes() {
		this.showNavBar = this.router.navigation != null && (await this.authService.Authenticated());
		if (!this.showNavBar) return [];
		const role = await this.authService.Role();
		if (role == Roles.Student) {
			this.router.navigation.forEach(x => {
				if (x.title == "Reflections") {
					x.settings.enabled = this.appState.reflectionsEnabled;
				}
			});
		}
		this.routes = this.router.navigation.filter(x => x.settings.navbar && x.settings.enabled && x.settings.roles.includes(role));
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

	navigate(row: NavModel) {
		this.appState.hideHomeActive = false;
		this.router.navigate(row.href);
	}

	navigateHome() {
		this.appState.hideHomeActive = false;
		this.router.navigate(Routes.Dashboard, { replace: true, trigger: true });
	}

	@computedFrom("router.currentInstruction.config.nav", "showNavBar")
	get ShowNavBar(): boolean {
		return this.showNavBar && this.router.currentInstruction.config.nav == true;
	}
}