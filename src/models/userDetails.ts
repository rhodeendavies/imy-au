import { Roles } from "utils/enums";

export class UserDetails {
	studentNumber: string;
	role: Roles;
	authenticated: boolean;

	constructor() {
		this.studentNumber = "";
		this.role = Roles.Student;
		this.authenticated = false;
	}
}

export class UserLogin {
	studentNumber: string;
	password: string;

	constructor() {
		this.studentNumber = "";
		this.password = "";
	}
}