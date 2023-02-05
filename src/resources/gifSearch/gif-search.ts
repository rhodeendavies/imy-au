import { autoinject, bindable, bindingMode } from "aurelia-framework";
import { GiphyApi } from "giphyApi";
import { GiphyImages, GiphySearchResult } from "models/apiResponse";
import { Busy } from "resources/busy/busy";
import { log } from "utils/log";

@autoinject
export class GifSearch {

	@bindable({ defaultBindingMode: bindingMode.twoWay }) gif: string;
	search: string;
	offset: number;
	busy: Busy = new Busy();
	results: GiphyImages[];
	totalResults: number;
	pickerOpen: boolean = false;

	constructor(private giphyApi: GiphyApi) { }

	async searchGiphy() {
		try {
			this.busy.on();
			const result: GiphySearchResult = await this.giphyApi.search(this.search);
			this.results = result.data.map(x => x.images);
			this.offset = result.pagination.count + result.pagination.offset;
			this.totalResults = result.pagination.total_count;
		} catch (error) {
			log.error(error);
		} finally {
			this.busy.off();
		}
	}

	async loadMore() {
		try {
			this.busy.on();
			const result: GiphySearchResult = await this.giphyApi.search(this.search, this.offset);
			this.results.concat(result.data.map(x => x.images));
			this.offset = result.pagination.count + result.pagination.offset;
			this.totalResults = result.pagination.total_count;
		} catch (error) {
			log.error(error);
		} finally {
			this.busy.off();
		}
	}

	togglePicker() {
		this.pickerOpen = !this.pickerOpen;
	}

	selectGif(result: GiphyImages) {
		this.gif = result.original.url;
		this.togglePicker();
	}
}