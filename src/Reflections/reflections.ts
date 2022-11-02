import { autoinject } from "aurelia-framework";
import { Router } from "aurelia-router";
import { Section } from "models/course";
import { DateTime, Interval } from "luxon";
import { ApplicationState } from "applicationState";

@autoinject
export class Reflections {

	// DEMO DATA
	lessonOrder: number = 0;
	// END OF DEMO DATA

	sections: Section[];
	sectionSelected: Section;
	
	constructor(private router: Router, private appState: ApplicationState) { }

	attached() {
		// TODO: replace with call to fetch data
		this.sections = this.appState.getSections();
		this.sectionSelected = this.appState.getCurrentSection();

		this.initData();
	}

	initData() {
		if (this.sections == null || this.sections.length == 0) return;
		this.sections.forEach(section => {
			const startDate = DateTime.fromJSDate(section.startDate);
			const endDate = DateTime.fromJSDate(section.endDate);
			if (startDate.month == endDate.month) {
				section.dateString = `${startDate.toFormat("d")} - ${endDate.toFormat("d LLL")}`;
			} else {
				const interval = Interval.fromDateTimes(startDate, endDate);
				section.dateString = interval.toFormat("d LLL");
			}
		});
	}

	navigate(fragment: string) {
		this.router.navigate(fragment);
	}

	navigateToRoute(route: string) {
		this.router.navigateToRoute(route);
	}

	selectSection(section: Section) {
		if (this.sectionSelected != null) {
			this.sectionSelected.open = false;
		}
		this.sectionSelected = section;
		this.sectionSelected.open = true;
	}
}