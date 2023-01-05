import { ApiWrapper } from "api";
import { autoinject } from "aurelia-framework";
import { BaseSystemDailyApiModel } from "models/reflectionsResponses";
import { Availability } from "models/userDetails";
import { ReflectionTypes, Systems } from "utils/enums";
import { log } from "utils/log";

@autoinject
export class ReflectionsService {

	constructor(private api: ApiWrapper) { }

	async reflectionAvailable(system: Systems, category: ReflectionTypes, id: number): Promise<Availability> {
		try {
			return await this.api.get(`reflections/availability?system=${system}&category=${category}&subjectId=${id}`);
		} catch (error) {
			log.error(error);
			return null;
		}
	}

	async submitReflection(system: Systems, category: ReflectionTypes, id: number, model: BaseSystemDailyApiModel): Promise<boolean> {
		try {
			return await this.api.post(`reflections?system=${system}&category=${category}&subjectId=${id}`, model) != null;
		} catch (error) {
			log.error(error);
			return false;
		}
	}
}