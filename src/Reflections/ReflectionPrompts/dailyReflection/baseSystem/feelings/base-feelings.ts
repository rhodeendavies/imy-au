import { autoinject, computedFrom } from "aurelia-framework";
import { AuthenticationService } from "services/authenticationService";
import { BaseDaily } from "../base-daily";

@autoinject
export class BaseFeelings {

	feeling: number = null;

	constructor(private localParent: BaseDaily, private authService: AuthenticationService) {}

	attached() {
		this.feeling = null;
	}

	nextStep() {
		if (this.feeling == null) return;

		this.localParent.nextStep();
	}

	@computedFrom("authService.Course")
	get Course(): string {
		return this.authService.Course;
	}
}