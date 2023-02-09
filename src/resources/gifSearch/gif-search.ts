import { EventAggregator, Subscription } from "aurelia-event-aggregator";
import { autoinject, bindable, bindingMode, computedFrom } from "aurelia-framework";
import { GiphyApi } from "giphyApi";
import { GiphyImages, GiphySearchResult } from "models/apiResponse";
import { Busy } from "resources/busy/busy";
import { ComponentHelper } from "utils/componentHelper";
import { Events } from "utils/constants";
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
	clickSub: Subscription;
	id: string;

	constructor(private giphyApi: GiphyApi, private ea: EventAggregator) {
		this.id = ComponentHelper.CreateId("gifSearch");
	}

	attached() {
		this.clickSub = this.ea.subscribe(Events.PickerClicked, (clickedId: string) => {
			if (clickedId == this.id) {
				this.pickerOpen = !this.pickerOpen;
			} else {
				this.pickerOpen = false;
			}
		});
	}

	detached() {
		this.clickSub.dispose();
	}

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
			this.results = this.results.concat(result.data.map(x => x.images));
			this.offset = result.pagination.count + result.pagination.offset;
			this.totalResults = result.pagination.total_count;
		} catch (error) {
			log.error(error);
		} finally {
			this.busy.off();
		}
	}

	togglePicker() {
		this.ea.publish(Events.PickerClicked, this.id);
	}

	selectGif(result: GiphyImages) {
		this.gif = result.original.url;
		this.togglePicker();
	}

	@computedFrom("gif")
	get ShowChosenGif(): boolean {
		return !ComponentHelper.NullOrEmpty(this.gif);
	}
}