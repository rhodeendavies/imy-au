import { autoinject, bindable } from "aurelia-framework";
import { Resource, WeekModel } from "models/moduleDetails";
import { RadioOption } from "resources/radioButton/radio-button";
import { ModuleContent } from "../module-content";
import { Modal } from 'resources/modal/modal';
import { ApplicationState } from "applicationState";

@autoinject
export class Week {
	@bindable week: WeekModel;
	videoRatingOptions: RadioOption[] = [
		{name: "3/3 - I understand fully", value: 3},
		{name: "2/3 - I understand partially", value: 2},
		{name: "1/3 - I don't understand", value: 1}
	];
	ratingSelected: number = null;
	ratingModal: Modal;
	resourceCompleted: Resource;

	constructor(private localParent: ModuleContent, private appState: ApplicationState) {}

	selectResource(resource: Resource) {
		if (this.week == null || this.week.resources == null) return;
		this.week.resources.forEach(x => x.active = false);
		resource.active = true;
		this.localParent.selectResource(resource);
	}

	completeResource(resource: Resource) {
		if (resource.watched) {
			this.resourceCompleted = resource; 
			this.triggerRatingModal();
		}
	}

	triggerRatingModal() {
		this.ratingSelected = null;
		this.ratingModal.toggle();
	}

	submitRating() {
		this.resourceCompleted.rating = this.ratingSelected;
		this.triggerRatingModal();
		this.resourceCompleted = null;
	}

	downloadResources(resource: Resource, event: Event) {
		event.stopPropagation();

		this.appState.triggerToast("Downloading...")
	}
}