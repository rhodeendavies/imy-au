import { Roles, Systems } from "utils/enums";

export class UserDetails {
	id: number;
	username: string;
	studentNumber: string;
	role: Roles;
	activated: boolean;
	courseId: number;
	
	course: string;
	currentSystem: Systems;
}

export class UserLogin {
	studentNumber: string;
	password: string;

	constructor() {
		this.studentNumber = "";
		this.password = "";
	}
}

export class UserRegister {
	studentNumber: string;
	password: string;
	passwordConfirmation: string;

	constructor() {
		this.studentNumber = "";
		this.password = "";
		this.passwordConfirmation = "";
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

export class PasswordResetModel {
	resetToken: string;
	newPassword: string;
	newPasswordConfirmation: string;

	constructor() {
		this.resetToken = "";
		this.newPassword = "";
		this.newPasswordConfirmation = "";
	}
}

export class PasswordRequirements {
	hasMoreThanEightCharacters: boolean;
	hasDigit: boolean;
	hasUppercase: boolean;
	hasLowercase: boolean;
	hasSymbol: boolean;

	isValid() {
		return this.hasMoreThanEightCharacters && this.hasDigit && this.hasLowercase && this.hasUppercase && this.hasSymbol;
	}
}