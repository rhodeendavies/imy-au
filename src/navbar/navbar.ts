import { ApplicationState } from 'applicationState';
import { autoinject, computedFrom } from 'aurelia-framework';
import { Router, NavModel } from 'aurelia-router';

@autoinject
export class Navbar {
	constructor(private router: Router, private appState: ApplicationState) {

	}

	@computedFrom("appState.loggedInUser.role")
	get Routes(): NavModel[] {
		if (this.router.navigation == null || this.appState.loggedInUser == null) return [];
		return this.router.navigation.filter(x =>
			x.settings.navbar && x.settings.roles.includes(this.appState.loggedInUser.role));
	}

	@computedFrom("appState.loggedInUser.role")
	get ProfileRoute(): NavModel {
		if (this.router.navigation == null || this.appState.loggedInUser == null) return null;
		return this.router.navigation.find(x => 
			x.settings.roles.includes(this.appState.loggedInUser.role) && x.title == "Profile");
	}
}