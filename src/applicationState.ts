import { EventAggregator, Subscription } from "aurelia-event-aggregator";
import { autoinject } from "aurelia-framework";
import { Lesson, Section } from "models/course";
import { BaseReflection } from "models/reflections";
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
		this.ratingModal.toggle();
	}

	submitRating() {
		if (this.ratingModal.Open) {
			this.ratingModal.toggle();
		}
		this.watchedLesson = null;
		this.determineReflectionToShow();
	}

	triggerDailyModal() {
		this.dailyModal.toggle();
		this.ea.publish(Events.DailyTriggered);
	}

	closeDaily() {
		if (this.dailyModal.Open) {
			this.dailyModal.toggle();
		}
	}

	triggerPlanningModal(sectionName: string) {
		this.reflectionSection = sectionName;
		this.planningModal.toggle();
		this.ea.publish(Events.PlanningTriggered);
	}

	closePlanning() {
		if (this.planningModal.Open) {
			this.planningModal.toggle();
		}
		this.determineReflectionToShow();
	}

	triggerMonitoringModal(sectionName: string) {
		this.reflectionSection = sectionName;
		this.monitoringModal.toggle();
		this.ea.publish(Events.MonitoringTriggered);
	}

	closeMonitoring() {
		if (this.monitoringModal.Open) {
			this.monitoringModal.toggle();
		}
		this.determineReflectionToShow();
	}

	triggerEvaluationModal(sectionName: string) {
		this.reflectionSection = sectionName;
		this.evaluationModal.toggle();
		this.ea.publish(Events.EvaluationTriggered);
	}

	closeEvaluation() {
		if (this.evaluationModal.Open) {
			this.evaluationModal.toggle();
		}
		this.determineReflectionToShow();
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
			this.currentSection = this.sections.find(x => x.active);
			for (let i = 0; i < this.sections.length; i++) {
				const section = this.sections[i];
				section.lessons = await this.sectionApi.getSectionLessons(section.id);
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
		const planningResponse = await this.reflectionsApi.getBasePlanningReflection(section.planningReflectionId);
		const monitoringResponse = await this.reflectionsApi.getBaseMonitoringReflection(section.monitoringReflectionId);
		const evaluatingResponse = await this.reflectionsApi.getBaseEvaluatingReflection(section.evaluatingReflectionId);
		return {
			id: section.id,
			planningReflection: planningResponse,
			monitoringReflection: monitoringResponse,
			evaluatingReflection: evaluatingResponse
		};
	}
}