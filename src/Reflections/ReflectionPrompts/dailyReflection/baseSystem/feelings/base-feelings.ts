import { autoinject, computedFrom } from "aurelia-framework";
import { AuthenticationService } from "services/authenticationService";
import { BaseDaily } from "../base-daily";

@autoinject
export class BaseFeelings {

	constructor(private localParent: BaseDaily, private authService: AuthenticationService) {}

	nextStep() {
		if (this.localParent.model.courseFeelings.rating == null) return;
		this.localParent.nextStep();
	}

	@computedFrom("authService.Course")
	get Course(): string {
		return this.authService.Course;
	}
}