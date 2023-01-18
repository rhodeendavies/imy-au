import { ApiWrapper } from "api";
import { autoinject } from "aurelia-framework";
import { log } from "utils/log";

@autoinject
export class LessonsService {

	constructor(private api: ApiWrapper) { }

	async completeLesson(id: number): Promise<boolean> {
		try {
			const response: Response = await this.api.post(`lessons/${id}/activities/complete`, null, false);
			return response.ok;
		} catch (error) {
			log.error(error);
			return null;
		}
	}

	async logResourceDownload(id: number): Promise<boolean> {
		try {
			const response: Response = await this.api.post(`lessons/${id}/activities/resources_download`, null, false);
			return response.ok;
		} catch (error) {
			log.error(error);
			return null;
		}
	}

	async logLessonWatchTime(id: number, videoPosition: number, timeOnPage: number): Promise<boolean> {
		try {
			const model = {
				videoPosition: videoPosition,
				timeOnPage: timeOnPage
			}
			const response: Response = await this.api.post(`lessons/${id}/activities/video_watch`, model, false);
			return response.ok;
		} catch (error) {
			log.error(error);
			return null;
		}
	}
}