import { ApiWrapper } from "api";
import { autoinject } from "aurelia-framework";
import { log } from "utils/log";

@autoinject
export class ErrorService {

	constructor(private api: ApiWrapper) {}

	async logError(statusCode: string, message: string, trace: any) {
		try {
			await this.api.logError(statusCode, message, trace);
		} catch (error) {
			log.error(error);
		}
	}
}