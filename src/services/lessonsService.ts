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
}