import { autoinject, bindable, bindingMode, computedFrom } from "aurelia-framework";
import { ReflectionApiModel } from "models/reflectionsApiModels";

@autoinject
export class SectionTracker {

	@bindable numOfSections: number = 0;
	@bindable({ defaultBindingMode: bindingMode.twoWay }) section: number = 0;
	@bindable bars: boolean = false;
	@bindable linear: boolean = false;
	private sections: SectionTrackerItem[] = [];
	private activeSection: SectionTrackerItem = null;

	attached() {
		this.sections = [];
		for (let index = 0; index < this.numOfSections; index++) {
			this.sections.push(new SectionTrackerItem(index));
		}

		for (let index = 0; index < this.numOfSections; index++) {
			const section = this.sections[index];
			if (index != 0) {
				section.prev = this.sections[index - 1];
			}
			if (index != (this.numOfSections - 1)) {
				section.next = this.sections[index + 1];
			}
		}
		this.setActiveSection(this.sections[0]);
	}

	moveForward() {
		if (this.activeSection == null || this.activeSection.next == null) return;
		this.setActiveSection(this.activeSection.next);
	}

	moveBackward() {
		if (this.activeSection == null || this.activeSection.prev == null) return;
		this.setActiveSection(this.activeSection.prev);
	}

	sectionChanged() {
		if (this.activeSection == null || this.section == this.activeSection.sectionNumber) return;

		this.setActiveSection(this.sections.find(x => x.sectionNumber == this.section));
	}

	resetTracker() {
		this.attached();
	}

	private setActiveSection(newActive: SectionTrackerItem) {
		if (this.activeSection != null) {
			this.activeSection.active = false;
		}
		this.activeSection = newActive;
		this.activeSection.active = true;
		this.activeSection.visited = true;
		this.section = this.activeSection.sectionNumber;
	}

	private clickSection(newActive: SectionTrackerItem) {
		if (this.linear && !newActive.visited) return;
		this.setActiveSection(newActive);
	}

	@computedFrom("bars")
	get Classes(): string {
		let classes = "";
		if (this.bars) classes += " bar-section-tracker";
		return classes;
	}
}

class SectionTrackerItem {
	active: boolean;
	sectionNumber: number;
	next: SectionTrackerItem;
	prev: SectionTrackerItem;
	visited: boolean;

	constructor(_sectionNumber: number) {
		this.active = false;
		this.sectionNumber = _sectionNumber;
		this.next = null;
		this.prev = null;
		this.visited = false;
	}
}

export abstract class SectionTrackerParent {
	tracker: SectionTracker;
	activeSection: number;

	nextStep() {
		this.tracker.moveForward();
	}

	previousStep() {
		this.tracker.moveBackward();
	}
}