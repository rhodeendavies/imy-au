import { autoinject } from 'aurelia-framework';
import { AuthenticationService } from 'services/authenticationService';

@autoinject
export class Profile {
	
	constructor(private authService: AuthenticationService) { }

	async logout() {
		await this.authService.logout();
	}
}