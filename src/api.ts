import { autoinject } from 'aurelia-framework';
import { HttpClient } from 'aurelia-fetch-client';
import { log } from 'utils/log';
import { AureliaConfiguration } from 'aurelia-configuration';
import environment from 'environment';
import { DateHelper } from 'utils/dateHelper';

@autoinject
export class ApiWrapper {
	constructor(public client: HttpClient, private aureliaConfig: AureliaConfiguration) {
		client.configure(config => {
			config
			.withBaseUrl(environment.api.baseUrl)
			.withDefaults({
				credentials: "include",
				headers: {
					ContentType: "application/json",
					Accept: '*/*',
					Host: "http://localhost:3000"
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
		let a;
		if (typeof value === 'string') {
			a = /\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}/.exec(value);
			if (a) {
				return DateHelper.DateFromString(a[0], "yyyy-LL-dd HH:mm:ss");
			}
		}
		return value;
	}
}