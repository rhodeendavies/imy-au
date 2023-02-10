import { LogManager, autoinject } from 'aurelia-framework';
import { HttpClient } from 'aurelia-fetch-client';
import environment from 'environment';
import { DateHelper } from 'utils/dateHelper';

const apiLog = LogManager.getLogger('API');

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

	async get(url: string, logError: boolean = true): Promise<any> {
		try {
			const response = await this.client.fetch(this.buildUrl(url));
			if (response == null || !response.ok) {
				throw new Error("Request did not indicate success");
			}
			const text = await response.text();
			// apiLog.debug("json", text);
			return JSON.parse(text, this.dateTimeReceiver);
		} catch (error) {
			if (logError) {
				apiLog.error(`[ApiWrapper] An error ocurred while doing GET to url '${url}'`, error);
				if (error instanceof Response) {
					this.logError(`${error.status}`, error.statusText, error);
				} else {
					this.logError("000", "Unknown error", error);
				}
			} else {
				console.log("error", error);
			}
			throw error;
		}
	}

	async post(url: string, body: any, parseResponse: boolean = true, logError: boolean = true): Promise<any> {
		try {
			const response = await this.client.fetch(this.buildUrl(url), {
				method: "POST",
				body: JSON.stringify(body)
			});
			if (response == null || !response.ok) {
				throw new Error("Request did not indicate success");
			}
			// apiLog.debug("json", text);\
			if (parseResponse) {
				const text = await response.text();
				return JSON.parse(text, this.dateTimeReceiver);
			} else {
				return response;
			}
		} catch (error) {
			if (logError) {
				apiLog.error(`[ApiWrapper] An error ocurred while doing POST to url '${url}'`, error);
				if (error instanceof Response) {
					this.logError(`${error.status}`, error.statusText, error);
				} else {
					this.logError("000", "Unknown error", error);
				}
			} else {
				console.log("error", error);
			}
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
			// apiLog.debug("json", text);
			if (parseResponse) {
				const text = await response.text();
				return JSON.parse(text, this.dateTimeReceiver);
			} else {
				return response;
			}
		} catch (error) {
			if (error instanceof Response) {
				apiLog.error(`[ApiWrapper] An error ocurred while doing POST to url '${url}'`, error);
				this.logError(`${error.status}`, error.statusText, error);
			} else {
				this.logError("000", "Unknown error", error);
			}
			throw error;
		}
	}

	private buildUrl(apiMethod: string): string {
		return `${environment.api.apiUrl}${apiMethod}`;
	}

	private dateTimeReceiver = function(key, value) {
		if (typeof value === 'string') {
			const a = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/.exec(value);
			const b = /\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2} UTC/.exec(value);
			const c = /\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2} \+0200/.exec(value);
			if (a) {
				return DateHelper.DateFromISOString(a[0]);
			} else if (b) {
				return DateHelper.DateFromString(b[0], "yyyy-LL-dd' 'HH:mm:ss' UTC'");
			} else if (c) {
				return DateHelper.DateFromString(c[0], "yyyy-LL-dd' 'HH:mm:ss' +0200'");
			}
		}
		return value;
	}

	async logError(statusCode: string, message: string, trace: any): Promise<void> {
		try {
			const authenticated = await this.get("users/current", false) != null;
			if (!authenticated) return;
			await this.post("errors/client", {
				statusCode: statusCode,
				message: message,
				trace: JSON.stringify(trace)
			}, false, false);
		} catch (error) {
			apiLog.warn(`[ApiWrapper] An error ocurred while logging an error'`, error);
		}
	}
}