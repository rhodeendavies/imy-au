import { EventAggregator, Subscription } from "aurelia-event-aggregator";
import { autoinject } from "aurelia-framework";
import { DateTime } from "luxon";
import { Lesson, Section } from "models/course";
import { BaseSystemEvaluating, BaseSystemReflection, Strategy } from "models/reflections";
import { Busy } from "resources/busy/busy";
import { Modal } from "resources/modal/modal";
import { Toast } from "resources/toast/toast";
import { AuthenticationService } from "services/authenticationService";
import { CoursesService } from "services/coursesService";
import { SectionsService } from "services/sectionsService";
import { ComponentHelper } from "utils/componentHelper";
import { Events } from "utils/constants";
import { StrategyCategories } from "utils/enums";
import { LessonRatedEvent } from "utils/eventModels";
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
	private lessonCompleted: Lesson;
	private sectionReflecting: Section;
	private loginSub: Subscription;

	ratingSelected: number = null;

	watchedLesson: string;
	reflectionSection: string;

	constructor(private ea: EventAggregator, private courseApi: CoursesService, private sectionApi: SectionsService, private authService: AuthenticationService) {
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

	triggerRatingModal(lesson: Lesson, section: Section) {
		this.lessonCompleted = lesson;
		this.lessonCompleted.section = section;
		this.watchedLesson = this.lessonCompleted.name;
		this.ratingSelected = null;
		this.ratingModal.toggle();
	}

	submitRating() {
		this.lessonCompleted.rating = this.ratingSelected;

		// TODO: make call to set rating as complete -> on success do following
		if (this.ratingModal.Open) {
			this.ratingModal.toggle();
		}
		this.ea.publish(Events.LessonRated, {
			sectionId: this.lessonCompleted.section.id,
			lessonOrder: this.lessonCompleted.order
		} as LessonRatedEvent);
		this.lessonCompleted = null;

		this.determineReflectionToShow();
	}

	triggerDailyModal() {
		this.dailyModal.toggle();
		this.ea.publish(Events.DailyTriggered);
	}

	submitDaily(daily: any) {
		// TODO: make call to set daily reflection as complete -> on success do following
		if (this.dailyModal.Open) {
			this.dailyModal.toggle();
		}
	}

	triggerPlanningModal(section: Section) {
		this.sectionReflecting = section;
		this.reflectionSection = this.sectionReflecting.name;
		this.planningModal.toggle();
		this.ea.publish(Events.PlanningTriggered);
	}

	submitPlanning(planning: any) {
		// TODO: make call to set reflection as complete -> on success do following
		if (this.planningModal.Open) {
			this.planningModal.toggle();
		}
		this.sectionReflecting.planningDone = true;
		this.determineReflectionToShow();
	}

	triggerMonitoringModal(section: Section) {
		this.sectionReflecting = section;
		this.reflectionSection = this.sectionReflecting.name;
		this.monitoringModal.toggle();
		this.ea.publish(Events.MonitoringTriggered);
	}

	submitMonitoring(monitoring: any) {
		// TODO: make call to set reflection as complete -> on success do following
		if (this.monitoringModal.Open) {
			this.monitoringModal.toggle();
		}
		this.sectionReflecting.monitoringDone = true;
		this.determineReflectionToShow();
	}

	triggerEvaluationModal(section: Section) {
		this.sectionReflecting = section;
		this.reflectionSection = this.sectionReflecting.name;
		this.evaluationModal.toggle();
		this.ea.publish(Events.EvaluationTriggered);
	}

	submitEvaluation(evaluation: any) {
		// TODO: make call to set reflection as complete -> on success do following
		if (this.evaluationModal.Open) {
			this.evaluationModal.toggle();
		}
		this.sectionReflecting.evaluationDone = true;
		this.determineReflectionToShow();
	}

	async determineReflectionToShow() {
		if (this.sections == null || this.sections.length == 0) {
			await this.getSections();
			if (this.sections == null || this.sections.length == 0 || this.currentSection == null) return;
		}

		const numOfSections = this.sections.length;
		for (let sectionIndex = 0; sectionIndex < numOfSections; sectionIndex++) {
			const section = this.sections[sectionIndex];

			const numOfLessons = section.lessons?.length;
			for (let lessonIndex = 0; lessonIndex < numOfLessons; lessonIndex++) {
				const lesson = section.lessons[lessonIndex];

				if (lesson.watched && lesson.rating == null) {
					this.triggerRatingModal(lesson, section);
					return;
				}

				if (section.id == this.currentSection.id) {
					switch (lessonIndex) {
						case 0:
							if (!section.planningDone) {
								this.triggerPlanningModal(section);
								return;
							}
							break;
						case Math.ceil(numOfLessons / 2) - 1:
							if (!section.monitoringDone && lesson.watched) {
								this.triggerMonitoringModal(section);
								return;
							}
							break;
						case (numOfLessons - 1):
							if (!section.evaluationDone && lesson.watched) {
								this.triggerEvaluationModal(section);
								return;
							}
							break;
						default:
							break;
					}
				}
			}
		}
	}

	async getSections(): Promise<Section[]> {
		if (this.sectionsBusy.Active) {
			await ComponentHelper.Sleep(500);
			return this.getSections();
		}

		if (this.sections == null || this.sections.length == 0) {
			this.sectionsBusy.on();
			log.debug("fetching sections");
			this.sections = await this.courseApi.getCourseSections(this.authService.CourseId);
			const now = DateTime.now();
			this.currentSection = this.sections.find(x => DateTime.fromJSDate(x.startDate).valueOf() <= now.valueOf() && DateTime.fromJSDate(x.endDate).valueOf() > now.valueOf());
			for (let i = 0; i < this.sections.length; i++) {
				const section = this.sections[i];
				log.debug("fetching lessons");
				section.lessons = await this.sectionApi.getSectionLessons(section.id);
				section.lessons.forEach(x => x.section = section);

				// TODO: remove
				section.baseReflection = this.createDemoReflectionData();
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

	async getCurrentReflection(): Promise<BaseSystemReflection> {
		if (this.currentSection == null) {
			await this.getSections();
		}
		return this.currentSection.baseReflection;
	}


	// DEMO DATA
	lessonOrder: number = 1;
	reflectionId: number = 1;

	createDemoLesson(name: string, watched: boolean = false, rating: number = 1): Lesson {
		return {
			id: this.lessonOrder,
			engagementId: 0,
			name: name,
			order: this.lessonOrder++,
			section: null,
			video: "",
			resources: "",
			topics: [""],
			watched: watched,
			videoLength: 120,
			rating: watched ? rating : null
		}
	}

	private createDemoReflectionData(planning: boolean = true, monitoring: boolean = true, evaluating: boolean = true): BaseSystemReflection {
		const strategies: Strategy[] = [{
			title: StrategyCategories.Learning,
			strategy: "a test",
			rating: 1
		}, {
			title: StrategyCategories.Reviewing,
			strategy: "a test",
			rating: 2
		}, {
			title: StrategyCategories.Practicing,
			strategy: "a test",
			rating: 3
		}, {
			title: StrategyCategories.Extending,
			strategy: "a test",
			rating: 0
		}];
		const reflection = new BaseSystemReflection();
		reflection.id = this.reflectionId++;
		if (planning) {
			reflection.planningReflection.feeling = 3;
			reflection.planningReflection.strengths = ComponentHelper.LoremIpsum();
			reflection.planningReflection.strategies = strategies;
			reflection.planningReflection.dateRecorded = DateTime.fromObject({ day: 31, month: 10 }).toJSDate();
		} else {
			reflection.planningReflection = null;
		}

		if (monitoring) {
			reflection.monitoringReflection.feeling = 2;
			reflection.monitoringReflection.currentQuestions = ComponentHelper.LoremIpsum();
			reflection.monitoringReflection.strategies = strategies;
			reflection.monitoringReflection.dateRecorded = DateTime.fromObject({ day: 31, month: 10 }).toJSDate();
		} else {
			reflection.monitoringReflection = null;
		}

		if (evaluating) {
			reflection.evaluatingReflection = this.createDemoBaseEvaluation();
		} else {
			reflection.evaluatingReflection = null;
		}

		return reflection;
	}

	createDemoBaseEvaluation(loremIpsum: boolean = true): BaseSystemEvaluating {
		const evaluatingReflection = new BaseSystemEvaluating();
		evaluatingReflection.feelings = [{
			feelingRating: 3,
			feelingDate: DateTime.fromObject({ day: 3, month: 10 }).toJSDate()
		}, {
			feelingRating: 2,
			feelingDate: DateTime.fromObject({ day: 5, month: 10 }).toJSDate()
		}, {
			feelingRating: 4,
			feelingDate: DateTime.fromObject({ day: 7, month: 10 }).toJSDate()
		}, {
			feelingRating: 4,
			feelingDate: DateTime.fromObject({ day: 7, month: 10 }).toJSDate()
		}, {
			feelingRating: 4,
			feelingDate: DateTime.fromObject({ day: 7, month: 10 }).toJSDate()
		}];
		evaluatingReflection.summary = loremIpsum ? ComponentHelper.LoremIpsum() : ComponentHelper.DonecInterdum();
		evaluatingReflection.strategies = [{
			title: StrategyCategories.Learning,
			strategy: "a test",
			rating: 1
		}, {
			title: StrategyCategories.Reviewing,
			strategy: "a test",
			rating: 2
		}, {
			title: StrategyCategories.Practicing,
			strategy: "a test",
			rating: 3
		}, {
			title: StrategyCategories.Extending,
			strategy: "a test",
			rating: 0
		}];
		evaluatingReflection.dateRecorded = DateTime.fromObject({ day: 31, month: 10 }).toJSDate();
		return evaluatingReflection;
	}
	// END OF DEMO DATA
}