import { autoinject } from "aurelia-framework";
import { Router } from "aurelia-router";
import { Section } from "models/course";
import { DateTime, Interval } from "luxon";
import { ApplicationState } from "applicationState";
import { AuthenticationService } from "services/authenticationService";
import { Systems } from "utils/enums";
import { Busy } from "resources/busy/busy";
import { log } from "utils/log";
import { EventAggregator } from "aurelia-event-aggregator";
import { Events } from "utils/constants";

@autoinject
export class Reflections {

	sections: Section[];
	sectionSelected: Section;
	showPublicReflections: boolean = false;
	busy: Busy = new Busy();

	constructor(
		private router: Router,
		private appState: ApplicationState,
		private authService: AuthenticationService,
		private ea: EventAggregator
	) { }

	async attached() {
		try {
			this.busy.on();
			this.sections = await this.appState.getSections();
			this.sections = this.sections.filter(x => x.system == this.authService.System)
			const currentSection = await this.appState.getCurrentSectionId();
			this.selectSection(this.sections.find(x => x.id == currentSection))
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
	}

	navigate(fragment: string) {
		this.router.navigate(fragment);
	}

	navigateToRoute(route: string) {
		this.router.navigateToRoute(route);
	}

	async selectSection(section: Section) {
		try {
			this.busy.on();
			if (!section.available) return;
			if (this.sectionSelected != null) {
				this.sectionSelected.open = false;
			}
			this.sectionSelected = section;
			this.sectionSelected.open = true;

			switch (this.authService.System) {
				case Systems.Base:
					this.sectionSelected.baseReflection = await this.appState.getSectionBaseReflection(this.sectionSelected);
					break;
				case Systems.Ludus:
					this.sectionSelected.ludusReflection = await this.appState.getSectionLudusReflection(this.sectionSelected);
					break;
				case Systems.Paidia:
					this.sectionSelected.paidiaReflection = await this.appState.getSectionPaidiaReflection(this.sectionSelected);
					break;
			}

			this.ea.publish(Events.ReflectionDetailsChanged);
		} catch (error) {
			log.error(error);
		} finally {
			this.busy.off();
		}
	}

	togglePublicReflections() {
		this.showPublicReflections = !this.showPublicReflections;
	}
}