import { ApiWrapper } from "api";
import { autoinject } from "aurelia-framework";
import { ReflectionApiModel } from "models/reflectionsApiModels";
import { BaseDailyResponse, BaseEvaluatingResponse, BaseMonitoringResponse, BasePlanningResponse, CreateReflectionResponse, LudusDailyResponse, LudusEvaluatingResponse, LudusMonitoringResponse, LudusPlanningResponse } from "models/reflectionsResponses";
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

	async getBasePublicReflections(id: number): Promise<BaseEvaluatingResponse[]> {
		try {
			return await this.api.get(`reflections/public?system=${Systems.Base}&subjectId=${id}`);
		} catch (error) {
			log.error(error);
			return null;
		}
	}

	async createReflection(system: Systems, category: ReflectionTypes, id: number): Promise<number> {
		try {
			const response: CreateReflectionResponse = await this.api.post(`reflections?system=${system}&category=${category}&subjectId=${id}`, null);
			return response.id;
		} catch (error) {
			log.error(error);
			return null;
		}
	}

	async submitReflection(system: Systems, category: ReflectionTypes, id: number, model: ReflectionApiModel): Promise<boolean> {
		try {
			return await this.api.patch(`reflections/${id}?system=${system}&category=${category}`, model) != null;
		} catch (error) {
			log.error(error);
			return false;
		}
	}

	// ========================== BASE ======================================
	async getBaseDailyReflection(id: number): Promise<BaseDailyResponse> {
		try {
			return await this.api.get(`reflections/${id}?system=${Systems.Base}&category=${ReflectionTypes.Daily}`);
		} catch (error) {
			log.error(error);
			return null;
		}
	}

	async getBasePlanningReflection(id: number): Promise<BasePlanningResponse> {
		try {
			return await this.api.get(`reflections/${id}?system=${Systems.Base}&category=${ReflectionTypes.Planning}`);
		} catch (error) {
			log.error(error);
			return null;
		}
	}

	async getBaseMonitoringReflection(id: number): Promise<BaseMonitoringResponse> {
		try {
			return await this.api.get(`reflections/${id}?system=${Systems.Base}&category=${ReflectionTypes.Monitoring}`);
		} catch (error) {
			log.error(error);
			return null;
		}
	}

	async getBaseEvaluatingReflection(id: number): Promise<BaseEvaluatingResponse> {
		try {
			return await this.api.get(`reflections/${id}?system=${Systems.Base}&category=${ReflectionTypes.Evaluating}`);
		} catch (error) {
			log.error(error);
			return null;
		}
	}
	// =======================================================================

	// ========================== LUDUS ======================================
	async getLudusDailyReflection(id: number): Promise<LudusDailyResponse> {
		try {
			return await this.api.get(`reflections/${id}?system=${Systems.Ludus}&category=${ReflectionTypes.Daily}`);
		} catch (error) {
			log.error(error);
			return null;
		}
	}

	async getLudusPlanningReflection(id: number): Promise<LudusPlanningResponse> {
		try {
			return await this.api.get(`reflections/${id}?system=${Systems.Ludus}&category=${ReflectionTypes.Planning}`);
		} catch (error) {
			log.error(error);
			return null;
		}
	}

	async getLudusMonitoringReflection(id: number): Promise<LudusMonitoringResponse> {
		try {
			return await this.api.get(`reflections/${id}?system=${Systems.Ludus}&category=${ReflectionTypes.Monitoring}`);
		} catch (error) {
			log.error(error);
			return null;
		}
	}

	async getLudusEvaluatingReflection(id: number): Promise<LudusEvaluatingResponse> {
		try {
			return await this.api.get(`reflections/${id}?system=${Systems.Ludus}&category=${ReflectionTypes.Evaluating}`);
		} catch (error) {
			log.error(error);
			return null;
		}
	}
}