export class WeekModel {
	index: number;
	title: string;
	dates: string;
	totalRunTime: number;
	totalVideos: number;
	watchedVideos: number;
	resources: Resource[];

	constructor() {
		this.index = 0;
		this.title = "";
		this.dates = "";
		this.totalRunTime = 0;
		this.totalVideos = 0;
		this.watchedVideos = 0;
	}
}

export class Resource {
	index: number;
	title: string;
	runTime: number;
	watched: boolean;
	videoPath: string;
	resourcesPath: string;
	active: boolean;
	rating: number;

	constructor() {
		this.index = 0;
		this.title = "";
		this.runTime = 0;
		this.watched = false;
		this.videoPath = "";
		this.resourcesPath = "";
		this.rating = null;
	}
}