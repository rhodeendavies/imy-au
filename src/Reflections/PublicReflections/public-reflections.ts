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

	@computedFrom("authService.System", "SectionId")
	get ShowBaseSystem(): boolean {
		return this.SectionId != null && this.authService.System == Systems.Base;
	}

	@computedFrom("authService.System", "SectionId")
	get ShowLudus(): boolean {
		return this.SectionId != null && this.authService.System == Systems.Ludus;
	}

	@computedFrom("authService.System", "SectionId")
	get ShowPaidia(): boolean {
		return this.SectionId != null && this.authService.System == Systems.Paidia;
	}
}