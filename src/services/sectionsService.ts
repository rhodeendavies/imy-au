import { ApiWrapper } from "api";
import { autoinject } from "aurelia-framework";
import { Course, Lesson } from "models/course";
import { log } from "utils/log";

@autoinject
export class SectionsService {

	constructor(private api: ApiWrapper) { }

	async getSectionLessons(sectionId: number): Promise<Lesson[]> {
		try {
			return await this.api.get(`sections/${sectionId}/lessons`);
		} catch (error) {
			log.error(error);
			return null;
		}
	}
}