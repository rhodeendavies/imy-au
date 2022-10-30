import { EventAggregator, Subscription } from "aurelia-event-aggregator";
import { autoinject, bindable, computedFrom } from "aurelia-framework";
import { ComponentHelper } from "utils/componentHelper";
import { Events } from "utils/constants";

@autoinject
export class Accordion {

	@bindable onlyHeader: boolean = false;
	@bindable open: boolean = false;
	@bindable disabled: boolean = false;
	@bindable group: string = "";
	@bindable id: string = "";
	toggleSub: Subscription;

	constructor(private ea: EventAggregator) {
		this.id = ComponentHelper.CreateId("accordion");
	}

	attached() {
		this.toggleSub = this.ea.subscribe(Events.AccordionToggle, (response: AccordionSubscription) => {
			if (response.id == this.id) {
				this.open = !this.open;
			} else if (this.group != "" && response.group == this.group) {
				this.open = false;
			}
		});
	}

	detached() {
		this.toggleSub.dispose();
	}

	toggleAccordion() {
		if (this.disabled) return;
		const data: AccordionSubscription = {
			group: this.group,
			id: this.id
		}
		this.ea.publish(Events.AccordionToggle, data);
	}

	@computedFrom("open", "disabled")
	get AccordionClasses(): string {
		let classes = "";
		if (this.open) classes += " accordion-open";
		if (this.disabled) classes += " accordion-disabled";
		if (this.onlyHeader) classes += " accordion-header-only";
		return classes;
	}
}

export class AccordionSubscription {
	group: string;
	id: string;
}