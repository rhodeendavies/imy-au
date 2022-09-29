import { UserDetails } from "models/userDetails";

export class ApplicationState {
	authenticated: boolean;
	loggedInUser: UserDetails;
}