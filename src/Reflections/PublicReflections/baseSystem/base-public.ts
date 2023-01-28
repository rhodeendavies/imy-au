import { autoinject, computedFrom } from "aurelia-framework";
import { PublicReflections } from "../public-reflections";
import { ReflectionsService } from "services/reflectionsService";

@autoinject
export class BasePublic {

	reflections: string[];

	constructor(private localParent: PublicReflections, private reflectionsApi: ReflectionsService) { }

	attached() {
		this.getPublicReflections();
	}

	async getPublicReflections() {
		this.reflections = await this.reflectionsApi.getBasePublicReflections(this.localParent.SectionId);
	}

	@computedFrom("localParent.sectionSelected.id", "reflections.length")
	get Reflections(): string[] {
		this.getPublicReflections();
		return this.reflections;
	}
}