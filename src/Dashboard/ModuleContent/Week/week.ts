import { autoinject, bindable } from "aurelia-framework";
import { Resource, WeekModel } from "models/moduleDetails";
import { ModuleContent } from "../module-content";

@autoinject
export class Week {
	@bindable week: WeekModel;

	constructor(private localParent: ModuleContent) {}

	selectResource(resource: Resource) {
		if (this.week == null || this.week.resources == null) return;
		this.week.resources.forEach(x => x.active = false);
		resource.active = true;
		this.localParent.selectedResource = resource;
	}
}