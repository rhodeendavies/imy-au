import { EventAggregator, Subscription } from "aurelia-event-aggregator";
import { autoinject, computedFrom } from "aurelia-framework";
import { Lesson, Section } from "models/course";
import { BasicPrompts, Emotion, Emotions, Prompts } from "models/prompts";
import { BaseReflection, LudusReflection } from "models/reflections";
import { BaseEvaluatingResponse, BaseMonitoringResponse, BasePlanningResponse, LudusEvaluatingResponse, LudusMonitoringResponse, LudusPlanningResponse } from "models/reflectionsResponses";
import { Busy } from "resources/busy/busy";
import { Modal } from "resources/modal/modal";
import { Toast } from "resources/toast/toast";
import { AuthenticationService } from "services/authenticationService";
import { CoursesService } from "services/coursesService";
import { ReflectionsService } from "services/reflectionsService";
import { SectionsService } from "services/sectionsService";
import { ComponentHelper } from "utils/componentHelper";
import { Events } from "utils/constants";
import { ReflectionTypes } from "utils/enums";
import { log } from "utils/log";

@autoinject
export class ApplicationState {
	private toast: Toast;
	private ratingModal: Modal;
	private dailyModal: Modal;
	private planningModal: Modal;
	private monitoringModal: Modal;
	private evaluationModal: Modal;
	private sections: Section[];
	private sectionsBusy: Busy = new Busy();
	private currentSection: Section;
	private loginSub: Subscription;
	
	ludusPrompts: Prompts;
	emotions: Emotion[];
	watchedLesson: Lesson;
	reflectionSection: string;

	constructor(
		private ea: EventAggregator,
		private courseApi: CoursesService,
		private sectionApi: SectionsService,
		private authService: AuthenticationService,
		private reflectionsApi: ReflectionsService
	) {
		this.loginSub = this.ea.subscribe(Events.Login, () => this.determineReflectionToShow());
	}

	setToast(_toast: Toast) {
		this.toast = _toast;
	}

	setRatingModal(_modal: Modal) {
		this.ratingModal = _modal;
	}

	setDailyModal(_modal: Modal) {
		this.dailyModal = _modal;
	}

	setPlanningModal(_modal: Modal) {
		this.planningModal = _modal;
	}

	setMonitoringModal(_modal: Modal) {
		this.monitoringModal = _modal;
	}

	setEvaluationModal(_modal: Modal) {
		this.evaluationModal = _modal;
	}

	triggerToast(message: string, seconds: number = 3) {
		this.toast.trigger(message, seconds);
	}

	triggerRatingModal(lesson: Lesson) {
		this.watchedLesson = lesson;
		if (!this.ratingModal.Open) {
			this.ratingModal.toggle();
		}
	}

	closeRating() {
		if (this.ratingModal.Open) {
			this.ratingModal.toggle();
		}
		this.watchedLesson = null;
		this.determineReflectionToShow();
		this.refreshSections();
	}

	@computedFrom("ratingModal.Open")
	get RatingOpen(): boolean {
		return this.ratingModal?.Open;
	}

	triggerDailyModal() {
		if (!this.dailyModal.Open) {
			this.dailyModal.toggle();
		}
		this.ea.publish(Events.DailyTriggered);
	}

	closeDaily() {
		if (this.dailyModal.Open) {
			this.dailyModal.toggle();
		}
		this.refreshSections();
	}

	@computedFrom("dailyModal.Open")
	get DailyOpen(): boolean {
		return this.dailyModal?.Open;
	}

	triggerPlanningModal(sectionName: string) {
		this.reflectionSection = sectionName;
		if (!this.planningModal.Open) {
			this.planningModal.toggle();
		}
	}

	closePlanning() {
		if (this.planningModal.Open) {
			this.planningModal.toggle();
		}
		this.determineReflectionToShow();
		this.refreshSections();
	}

	@computedFrom("planningModal.Open")
	get PlanningOpen(): boolean {
		return this.planningModal?.Open;
	}

	triggerMonitoringModal(sectionName: string) {
		this.reflectionSection = sectionName;
		if (!this.monitoringModal.Open) {
			this.monitoringModal.toggle();
		}
	}

	closeMonitoring() {
		if (this.monitoringModal.Open) {
			this.monitoringModal.toggle();
		}
		this.determineReflectionToShow();
		this.refreshSections();
	}

	@computedFrom("monitoringModal.Open")
	get MonitoringOpen(): boolean {
		return this.monitoringModal?.Open;
	}

	triggerEvaluationModal(sectionName: string) {
		this.reflectionSection = sectionName;
		if (!this.evaluationModal.Open) {
			this.evaluationModal.toggle();
		}
	}

	closeEvaluation() {
		if (this.evaluationModal.Open) {
			this.evaluationModal.toggle();
		}
		this.determineReflectionToShow();
		this.refreshSections();
	}

	@computedFrom("evaluationModal.Open")
	get EvaluationOpen(): boolean {
		return this.evaluationModal?.Open;
	}

