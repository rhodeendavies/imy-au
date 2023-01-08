import { autoinject, computedFrom } from "aurelia-framework";
import { Reflections } from "Reflections/reflections";
import { AuthenticationService } from "services/authenticationService";
import { Systems } from "utils/enums";

@autoinject
export class PublicReflections {


	constructor(
		private localParent: Reflections,
		private authService: AuthenticationService
	) { }

	
	@computedFrom("localParent.sectionSelected.id")
	get SectionId(): number {
		return this.localParent.sectionSelected.id;
	}

	@computedFrom("authService.System")
	get ShowBaseSystem(): boolean {
		return this.authService.System == Systems.Base;
	}

	@computedFrom("authService.System")
	get ShowLudus(): boolean {
		return this.authService.System == Systems.Ludus;
	}

	@computedFrom("authService.System")
	get ShowPaidia(): boolean {
		return this.authService.System == Systems.Paidia;
	}
}