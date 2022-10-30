import { Roles, Systems } from "utils/enums";

export class UserDetails {
	studentNumber: string;
	role: Roles;
	authenticated: boolean;
	system: Systems;

	constructor() {
		this.studentNumber = "";
		this.role = Roles.Student;
		this.authenticated = false;
		this.system = Systems.BaseSystem;
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