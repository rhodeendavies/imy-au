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
	course: Course;
	lessons: Lesson[];
	totalRunTime: number;
	planningDone: boolean;
	monitoringDone: boolean;
	evaluationDone: boolean;

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
		this.course = null;
		this.lessons = [];
		this.totalRunTime = 0;
		this.totalVideos = 0;
		this.watchedVideos = 0;
		this.dateString = "";
		this.open = false;
		this.available = false;
	}
}

export class Lesson {
	id: number;
	name: string;
	order: number;
	section: Section;
	video: string;
	resources: string;
	topics: string[];
	runTime: number;
	rating: number;

	// frontend only
	watched?: boolean;
	available?: boolean;

	constructor() {
		this.id = 0;
		this.name = "";
		this.order = 0;
		this.section = null;
		this.video = "";
		this.resources = "";
		this.topics = [];
		this.watched = false;
		this.rating = null;
		this.available = false;
	}
}