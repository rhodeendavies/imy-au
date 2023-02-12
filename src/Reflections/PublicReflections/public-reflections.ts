import { EventAggregator, Subscription } from "aurelia-event-aggregator";
import { autoinject, computedFrom } from "aurelia-framework";
import { Reflections } from "Reflections/reflections";
import { Busy } from "resources/busy/busy";
import { AuthenticationService } from "services/authenticationService";
import { ComponentHelper } from "utils/componentHelper";
import { Events } from "utils/constants";
import { Systems } from "utils/enums";
import { log } from "utils/log";

@autoinject
export class PublicReflections {

	reflectionChangeSub: Subscription;
	busy: Busy = new Busy();

	constructor(
		private localParent: Reflections,
		private authService: AuthenticationService,
		private ea: EventAggregator
	) { }

	attached() {
		this.reflectionChangeSub = this.ea.subscribe(Events.ReflectionDetailsChanged, () => this.refreshSection());
	}

	detached() {
		this.reflectionChangeSub.dispose();
	}

	async refreshSection() {
		try {
			this.busy.on();
			await ComponentHelper.Sleep(500);
		} catch (error) {
			log.error(error);
		} finally {
			this.busy.off();
		}
	}
	
	@computedFrom("localParent.sectionSelected.id")
	get SectionId(): number {
		return this.localParent.sectionSelected.id;
	}

	@computedFrom("authService.System", "SectionId", "busy.active")
	get ShowBaseSystem(): boolean {
		return this.SectionId != null && this.authService.System == Systems.Base && !this.busy.active;
	}

	@computedFrom("authService.System", "SectionId", "busy.active")
	get ShowLudus(): boolean {
		return this.SectionId != null && this.authService.System == Systems.Ludus && !this.busy.active;
	}

	@computedFrom("authService.System", "SectionId", "busy.active")
	get ShowPaidia(): boolean {
		return this.SectionId != null && this.authService.System == Systems.Paidia && !this.busy.active;
	}
}