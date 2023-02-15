import { EventAggregator, Subscription } from "aurelia-event-aggregator";
import { computedFrom } from "aurelia-framework";
import { ReflectionApiModel } from "models/reflectionsApiModels";
import { Busy } from "resources/busy/busy";
import { SectionTrackerParent } from "resources/sectionTracker/section-tracker";
import { AuthenticationService } from "services/authenticationService";
import { Systems } from "utils/enums";

export abstract class ReflectionStep {

	stepParent: ReflectionStepParent;
	saveOnStep: boolean = true;

	abstract saveStep();

	nextStep() {
		if (!this.AllowNext) return;
		this.saveStep();
		this.stepParent.nextStep(this.saveOnStep);
	}

	previousStep() {
		if (!this.AllowNext) return;
		this.saveStep();
		this.stepParent.previousStep(this.saveOnStep);
	}

	submit() {
		this.saveStep();
		this.stepParent.submit(true);
	}

	abstract get AllowNext(): boolean;
}

export abstract class ReflectionStepParent {

	model: ReflectionApiModel;
	mainParent: ReflectionPrompt;

	attached() {
		this.mainParent.modelLoaded = false;
		this.getModel();
	}

	abstract getModel();

	nextStep(submit: boolean) {
		this.mainParent.nextStep();
		if (submit) {
			this.submit(false);
		}
	}

	previousStep(submit: boolean) {
		this.mainParent.previousStep();
		if (submit) {
			this.submit(false);
		}
	}

	submit(completed: boolean) {
		this.model.completed = completed;
		this.mainParent.submit(this.model, completed);
	}

	@computedFrom("mainParent.Course")
	get Course(): string {
		return this.mainParent.Course;
	}
}

export abstract class ReflectionPrompt extends SectionTrackerParent {
	isOpen: boolean;
	triggerSub: Subscription;
	event: string = "NoEvent";
	busy: Busy = new Busy();
	reflectionId: number;
	modelLoaded: boolean = false;

	constructor(
		public authService: AuthenticationService,
		public ea: EventAggregator
	) {
		super();
	}

	attached() {
		this.init();
		this.triggerSub = this.ea.subscribe(this.event, () => this.init());
	}

	detached() {
		this.triggerSub.dispose();
	}

	init() {
		this.modelLoaded = false;
		this.activeSection = 0;
		if (this.tracker != null) {
			this.tracker.resetTracker();
		}
	}

	nextStep() {
		this.tracker.moveForward();
		this.isOpen = true;
	}

	previousStep() {
		this.tracker.moveBackward();
	}

	abstract submit(model: ReflectionApiModel, completed: boolean);

	@computedFrom("activeSection")
	get ShowOverview(): boolean {
		return this.activeSection == 0;
	}

	@computedFrom("authService.System", "isOpen")
	get ShowBaseSystem(): boolean {
		return this.authService.System == Systems.Base && this.isOpen;
	}

	@computedFrom("authService.System", "isOpen")
	get ShowLudus(): boolean {
		return this.authService.System == Systems.Ludus && this.isOpen;
	}

	@computedFrom("authService.System", "isOpen")
	get ShowPaidia(): boolean {
		return this.authService.System == Systems.Paidia && this.isOpen;
	}

	@computedFrom("authService.Course")
	get Course(): string {
		return this.authService.Course;
	}
}