import { Roles } from "utils/constants";

export class UserDetails {
	username: string;
	role: Roles;

	constructor() {
		this.username = "";
		this.role = Roles.Student;
	}
}