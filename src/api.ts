import { autoinject } from 'aurelia-framework';
import { HttpClient } from 'aurelia-fetch-client';
import { log } from 'utils/log';
import { AureliaConfiguration } from 'aurelia-configuration';

@autoinject
export class ApiWrapper {
	constructor(public client: HttpClient, private aureliaConfig: AureliaConfiguration) {
		client.configure(config => {
			config
			.withBaseUrl(this.aureliaConfig.get("api.baseUrl"))
			.withDefaults({
				headers: {
					ContentType: "application/json",
					Accept: '*/*',
					Host: "http://localhost:3000",
				}
			})
			.rejectErrorResponses();
		});
	}

	async get(url: string): Promise<any> {
		let response: Response;
		try {
			response = await this.client.fetch(this.buildUrl(url));
		} catch (error) {
			log.error(`[ApiWrapper] An error ocurred while doing GET to url '${url}'`, error);
			throw error;
		}

		if (response == null || !response.ok || response.status === 204) {
			throw new Error("Request did not indicate success");
		}

		return response;
	}

	async post(url: string, body: any): Promise<any> {
		let response: Response;
		try {
			log.debug("body", JSON.stringify(body))
			response = await this.client.fetch(this.buildUrl(url), {
				method: "POST",
				body: JSON.stringify(body)
			});
		} catch (error) {
			log.error(`[ApiWrapper] An error ocurred while doing POST to url '${url}'`, error);
			throw error;
		}

		if (response == null || !response.ok || response.status === 204) {
			throw new Error("Request did not indicate success");
		}

		return response;
	}

	buildUrl(apiMethod: string): string {
		return `/api/${apiMethod}`;
	}
}