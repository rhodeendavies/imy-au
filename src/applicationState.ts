import { EventAggregator, Subscription } from "aurelia-event-aggregator";
import { autoinject, computedFrom } from "aurelia-framework";
import { Lesson, Section } from "models/course";
import { BasicLudusModifier, BasicPrompts, BasicStrategyOptions, Emotion, Emotions, PaidiaWord, Prompts, StrategyOptions } from "models/prompts";
import { BaseReflection, LudusReflection, PaidiaReflection } from "models/reflections";
import { BaseEvaluatingResponse, BaseMonitoringResponse, BasePlanningResponse, LudusEvaluatingResponse, LudusMonitoringResponse, LudusPlanningResponse, PaidiaEvaluatingResponse, PaidiaMonitoringResponse, PaidiaPlanningResponse } from "models/reflectionsResponses";
import { Busy } from "resources/busy/busy";
import { Modal } from "resources/modal/modal";
import { Toast } from "resources/toast/toast";
import { AuthenticationService } from "services/authenticationService";
import { CoursesService } from "services/coursesService";
import { ReflectionsService } from "services/reflectionsService";
import { SectionsService } from "services/sectionsService";
import { ComponentHelper } from "utils/componentHelper";
import { Events } from "utils/constants";
import { LoginScreens, ReflectionTypes, StrategyCategories, StrategyCategoryIcons } from "utils/enums";
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
	private logoutSub: Subscription;

	reflectionsEnabled: boolean = true;
	determineReflectionBusy = new Busy();
	ludusPrompts: Prompts;
	paidiaPrompts: Prompts;
	paidiaWords: PaidiaWord[];
	emotions: Emotion[];
	oneStarTopicPhrases: string[];
	twoStarTopicPhrases: string[];
	threeStarTopicPhrases: string[];
	emotionsStrings: Emotions;
	watchedLesson: Lesson;
	reflectionSection: string;
	showAreYouSure: boolean = false;
	allowDailyClose: boolean = true;
	dailyOpen: boolean = false;
	loginScreenType: LoginScreens = LoginScreens.login;
	hideHomeActive: boolean = false;
	appLoaded: boolean = false;

	constructor(
		private ea: EventAggregator,
		private courseApi: CoursesService,
		private sectionApi: SectionsService,
		private authService: AuthenticationService,
		private reflectionsApi: ReflectionsService
	) {
		this.loginSub = this.ea.subscribe(Events.Login, () => {
			this.init();
			this.determineReflectionToShow();
		});
		this.logoutSub = this.ea.subscribe(Events.Logout, () => this.refreshSections());
	}

	init() {
		this.initFromJson().then(() => this.shufflePrompts());
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

	triggerToast(message: string, seconds: number = 3, permanent: boolean = false) {
		this.toast.trigger(message, seconds, permanent);
	}

	triggerRatingModal(lesson: Lesson, sectionId: number) {
		this.watchedLesson = lesson;
		this.watchedLesson.sectionId = sectionId;
		if (!this.ratingModal.Open) {
			this.ratingModal.toggle();
		}
		this.ea.publish(Events.LessonRatingTriggered);
	}

	closeRating() {
		if (this.ratingModal.Open) {
			this.ratingModal.toggle();
		}
		if (this.watchedLesson.sectionId == this.currentSection.id) {
			this.determineReflectionToShow();
		} else {
			this.ea.publish(Events.LessonCompleted);
		}
		this.refreshSections();
		this.watchedLesson = null;
	}

	@computedFrom("ratingModal.Open")
	get RatingOpen(): boolean {
		return this.ratingModal?.Open;
	}

	triggerDailyModal() {
		if (!this.dailyModal.Open) {
			this.dailyModal.toggle();
			this.showAreYouSure = false;
		}
		this.ea.publish(Events.DailyTriggered);
	}

	closeDaily(areYouSure: boolean = true) {
		if (areYouSure) {
			if (this.dailyModal.Open) {
				this.dailyModal.toggle();
				this.dailyOpen = false;
			}
			this.refreshSections();
		} else {
			this.showAreYouSure = !this.showAreYouSure;
		}
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
		this.ea.publish(Events.PlanningTriggered);
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
		this.ea.publish(Events.MonitoringTriggered);
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
		this.ea.publish(Events.EvaluationTriggered);
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
		if (!this.reflectionsEnabled) return;

		try {
			if (this.determineReflectionBusy.active || !this.appLoaded) {
				await ComponentHelper.Sleep(500);
				return this.determineReflectionToShow();
			}

			this.determineReflectionBusy.on();
			const section = await this.getCurrentSection();
			// lessons
			const lessons = section.lessons;
			for (let index = 0; index < lessons?.length; index++) {
				const lesson = lessons[index];
				if (lesson.complete) {
					const lessonAvailable = await this.reflectionsApi.reflectionAvailable(this.authService.System, ReflectionTypes.Lesson, lesson.id);
					if (lessonAvailable.available) {
						this.triggerRatingModal(lesson, section.id);
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
		} catch (error) {
			log.error(error);
		} finally {
			this.determineReflectionBusy.off();
		}
	}

	async getSections(): Promise<Section[]> {
		if (!(await this.authService.Authenticated())) return null;

		if (this.sectionsBusy.active) {
			await ComponentHelper.Sleep(500);
			return this.getSections();
		}

		if (this.sections == null || this.sections.length == 0) {
			this.sectionsBusy.on();
			this.sections = await this.courseApi.getCourseSections(this.authService.CourseId);
			this.sections.sort((a, b) => a.order < b.order ? -1 : 1);
			this.currentSection = this.sections.find(x => x.active);
			this.reflectionsEnabled = this.currentSection?.name != "End of Content";
			if (!this.reflectionsEnabled) {
				this.ea.publish(Events.Login);
			}
			const index = this.sections.findIndex(x => x?.name == "End of Content")
			// remove end of content section
			if (index != -1) {
				this.sections.splice(index, 1);
			}
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
			section: section,
			planningReflection: planningResponse,
			monitoringReflection: monitoringResponse,
			evaluatingReflection: evaluatingResponse
		};
	}

	async getSectionPaidiaReflection(section: Section): Promise<PaidiaReflection> {
		let planningResponse: PaidiaPlanningResponse;
		if (section.planningReflectionId != null) {
			planningResponse = await this.reflectionsApi.getPaidiaPlanningReflection(section.planningReflectionId);
		}
		let monitoringResponse: PaidiaMonitoringResponse;
		if (section.monitoringReflectionId != null) {
			monitoringResponse = await this.reflectionsApi.getPaidiaMonitoringReflection(section.monitoringReflectionId);
		}
		let evaluatingResponse: PaidiaEvaluatingResponse;
		if (section.evaluatingReflectionId != null) {
			evaluatingResponse = await this.reflectionsApi.getPaidiaEvaluatingReflection(section.evaluatingReflectionId);
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
		this.shufflePrompts();
		this.ea.publish(Events.RefreshApp);
	}

	shufflePrompts() {
		this.paidiaWords.forEach(x => x.words = ComponentHelper.ShuffleArray(x.words));
		ComponentHelper.PaidiaWords = this.paidiaWords;

		this.ludusPrompts.planningPrompts = ComponentHelper.ShuffleArray(this.ludusPrompts.planningPrompts);
		this.ludusPrompts.monitoringPrompts = ComponentHelper.ShuffleArray(this.ludusPrompts.monitoringPrompts);
		this.ludusPrompts.evaluatingPrompts = ComponentHelper.ShuffleArray(this.ludusPrompts.evaluatingPrompts);

		this.paidiaPrompts.planningPrompts = ComponentHelper.ShuffleArray(this.paidiaPrompts.planningPrompts);
		this.paidiaPrompts.monitoringPrompts = ComponentHelper.ShuffleArray(this.paidiaPrompts.monitoringPrompts);
		this.paidiaPrompts.evaluatingPrompts = ComponentHelper.ShuffleArray(this.paidiaPrompts.evaluatingPrompts);

		this.emotions.forEach(emotion => {
			emotion.modifiers = ComponentHelper.ShuffleArray(emotion.modifiers);
		});

		this.oneStarTopicPhrases = ComponentHelper.ShuffleArray(this.oneStarTopicPhrases)
		this.twoStarTopicPhrases = ComponentHelper.ShuffleArray(this.twoStarTopicPhrases)
		this.threeStarTopicPhrases = ComponentHelper.ShuffleArray(this.threeStarTopicPhrases)
	}

	initFromJson(): Promise<[void, void, void, void, void, void, void]> {
		const paidiaWordsPromise = fetch("prompts/paidia-words.json")
			.then(response => response.json())
			.then((words: PaidiaWord[]) => {
				words.forEach(x => {
					x.currentIndex = 0;
				});
				this.paidiaWords = words;
				this.paidiaWords.forEach(x => x.words = ComponentHelper.ShuffleArray(x.words));
				ComponentHelper.PaidiaWords = this.paidiaWords;
			})
			.then(() => fetch("prompts/paidia-prompts.json"))
			.then(response => response.json())
			.then((prompt: BasicPrompts) => {
				this.paidiaPrompts = {
					planningPrompts: prompt.planningPrompts.map(x => ComponentHelper.GeneratePromptSections(x)),
					monitoringPrompts: prompt.monitoringPrompts.map(x => ComponentHelper.GeneratePromptSections(x)),
					evaluatingPrompts: prompt.evaluatingPrompts.map(x => ComponentHelper.GeneratePromptSections(x))
				}
			});

		const strategies110Promise = fetch("prompts/strategies-110.json")
			.then(response => response.json())
			.then((output: BasicStrategyOptions) => {
				output.learning.strategies.forEach((x, i) => x.index = i);
				output.reviewing.strategies.forEach((x, i) => x.index = i);
				output.practicing.strategies.forEach((x, i) => x.index = i);
				output.extending.strategies.forEach((x, i) => x.index = i);

				ComponentHelper.StrategyOptions110 = {
					LearningStrategies: {
						title: StrategyCategories.Learning,
						icon: StrategyCategoryIcons.Learning,
						description: output.learning.description,
						strategies: output.learning.strategies
					},
					ReviewingStrategies: {
						title: StrategyCategories.Reviewing,
						icon: StrategyCategoryIcons.Reviewing,
						description: output.reviewing.description,
						strategies: output.reviewing.strategies
					},
					PracticingStrategies: {
						title: StrategyCategories.Practicing,
						icon: StrategyCategoryIcons.Practicing,
						description: output.practicing.description,
						strategies: output.practicing.strategies
					},
					ExtendingStrategies: {
						title: StrategyCategories.Extending,
						icon: StrategyCategoryIcons.Extending,
						description: output.extending.description,
						strategies: output.extending.strategies
					}
				}
			});

		const strategies310Promise = fetch("prompts/strategies-310.json")
			.then(response => response.json())
			.then((output: BasicStrategyOptions) => {
				output.learning.strategies.forEach((x, i) => x.index = i);
				output.reviewing.strategies.forEach((x, i) => x.index = i);
				output.practicing.strategies.forEach((x, i) => x.index = i);
				output.extending.strategies.forEach((x, i) => x.index = i);

				ComponentHelper.StrategyOptions310 = {
					LearningStrategies: {
						title: StrategyCategories.Learning,
						icon: StrategyCategoryIcons.Learning,
						description: output.learning.description,
						strategies: output.learning.strategies
					},
					ReviewingStrategies: {
						title: StrategyCategories.Reviewing,
						icon: StrategyCategoryIcons.Reviewing,
						description: output.reviewing.description,
						strategies: output.reviewing.strategies
					},
					PracticingStrategies: {
						title: StrategyCategories.Practicing,
						icon: StrategyCategoryIcons.Practicing,
						description: output.practicing.description,
						strategies: output.practicing.strategies
					},
					ExtendingStrategies: {
						title: StrategyCategories.Extending,
						icon: StrategyCategoryIcons.Extending,
						description: output.extending.description,
						strategies: output.extending.strategies
					}
				}
			});

		const ludusPromptsPromise = fetch("prompts/ludus-prompts.json")
			.then(response => response.json())
			.then((prompt: BasicPrompts) => {
				this.ludusPrompts = {
					planningPrompts: prompt.planningPrompts.map(x => ComponentHelper.GeneratePromptSections(x)),
					monitoringPrompts: prompt.monitoringPrompts.map(x => ComponentHelper.GeneratePromptSections(x)),
					evaluatingPrompts: prompt.evaluatingPrompts.map(x => ComponentHelper.GeneratePromptSections(x))
				}
			});

		const ludusEmotionsPromise = fetch("prompts/ludus-emotions.json")
			.then(response => response.json())
			.then((emotionsStrings: Emotions) => {
				this.emotionsStrings = emotionsStrings;
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
						x.text = ComponentHelper.CleanPrompt(x.text)
					});
				});
			});

		const ludusModifiersPromise = fetch("prompts/ludus-modifier-descriptions.json")
			.then(response => response.json())
			.then((output: BasicLudusModifier[]) => {
				ComponentHelper.LudusModifiers = output;
			});

		const ludusTopicPhrasesPromise = fetch("prompts/ludus-topic-phrases.json")
			.then(response => response.json())
			.then((output) => {
				this.oneStarTopicPhrases = output.one;
				this.twoStarTopicPhrases = output.two;
				this.threeStarTopicPhrases = output.three;
			});

		return Promise.all([paidiaWordsPromise, strategies110Promise, strategies310Promise, ludusPromptsPromise,
			ludusEmotionsPromise, ludusModifiersPromise, ludusTopicPhrasesPromise]);
	}

	get IsLaptop(): boolean {
		return window.innerWidth <= 1200 && window.innerWidth >= 770;
	}

	get IsMobile(): boolean {
		return window.innerWidth < 770;
	}
}