	async determineReflectionToShow() {
		const section = await this.getCurrentSection();
		// lessons
		const lessons = section.lessons;
		for (let index = 0; index < lessons.length; index++) {
			const lesson = lessons[index];
			if (lesson.complete) {
				const lessonAvailable = await this.reflectionsApi.reflectionAvailable(this.authService.System, ReflectionTypes.Lesson, lesson.id);
				if (lessonAvailable.available) {
					this.triggerRatingModal(lesson);
					return;
				}
			}
		}
		// planning
		const planningAvailable = await this.reflectionsApi.reflectionAvailable(this.authService.System, ReflectionTypes.Planning, section.id);
		if (planningAvailable.available) {
			this.triggerPlanningModal(section.name);
			return;
		}
		// monitoring
		const monitoringAvailable = await this.reflectionsApi.reflectionAvailable(this.authService.System, ReflectionTypes.Monitoring, section.id);
		if (monitoringAvailable.available) {
			this.triggerMonitoringModal(section.name);
			return;
		}
		// evaluating
		const evaluatingAvailable = await this.reflectionsApi.reflectionAvailable(this.authService.System, ReflectionTypes.Evaluating, section.id);
		if (evaluatingAvailable.available) {
			this.triggerEvaluationModal(section.name);
			return;
		}
	}

	async getSections(): Promise<Section[]> {
		if (!(await this.authService.Authenticated())) return null;

		if (this.sectionsBusy.Active) {
			await ComponentHelper.Sleep(500);
			return this.getSections();
		}

		if (this.sections == null || this.sections.length == 0) {
			this.sectionsBusy.on();
			this.sections = await this.courseApi.getCourseSections(this.authService.CourseId);
			this.sections.sort((a, b) => a.order < b.order ? -1 : 1);
			this.currentSection = this.sections.find(x => x.active);
			for (let i = 0; i < this.sections.length; i++) {
				const section = this.sections[i];
				section.lessons = await this.sectionApi.getSectionLessons(section.id);
				section.lessons.sort((a, b) => a.order < b.order ? -1 : 1);
			}
			this.sectionsBusy.off();
		}
		return this.sections;
	}

	async getCurrentSection(): Promise<Section> {
		if (this.currentSection == null) {
			await this.getSections();
		}
		return this.currentSection;
	}

	async getCurrentSectionId(): Promise<number> {
		if (this.currentSection == null) {
			await this.getSections();
		}
		return this.currentSection.id;
	}

	async getSectionBaseReflection(section: Section): Promise<BaseReflection> {
		let planningResponse: BasePlanningResponse;
		if (section.planningReflectionId != null) {
			planningResponse = await this.reflectionsApi.getBasePlanningReflection(section.planningReflectionId);
		}
		let monitoringResponse: BaseMonitoringResponse;
		if (section.monitoringReflectionId != null) {
			monitoringResponse = await this.reflectionsApi.getBaseMonitoringReflection(section.monitoringReflectionId);
		}
		let evaluatingResponse: BaseEvaluatingResponse;
		if (section.evaluatingReflectionId != null) {
			evaluatingResponse = await this.reflectionsApi.getBaseEvaluatingReflection(section.evaluatingReflectionId);
		}
		return {
			id: section.id,
			planningReflection: planningResponse,
			monitoringReflection: monitoringResponse,
			evaluatingReflection: evaluatingResponse
		};
	}

	async getSectionLudusReflection(section: Section): Promise<LudusReflection> {
		let planningResponse: LudusPlanningResponse;
		if (section.planningReflectionId != null) {
			planningResponse = await this.reflectionsApi.getLudusPlanningReflection(section.planningReflectionId);
		}
		let monitoringResponse: LudusMonitoringResponse;
		if (section.monitoringReflectionId != null) {
			monitoringResponse = await this.reflectionsApi.getLudusMonitoringReflection(section.monitoringReflectionId);
		}
		let evaluatingResponse: LudusEvaluatingResponse;
		if (section.evaluatingReflectionId != null) {
			evaluatingResponse = await this.reflectionsApi.getLudusEvaluatingReflection(section.evaluatingReflectionId);
		}
		return {
			id: section.id,
			planningReflection: planningResponse,
			monitoringReflection: monitoringResponse,
			evaluatingReflection: evaluatingResponse
		};
	}

	refreshSections() {
		this.sections = null;
		this.currentSection = null;
		this.ea.publish(Events.RefreshApp);
	}

	async initPrompts(): Promise<void | Response> {
		return fetch("prompts/ludus-prompts.json")
			.then(response => response.json())
			.then((prompt: BasicPrompts) => {
				this.ludusPrompts = {
					planningPrompts: ComponentHelper.ShuffleArray(prompt.planningPrompts.map(x => ComponentHelper.GeneratePromptSections(x))),
					monitoringPrompts: ComponentHelper.ShuffleArray(prompt.monitoringPrompts.map(x => ComponentHelper.GeneratePromptSections(x))),
					evaluatingPrompts: ComponentHelper.ShuffleArray(prompt.evaluatingPrompts.map(x => ComponentHelper.GeneratePromptSections(x)))
				}
			});
	}

	async initEmotions(): Promise<void | Response> {
		return fetch("prompts/ludus-emotions.json")
			.then(response => response.json())
			.then((emotionsStrings: Emotions) => {
				this.emotions = [
					emotionsStrings.enjoyment,
					emotionsStrings.hope,
					emotionsStrings.pride,
					emotionsStrings.anger,
					emotionsStrings.anxiety,
					emotionsStrings.shame,
					emotionsStrings.hopelessness,
					emotionsStrings.boredom,
				];
				this.emotions.forEach(emotion => {
					emotion.modifiers.forEach(x => {
						x.emotion = emotion.text;
						x.active = false;
						x.modifier = ComponentHelper.CleanPrompt(x.modifier)
					});
					emotion.modifiers = ComponentHelper.ShuffleArray(emotion.modifiers);
				});
			});
	}
}