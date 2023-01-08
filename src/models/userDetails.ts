import { Roles, Systems } from "utils/enums";

export class UserDetails {
	id: number;
	username: string;
	studentNumber: string;
	role: Roles;
	activated: boolean;
	courseId: number;
	
	course: string;
	authenticated: boolean;
	currentSystem: Systems;

	constructor() {
		this.studentNumber = "";
		this.role = Roles.Student;
		this.authenticated = false;
		this.currentSystem = Systems.Base;
		this.courseId = 0;
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

export class Availability {
	available: boolean;
	partial: boolean;
	lastCompletedAt: Date;

	constructor() {
		this.available = false;
		this.partial = false;
		this.lastCompletedAt = null;
	}
}