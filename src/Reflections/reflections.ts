import { autoinject } from "aurelia-framework";
import { Router } from "aurelia-router";
import { Section } from "models/course";
import { DateTime, Interval } from "luxon";
import { ApplicationState } from "applicationState";
import { AuthenticationService } from "services/authenticationService";
import { Systems } from "utils/enums";
import { Busy } from "resources/busy/busy";
import { log } from "utils/log";

@autoinject
export class Reflections {

	sections: Section[];
	sectionSelected: Section;
	showPublicReflections: boolean = false;
	evaluatingDone: boolean = false;
	busy: Busy = new Busy();
	
	constructor(private router: Router, private appState: ApplicationState, private authService: AuthenticationService) { }

	async attached() {
		try {
			this.busy.on();
			this.sections = await this.appState.getSections();
			for (let index = 0; index < this.sections.length; index++) {
				const section = this.sections[index];
				switch (this.authService.System) {
					case Systems.Base:
						section.baseReflection = await this.appState.getSectionBaseReflection(section);
						break;
					case Systems.Ludus:
						section.ludusReflection = await this.appState.getSectionLudusReflection(section);
						break;
					case Systems.Paidia:
						section.paidiaReflection = await this.appState.getSectionPaidiaReflection(section);
						break;
				}
			}
			const currentSection = await this.appState.getCurrentSection();
			this.sectionSelected = this.sections.find(x => x.id == currentSection.id);
			this.initData();
		} catch (error) {
			log.error(error);
		} finally {
			this.busy.off();
		}
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
		this.evaluatingDone = this.sectionSelected.evaluatingReflectionId != null;
	}

	navigate(fragment: string) {
		this.router.navigate(fragment);
	}

	navigateToRoute(route: string) {
		this.router.navigateToRoute(route);
	}

	selectSection(section: Section) {
		if (!section.active) return;
		if (this.sectionSelected != null) {
			this.sectionSelected.open = false;
		}
		this.sectionSelected = section;
		this.sectionSelected.open = true;
		this.evaluatingDone = this.sectionSelected.evaluatingReflectionId != null;
	}

	togglePublicReflections() {
		if (!this.evaluatingDone) return;
		this.showPublicReflections = !this.showPublicReflections;
	}
}