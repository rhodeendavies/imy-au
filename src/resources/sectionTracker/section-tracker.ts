import { autoinject, bindable, bindingMode } from "aurelia-framework";

@autoinject
export class SectionTracker {

	@bindable numOfSections: number = 0;
	@bindable({ defaultBindingMode: bindingMode.twoWay }) section: number = 0;
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

	setActiveSection(newActive: SectionTrackerItem) {
		if (this.activeSection != null) {
			this.activeSection.active = false;
		}
		this.activeSection = newActive;
		this.activeSection.active = true;
		this.section = this.activeSection.sectionNumber;
	}
}

class SectionTrackerItem {
	active: boolean;
	sectionNumber: number;
	next: SectionTrackerItem;
	prev: SectionTrackerItem;

	constructor(_sectionNumber: number) {
		this.active = false;
		this.sectionNumber = _sectionNumber;
		this.next = null;
		this.prev = null;
	}
}