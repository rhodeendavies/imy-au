import { BaseSystemEvaluating, BaseSystemReflection } from "./reflections";

export class Course {
	id: number;
	name: string;
	active: boolean;
	lecturers: string[];
	students: string[];
	sections: Section[];

	constructor() {
		this.id = 0;
		this.name = "";
		this.active = false;
		this.lecturers = [];
		this.students = [];
		this.sections = [];
	}
}

export class Section {
	id: number;
	name: string;
	order: number;
	startDate: Date;
	endDate: Date;
	lessons: Lesson[];
	totalRunTime: number;
	planningDone: boolean;
	monitoringDone: boolean;
	evaluationDone: boolean;
	baseReflection: BaseSystemReflection;
	publicBaseReflections: BaseSystemEvaluating[];

	// frontend only
	totalVideos?: number;
	watchedVideos?: number;
	dateString?: string;
	open?: boolean;
	available?: boolean;

	constructor() {
		this.id = 0;
		this.name = "";
		this.order = 0;
		this.startDate = null;
		this.endDate = null;
		this.lessons = [];
		this.totalRunTime = 0;
		this.planningDone = false;
		this.monitoringDone = false;
		this.evaluationDone = false;
		this.baseReflection = null;
		this.publicBaseReflections = null;

		this.totalVideos = 0;
		this.watchedVideos = 0;
		this.dateString = "";
		this.open = false;
		this.available = false;
	}
}

export class Lesson {
	id: number;
	engagementId: number;
	name: string;
	order: number;
	resourcesUrl: string;
	videoLength: number;
	videoUrl: string;

	section: Section;
	topics: string[];
	rating: number;
	watched: boolean;

	// frontend only
	ratingPercentage?: number;
	available?: boolean;
	topicsString?: string;

	constructor() {
		this.id = 0;
		this.name = "";
		this.order = 0;
		this.section = null;
		this.videoUrl = "";
		this.resourcesUrl = "";
		this.topics = [];
		this.watched = false;
		this.rating = null;
		this.available = false;
	}
}