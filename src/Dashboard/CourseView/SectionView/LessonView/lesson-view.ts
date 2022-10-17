import { autoinject, bindable, computedFrom } from "aurelia-framework";

@autoinject
export class LessonView {
	@bindable available: boolean = false;
	@bindable active: boolean = false;

	@computedFrom("active", "available")
	get Classes(): string {
		let classes = "";
		if (!this.available) classes += " section-lesson-unavailable";
		if (this.active) classes += " section-lesson-active";
		return classes;
	}
}