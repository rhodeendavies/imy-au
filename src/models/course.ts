import { Systems } from "utils/enums";
import { BaseReflection, LudusReflection, PaidiaReflection } from "./reflections";

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
	totalRunTime: number;
	system: Systems;
	active: boolean;
	planningReflectionId: number;
	monitoringReflectionId: number;
	evaluatingReflectionId: number;
	dailyReflectionIds: number[];
	
	// frontend only
	lessons: Lesson[];
	totalVideos?: number;
	watchedVideos?: number;
	dateString?: string;
	open?: boolean;
	available: boolean;
	baseReflection: BaseReflection;
	ludusReflection: LudusReflection;
	paidiaReflection: PaidiaReflection;

	constructor() {
		this.id = 0;
		this.name = "";
		this.order = 0;
		this.startDate = null;
		this.endDate = null;
		this.totalRunTime = 0;
		
		this.lessons = [];
		this.totalVideos = 0;
		this.watchedVideos = 0;
		this.dateString = "";
		this.open = false;
	}
}

export class Lesson {
	id: number;
	name: string;
	order: number;
	resourcesUrl: string;
	videoUrl: string;
	videoLength: number;
	complete: boolean;
	available: boolean;

	// for frontend
	sectionId?: number;

	constructor() {
		this.id = 0;
		this.name = "";
		this.order = 0;
		this.videoUrl = "";
		this.resourcesUrl = "";
		this.complete = false;
		this.available = false;
	}
}