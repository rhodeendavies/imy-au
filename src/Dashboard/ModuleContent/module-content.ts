import { autoinject, computedFrom } from "aurelia-framework";
import { Dashboard } from "Dashboard/dashboard";
import { Resource, WeekModel } from "models/moduleDetails";
import { ComponentHelper } from "utils/componentHelper";

@autoinject
export class ModuleContent {

	// DEMO DATA
	resources: Resource[] = [{
		index: 1,
		title: "Block and inline elements",
		runTime: 4,
		watched: true,
		videoPath: "",
		resourcesPath: "",
		active: false,
		rating: 3
	}, {
		index: 2,
		title: "Images - part 1",
		runTime: 10,
		watched: true,
		videoPath: "",
		resourcesPath: "",
		active: false,
		rating: 2
	}, {
		index: 3,
		title: "Images - part 2",
		runTime: 12,
		watched: false,
		videoPath: "",
		resourcesPath: "",
		active: false,
		rating: null
	}, {
		index: 4,
		title: "Images - examples",
		runTime: 6,
		watched: false,
		videoPath: "",
		resourcesPath: "",
		active: false,
		rating: null
	}, {
		index: 5,
		title: "Video and audio",
		runTime: 9,
		watched: false,
		videoPath: "",
		resourcesPath: "",
		active: false,
		rating: null
	}];
	weeks: WeekModel[] = [{
		index: 1,
		title: "Introduction to web",
		dates: "1-7 Feb",
		totalRunTime: 26,
		totalVideos: 2,
		watchedVideos: 1,
		resources: this.resources
	}, {
		index: 2,
		title: "Introduction to HTML",
		dates: "8-14 Feb",
		totalRunTime: 83,
		totalVideos: 8,
		watchedVideos: 2,
		resources: this.resources
	}, {
		index: 3,
		title: "HTML images, video & audio",
		dates: "15-21 Feb",
		totalRunTime: 40,
		totalVideos: 5,
		watchedVideos: 3,
		resources: this.resources
	}];
	// END OF DEMO DATA


	moduleHeading: string = "IMY 110: Markup Languages";
	weekNumber: number = 4;
	weekDates: string = "22-26 Feb";
	resourceSelected: Resource;
	contentId: string;

	constructor(private localParent: Dashboard) {}

	activate(params) {
		this.contentId = params.contentId;
	}

	attached() {
		this.init();
	}

	init() {
		if (!ComponentHelper.NullOrEmpty(this.contentId)) {
			const resource = this.weeks[2].resources[2];
			resource.active = true;
			this.selectResource(resource);
		}
	}

	selectResource(resource: Resource) {
		this.resourceSelected = resource;
		this.localParent.resourceOpen = true;
	}

	@computedFrom("localParent.resourceOpen")
	get IsResourceSelected(): boolean {
		return this.localParent.resourceOpen;
	}
}