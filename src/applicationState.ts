import { EventAggregator } from "aurelia-event-aggregator";
import { autoinject } from "aurelia-framework";
import { DateTime } from "luxon";
import { Lesson, Section } from "models/course";
import { BaseSystemReflection, Strategy } from "models/reflections";
import { Modal } from "resources/modal/modal";
import { Toast } from "resources/toast/toast";
import { ComponentHelper } from "utils/componentHelper";
import { Events } from "utils/constants";
import { StrategyCategories } from "utils/enums";
import { LessonRatedEvent } from "utils/eventModels";

@autoinject
export class ApplicationState {
	private toast: Toast;
	private ratingModal: Modal;
	private planningModal: Modal;
	private monitoringModal: Modal;
	private evaluationModal: Modal;
	private sections: Section[];
	private currentSection: Section;
	private lessonCompleted: Lesson;
	private sectionReflecting: Section;

	ratingSelected: number = null;

	watchedLesson: string;
	reflectionSection: string;

	constructor(private ea: EventAggregator) { }

	setToast(_toast: Toast) {
		this.toast = _toast;
	}

	setRatingModal(_modal: Modal) {
		this.ratingModal = _modal;
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

		// TODO: make call to set lesson as complete -> on success do following
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

	triggerPlanningModal(section: Section) {
		this.sectionReflecting = section;
		this.reflectionSection = this.sectionReflecting.name;
		this.planningModal.toggle();
	}

	submitPlanning(planning: any) {
		// TODO: make call to set lesson as complete -> on success do following
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
	}

	submitMonitoring(monitoring: any) {
		// TODO: make call to set lesson as complete -> on success do following
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
	}

	submitEvaluation(evaluation: any) {
		// TODO: make call to set lesson as complete -> on success do following
		if (this.evaluationModal.Open) {
			this.evaluationModal.toggle();
		}
		this.sectionReflecting.evaluationDone = true;
		this.determineReflectionToShow();
	}

	determineReflectionToShow() {
		if (this.sections == null || this.sections.length == 0) {
			this.getSections();
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

	getSections(): Section[] {
		if (this.sections == null || this.sections.length == 0) {
			// TODO: replace with call
			[this.sections, this.currentSection] = this.createDemoData();
		}
		return this.sections;
	}

	getCurrentSection(): Section {
		if (this.currentSection == null) {
			this.getSections();
		}
		return this.currentSection;
	}

	getCurrentReflection(): BaseSystemReflection {
		if (this.currentSection == null) {
			this.getSections();
		}
		return this.currentSection.baseReflection;
	}


	// DEMO DATA
	lessonOrder: number = 1;

	private createDemoData(): [Section[], Section] {
		const sections: Section[] = [{
			id: 0,
			name: "Introduction to web",
			order: 1,
			startDate: DateTime.fromObject({ day: 3, month: 10 }).toJSDate(),
			endDate: DateTime.fromObject({ day: 16, month: 10 }).toJSDate(),
			course: null,
			totalRunTime: 120,
			planningDone: true,
			monitoringDone: false,
			evaluationDone: false,
			baseReflection: this.createDemoReflectionData(),
			lessons: [
				this.createDemoLesson("Block and inline elements", true),
				this.createDemoLesson("Images - part 1", true),
				this.createDemoLesson("Images - part 2", true, null),
				this.createDemoLesson("Images - examples"),
				this.createDemoLesson("Video and audio")
			]
		}, {
			id: 1,
			name: "Introduction to HTML",
			order: 2,
			startDate: DateTime.fromObject({ day: 17, month: 10 }).toJSDate(),
			endDate: DateTime.fromObject({ day: 30, month: 10 }).toJSDate(),
			course: null,
			totalRunTime: 120,
			planningDone: false,
			monitoringDone: false,
			evaluationDone: false,
			baseReflection: this.createDemoReflectionData(),
			lessons: [
				this.createDemoLesson("Block and inline elements"),
				this.createDemoLesson("Images - part 1"),
				this.createDemoLesson("Images - part 2"),
				this.createDemoLesson("Images - examples"),
				this.createDemoLesson("Video and audio")
			]
		}, {
			id: 2,
			name: "HTML images, video & audio",
			order: 3,
			startDate: DateTime.fromObject({ day: 31, month: 10 }).toJSDate(),
			endDate: DateTime.fromObject({ day: 13, month: 11 }).toJSDate(),
			course: null,
			totalRunTime: 120,
			planningDone: false,
			monitoringDone: false,
			evaluationDone: false,
			baseReflection: this.createDemoReflectionData(),
			lessons: [
				this.createDemoLesson("Block and inline elements"),
				this.createDemoLesson("Images - part 1"),
				this.createDemoLesson("Images - part 2"),
				this.createDemoLesson("Images - examples"),
				this.createDemoLesson("Video and audio")
			]
		}];

		return [sections, sections[1]]
	}

	private createDemoLesson(name: string, watched: boolean = false, rating: number = 1): Lesson {
		return {
			id: this.lessonOrder,
			name: name,
			order: this.lessonOrder++,
			section: null,
			video: "",
			resources: "",
			topics: [""],
			watched: watched,
			runTime: 120,
			rating: watched ? rating : null
		}
	}

	private createDemoReflectionData(): BaseSystemReflection {
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
		}]
		const reflection = new BaseSystemReflection();
		reflection.planningReflection.feeling = 3;
		reflection.planningReflection.strengths = ComponentHelper.LoremIpsum();
		reflection.planningReflection.strategies = strategies;

		reflection.monitoringReflection.feeling = 2;
		reflection.monitoringReflection.currentQuestions = ComponentHelper.LoremIpsum();
		reflection.monitoringReflection.strategies = strategies;

		reflection.evaluatingReflection.feelings = [{
			feelingRating: 3,
			feelingDate: DateTime.fromObject({ day: 3, month: 10 }).toJSDate()
		}, {
			feelingRating: 2,
			feelingDate: DateTime.fromObject({ day: 5, month: 10 }).toJSDate()
		}, {
			feelingRating: 4,
			feelingDate: DateTime.fromObject({ day: 7, month: 10 }).toJSDate()
		}];
		reflection.evaluatingReflection.summary = ComponentHelper.LoremIpsum();
		reflection.evaluatingReflection.strategies = strategies;

		return reflection;
	}
	// END OF DEMO DATA
}