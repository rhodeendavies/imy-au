import { autoinject } from 'aurelia-framework';
import { Modal } from 'resources/modal/modal';
import { AuthenticationService } from 'services/authenticationService';

@autoinject
export class Profile {
	
	logoutModal: Modal;

	constructor(private authService: AuthenticationService) { }

	async logout() {
		await this.authService.logout();
	}

	toggleLogoutModal() {
		this.logoutModal.toggle();
	}
}