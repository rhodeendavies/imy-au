import { Roles, Systems } from "utils/enums";

export class UserDetails {
	id: number;
	username: string;
	studentNumber: string;
	role: Roles;
	courseId: number;
	
	course: string;
	authenticated: boolean;
	system: Systems;
	lastDailyReflection: Date;

	constructor() {
		this.studentNumber = "";
		this.role = Roles.Student;
		this.authenticated = false;
		this.system = Systems.BaseSystem;
		this.courseId = 0;
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