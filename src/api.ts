import { autoinject } from 'aurelia-framework';
import { HttpClient } from 'aurelia-fetch-client';
import { log } from 'utils/log';
import environment from 'environment';
import { DateHelper } from 'utils/dateHelper';

@autoinject
export class ApiWrapper {

	private client: HttpClient;
	constructor() {
		this.client = new HttpClient();
		this.client.configure(config => {
			config
			.withBaseUrl(environment.api.baseUrl)
			.withDefaults({
				credentials: "include",
				mode: "cors",
				headers: {
					ContentType: "application/json",
					Accept: '*/*',
					Host: environment.api.baseUrl
				}
			})
			.rejectErrorResponses();
		});
	}

	async get(url: string): Promise<any> {
		try {
			const response = await this.client.fetch(this.buildUrl(url));
			if (response == null || !response.ok) {
				throw new Error("Request did not indicate success");
			}
			const text = await response.text();
			// log.debug("json", text);
			return JSON.parse(text, this.dateTimeReceiver);
		} catch (error) {
			log.error(`[ApiWrapper] An error ocurred while doing GET to url '${url}'`, error);
			throw error;
		}
	}

	async post(url: string, body: any, parseResponse: boolean = true): Promise<any> {
		try {
			const response = await this.client.fetch(this.buildUrl(url), {
				method: "POST",
				body: JSON.stringify(body)
			});
			if (response == null || !response.ok) {
				throw new Error("Request did not indicate success");
			}
			// log.debug("json", text);\
			if (parseResponse) {
				const text = await response.text();
				return JSON.parse(text, this.dateTimeReceiver);
			} else {
				return response;
			}
		} catch (error) {
			log.error(`[ApiWrapper] An error ocurred while doing POST to url '${url}'`, error);
			throw error;
		}
	}

	async patch(url: string, body: any, parseResponse: boolean = true): Promise<any> {
		try {
			const response = await this.client.fetch(this.buildUrl(url), {
				method: "PATCH",
				body: JSON.stringify(body)
			});
			if (response == null || !response.ok) {
				throw new Error("Request did not indicate success");
			}
			const text = await response.text();
			// log.debug("json", text);
			if (parseResponse) {
				const text = await response.text();
				return JSON.parse(text, this.dateTimeReceiver);
			} else {
				return response;
			}
		} catch (error) {
			log.error(`[ApiWrapper] An error ocurred while doing POST to url '${url}'`, error);
			throw error;
		}
	}

	private buildUrl(apiMethod: string): string {
		return `/api/${apiMethod}`;
	}

	private dateTimeReceiver = function(key, value) {
		if (typeof value === 'string') {
			const a = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/.exec(value);
			const b = /\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2} UTC/.exec(value);
			if (a) {
				return DateHelper.DateFromISOString(a[0]);
			} else if (b) {
				return DateHelper.DateFromString(b[0], "yyyy-LL-dd' 'HH:mm:ss' UTC'");
			}
		}
		return value;
	}
}