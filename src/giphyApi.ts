import { autoinject } from 'aurelia-framework';
import { HttpClient } from 'aurelia-fetch-client';
import { log } from 'utils/log';
import environment from 'environment';
import { GiphySearchResult } from 'models/apiResponse';

@autoinject
export class GiphyApi {
	private client: HttpClient;
	constructor() {
		this.client = new HttpClient();
		this.client.configure(config => {
			config
				.withBaseUrl(environment.api.giphyUrl)
				.withDefaults({
					headers: {
						Accept: '*/*',
						Host: environment.api.giphyUrl
					}
				})
				.rejectErrorResponses();
		});
	}

	async search(searchString: string, offset: number = 0): Promise<GiphySearchResult> {
		try {
			const url = `/search?api_key=${environment.api.giphyApiKey}
				&q=${searchString}&limit=${environment.api.giphylimit}&offset=${offset}
				&rating=${environment.api.giphyRating}&lang=en`;

			const response = await this.client.fetch(url);
			if (response == null || !response.ok) {
				throw new Error("Request did not indicate success");
			}
			const text = await response.text();
			// log.debug("json", text);
			return JSON.parse(text);
		} catch (error) {
			log.error(`[ApiWrapper] An error ocurred while searching giphy`, error);
			throw error;
		}
	}
}
