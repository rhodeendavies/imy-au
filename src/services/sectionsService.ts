import { ApiWrapper } from "api";
import { autoinject } from "aurelia-framework";
import { Lesson } from "models/course";

@autoinject
export class SectionsService {

	constructor(private api: ApiWrapper) { }

	async getSectionLessons(sectionId: number): Promise<Lesson[]> {
		try {
			return await this.api.get(`sections/${sectionId}/lessons`);
		} catch (error) {
			return null;
		}
	}
}