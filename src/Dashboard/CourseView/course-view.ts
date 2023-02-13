import { autoinject, computedFrom } from "aurelia-framework";
import { Dashboard } from "Dashboard/dashboard";
import { Lesson, Section } from "models/course";
import { Events, Routes } from "utils/constants";
import { DateTime, Interval } from "luxon";
import { ApplicationState } from "applicationState";
import { log } from "utils/log";
import { Busy } from "resources/busy/busy";
import { AuthenticationService } from "services/authenticationService";
import { LessonsService } from "services/lessonsService";
import { DateHelper } from "utils/dateHelper";
import { EventAggregator, Subscription } from "aurelia-event-aggregator";

@autoinject
export class CourseView {

	courseHeading: string = "";
	lessonSelected: Lesson;
	contentId: number;
	sections: Section[];
	currentSection: Section;
	busy: Busy = new Busy();
	initDone: boolean = false;
	speedSettings: SpeedSetting[] = [{
		name: "x0.25",
		speed: 0.25
	}, {
		name: "x0.5",
		speed: 0.5
	}, {
		name: "Normal",
		speed: 1,
		active: true
	}, {
		name: "x1.5",
		speed: 1.5
	}, {
		name: "x2",
		speed: 2
	}];
	lessonWatchStartTime: number;
	videoCurrentTimeStamp: number;
	playbackSpeed: number = 1;
	refreshSub: Subscription;

	constructor(
		private localParent: Dashboard,
		private appState: ApplicationState,
		private authService: AuthenticationService,
		private lessonApi: LessonsService,
		private ea: EventAggregator
	) { }

	activate(params) {
		this.contentId = params.contentId;
	}

	attached() {
		this.getData();
		this.refreshSub = this.ea.subscribe(Events.RefreshApp, () => this.getData());
	}

	detached() {
		this.endTimer();
		this.refreshSub.dispose();
	}

	async getData() {
		try {
			this.busy.on();
			this.initDone = false;
			this.sections = await this.appState.getSections();
			this.currentSection = await this.appState.getCurrentSection();
			this.courseHeading = this.authService.Course;

			this.initData();

			if (this.contentId != null) {
				this.sections.some(section => section.lessons.some(lesson => {
					if (lesson.id == this.contentId) {
						this.selectLesson(lesson);
						section.open = true;
						return true;
					}
				}));
			} else {
				this.currentSection.open = true;
			}
		} catch (error) {
			log.error(error);
		} finally {
			this.initDone = true;
			this.busy.off();
		}
	}

	initData() {
		if (this.sections == null || this.sections.length == 0) return;
		this.sections.forEach(section => {
			section.totalVideos = section.lessons.length;
			const startDate = DateTime.fromJSDate(section.startDate);
			const endDate = DateTime.fromJSDate(section.endDate);
			if (startDate.month == endDate.month) {
				section.dateString = `${startDate.toFormat("d")} - ${endDate.toFormat("d LLL")}`;
			} else {
				const interval = Interval.fromDateTimes(startDate, endDate);
				section.dateString = interval.toFormat("d LLL");
			}
			section.watchedVideos = section.lessons.filter(x => x.complete).length;
			section.available = section.order <= this.currentSection.order;
			section.open = false;
		});
	}

	selectLesson(lesson: Lesson) {
		if (lesson != null && this.lessonSelected != null && lesson.id != this.lessonSelected.id) {
			this.endTimer();
		}
		this.lessonSelected = lesson;
		this.localParent.lessonOpen = true;
		this.localParent.navigate(`${Routes.CourseContent}/${lesson.id}`);
		const video = document.getElementById("lessonVideo") as HTMLVideoElement;
		if (video != null) {
			video.currentTime = 0;
			video.src = this.lessonSelected.videoUrl;
		}
	}

	downloadLesson(lesson: Lesson) {
		this.lessonApi.logResourceDownload(lesson.id);
		this.appState.triggerToast("Downloading...")
		window.open(lesson.resourcesUrl, '_blank').focus();
	}

	adjustSpeed(speedSetting: SpeedSetting) {
		this.speedSettings.forEach(x => x.active = false);
		speedSetting.active = true;
		this.playbackSpeed = speedSetting.speed;
	}

	startTimer() {
		this.lessonWatchStartTime = DateHelper.NowDateTime().toSeconds();
	}

	endTimer() {
		if (this.lessonSelected == null) return;

		const endTime = DateHelper.NowDateTime().toSeconds();
		const elapsedTime = endTime - this.lessonWatchStartTime;
		this.lessonApi.logLessonWatchTime(this.lessonSelected.id, this.videoCurrentTimeStamp, elapsedTime);
	}

	@computedFrom("localParent.lessonOpen")
	get IsLessonSelected(): boolean {
		return this.localParent.lessonOpen;
	}
}

class SpeedSetting {
	speed: number;
	name: string;
	active?: boolean;
}