import { autoinject, computedFrom } from "aurelia-framework";
import { Resource, WeekModel } from "models/moduleDetails";

@autoinject
export class ModuleContent {

	weeks: WeekModel[] = [{
		index: 1,
		title: "Introduction to web",
		dates: "1-7 Feb",
		totalRunTime: 26,
		totalVideos: 2,
		watchedVideos: 1,
		resources: []
	}, {
		index: 2,
		title: "Introduction to HTML",
		dates: "8-14 Feb",
		totalRunTime: 83,
		totalVideos: 8,
		watchedVideos: 2,
		resources: []
	}, {
		index: 3,
		title: "HTML images, video & audio",
		dates: "15-21 Feb",
		totalRunTime: 40,
		totalVideos: 5,
		watchedVideos: 3,
		resources: [{
			index: 1,
			title: "Block and inline elements",
			runTime: 4,
			watched: true,
			videoPath: "",
			resourcesPath: "",
			active: false
		}, {
			index: 2,
			title: "Images - part 1",
			runTime: 10,
			watched: true,
			videoPath: "",
			resourcesPath: "",
			active: false
		}, {
			index: 3,
			title: "Images - part 2",
			runTime: 12,
			watched: false,
			videoPath: "",
			resourcesPath: "",
			active: false
		}, {
			index: 4,
			title: "Images - examples",
			runTime: 6,
			watched: false,
			videoPath: "",
			resourcesPath: "",
			active: false
		}, {
			index: 5,
			title: "Video and audio",
			runTime: 9,
			watched: false,
			videoPath: "",
			resourcesPath: "",
			active: false
		}]
	}];
	selectedResource: Resource;

	@computedFrom("selectedResource.id")
	get IsResourceSelected(): boolean {
		return this.selectedResource != null;
	}
}