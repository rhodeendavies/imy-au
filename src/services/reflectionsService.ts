import { ApiWrapper } from "api";
import { autoinject } from "aurelia-framework";
import { LudusLearningExperience, PaidiaLearningExperience, ReflectionApiModel } from "models/reflectionsApiModels";
import { BaseDailyResponse, BaseEvaluatingResponse, BaseLessonResponse, BaseMonitoringResponse, BasePlanningResponse, CreateReflectionResponse, LudusDailyResponse, LudusEvaluatingResponse, LudusLessonResponse, LudusMonitoringResponse, LudusPlanningResponse, PaidiaDailyResponse, PaidiaEvaluatingResponse, PaidiaMonitoringResponse, PaidiaPlanningResponse } from "models/reflectionsResponses";
import { Availability } from "models/userDetails";
import { ReflectionTypes, Systems } from "utils/enums";

@autoinject
export class ReflectionsService {

	constructor(private api: ApiWrapper) { }

	async reflectionAvailable(system: Systems, category: ReflectionTypes, id: number): Promise<Availability> {
		try {
			return await this.api.get(`reflections/availability?system=${system}&category=${category}&subjectId=${id}`);
		} catch (error) {
			return null;
		}
	}

	async createReflection(system: Systems, category: ReflectionTypes, id: number): Promise<number> {
		try {
			const response: CreateReflectionResponse = await this.api.post(`reflections?system=${system}&category=${category}&subjectId=${id}`, null);
			return response.id;
		} catch (error) {
			return null;
		}
	}

	async submitReflection(system: Systems, category: ReflectionTypes, reflectionId: number, model: ReflectionApiModel): Promise<boolean> {
		try {
			const response: Response = await this.api.patch(`reflections/${reflectionId}?system=${system}&category=${category}`, model, false);
			return response.ok;
		} catch (error) {
			return false;
		}
	}

	// ========================== BASE ======================================
	async getBaseLessonReflection(id: number): Promise<BaseLessonResponse> {
		try {
			return await this.api.get(`reflections/${id}?system=${Systems.Base}&category=${ReflectionTypes.Lesson}`);
		} catch (error) {
			return null;
		}
	}

	async getBaseDailyReflection(id: number): Promise<BaseDailyResponse> {
		try {
			return await this.api.get(`reflections/${id}?system=${Systems.Base}&category=${ReflectionTypes.Daily}`);
		} catch (error) {
			return null;
		}
	}

	async getBasePlanningReflection(id: number): Promise<BasePlanningResponse> {
		try {
			return await this.api.get(`reflections/${id}?system=${Systems.Base}&category=${ReflectionTypes.Planning}`);
		} catch (error) {
			return null;
		}
	}

	async getBaseMonitoringReflection(id: number): Promise<BaseMonitoringResponse> {
		try {
			return await this.api.get(`reflections/${id}?system=${Systems.Base}&category=${ReflectionTypes.Monitoring}`);
		} catch (error) {
			return null;
		}
	}

	async getBaseEvaluatingReflection(id: number): Promise<BaseEvaluatingResponse> {
		try {
			return await this.api.get(`reflections/${id}?system=${Systems.Base}&category=${ReflectionTypes.Evaluating}`);
		} catch (error) {
			return null;
		}
	}

	async getBasePublicReflections(id: number): Promise<string[]> {
		try {
			return await this.api.get(`reflections/public?system=${Systems.Base}&subjectId=${id}`);
		} catch (error) {
			return null;
		}
	}
	// =======================================================================

	// ========================== LUDUS ======================================
	async getLudusLessonReflection(id: number): Promise<LudusLessonResponse> {
		try {
			return await this.api.get(`reflections/${id}?system=${Systems.Ludus}&category=${ReflectionTypes.Lesson}`);
		} catch (error) {
			return null;
		}
	}

	async getLudusDailyReflection(id: number): Promise<LudusDailyResponse> {
		try {
			return await this.api.get(`reflections/${id}?system=${Systems.Ludus}&category=${ReflectionTypes.Daily}`);
		} catch (error) {
			return null;
		}
	}

	async getLudusPlanningReflection(id: number): Promise<LudusPlanningResponse> {
		try {
			return await this.api.get(`reflections/${id}?system=${Systems.Ludus}&category=${ReflectionTypes.Planning}`);
		} catch (error) {
			return null;
		}
	}

	async getLudusMonitoringReflection(id: number): Promise<LudusMonitoringResponse> {
		try {
			return await this.api.get(`reflections/${id}?system=${Systems.Ludus}&category=${ReflectionTypes.Monitoring}`);
		} catch (error) {
			return null;
		}
	}

	async getLudusEvaluatingReflection(id: number): Promise<LudusEvaluatingResponse> {
		try {
			return await this.api.get(`reflections/${id}?system=${Systems.Ludus}&category=${ReflectionTypes.Evaluating}`);
		} catch (error) {
			return null;
		}
	}

	async getLudusPublicReflections(id: number): Promise<LudusLearningExperience[]> {
		try {
			return await this.api.get(`reflections/public?system=${Systems.Ludus}&subjectId=${id}`);
		} catch (error) {
			return null;
		}
	}
	// =======================================================================

	// ========================== PAIDIA ======================================
	async getPaidiaLessonReflection(id: number): Promise<BaseLessonResponse> {
		try {
			return await this.api.get(`reflections/${id}?system=${Systems.Paidia}&category=${ReflectionTypes.Lesson}`);
		} catch (error) {
			return null;
		}
	}

	async getPaidiaDailyReflection(id: number): Promise<PaidiaDailyResponse> {
		try {
			return await this.api.get(`reflections/${id}?system=${Systems.Paidia}&category=${ReflectionTypes.Daily}`);
		} catch (error) {
			return null;
		}
	}

	async getPaidiaPlanningReflection(id: number): Promise<PaidiaPlanningResponse> {
		try {
			return await this.api.get(`reflections/${id}?system=${Systems.Paidia}&category=${ReflectionTypes.Planning}`);
		} catch (error) {
			return null;
		}
	}

	async getPaidiaMonitoringReflection(id: number): Promise<PaidiaMonitoringResponse> {
		try {
			return await this.api.get(`reflections/${id}?system=${Systems.Paidia}&category=${ReflectionTypes.Monitoring}`);
		} catch (error) {
			return null;
		}
	}

	async getPaidiaEvaluatingReflection(id: number): Promise<PaidiaEvaluatingResponse> {
		try {
			return await this.api.get(`reflections/${id}?system=${Systems.Paidia}&category=${ReflectionTypes.Evaluating}`);
		} catch (error) {
			return null;
		}
	}

	async getPaidiaPublicReflections(id: number): Promise<PaidiaLearningExperience[]> {
		try {
			return await this.api.get(`reflections/public?system=${Systems.Paidia}&subjectId=${id}`);
		} catch (error) {
			return null;
		}
	}
}