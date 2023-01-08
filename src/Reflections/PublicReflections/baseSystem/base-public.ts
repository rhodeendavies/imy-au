import { autoinject, computedFrom } from "aurelia-framework";
import { PublicReflections } from "../public-reflections";
import { ReflectionsService } from "services/reflectionsService";
import { BaseEvaluatingApiModel } from "models/reflectionsApiModels";

@autoinject
export class BasePublic {

	reflections: BaseEvaluatingApiModel[];

	constructor(private localParent: PublicReflections, private reflectionsApi: ReflectionsService) { }

	attached() {
		this.getPublicReflections();
	}

	async getPublicReflections() {
		this.reflections = await this.reflectionsApi.getBasePublicReflections(this.localParent.SectionId);
	}

	@computedFrom("localParent.sectionSelected.id")
	get Reflections(): BaseEvaluatingApiModel[] {
		this.getPublicReflections();
		return this.reflections;
	}
}