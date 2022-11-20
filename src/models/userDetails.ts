import { Roles, Systems } from "utils/enums";

export class UserDetails {
	studentNumber: string;
	role: Roles;
	authenticated: boolean;
	system: Systems;
	course: string;
	lastDailyReflection: Date;

	constructor() {
		this.studentNumber = "";
		this.role = Roles.Student;
		this.authenticated = false;
		this.system = Systems.BaseSystem;
		this.course = "";
		this.lastDailyReflection = null;
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