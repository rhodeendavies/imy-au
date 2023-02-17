import { ApiWrapper } from "api";
import { autoinject } from "aurelia-framework";
import { Course, Section } from "models/course";

@autoinject
export class CoursesService {

	constructor(private api: ApiWrapper) { }

	async getCourse(courseId: number): Promise<Course> {
		try {
			return await this.api.get(`courses/${courseId}`);
		} catch (error) {
			return null;
		}
	}

	async getCourseSections(courseId: number): Promise<Section[]> {
		try {
			return await this.api.get(`courses/${courseId}/sections`);
		} catch (error) {
			return null;
		}
	}
}