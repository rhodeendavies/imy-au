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
	pickerId: string;

	constructor(private giphyApi: GiphyApi, private ea: EventAggregator) {
		this.id = ComponentHelper.CreateId("gifSearch");
		this.pickerId = ComponentHelper.CreateId("gifSearchBox");
	}

	attached() {
		this.clickSub = this.ea.subscribe(Events.PickerClicked, (clickedId: string) => this.togglePicker(clickedId));
	}

	detached() {
		this.clickSub.dispose();
	}

	async searchGiphy() {
		try {
			this.busy.on();
			this.openPicker();
			const result: GiphySearchResult = await this.giphyApi.search(this.search);
			this.results = result.data.map(x => x.images);
			this.offset = result.pagination.count + result.pagination.offset;
			this.totalResults = result.pagination.total_count;
		} catch (error) {
			log.error(error);
		} finally {
			this.busy.off();
			this.positionPicker();
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
			this.positionPicker();
		}
	}

	togglePicker(clickedId: string) {
		if (clickedId == this.id) {
			this.pickerOpen = !this.pickerOpen;
			this.positionPicker();
		} else {
			this.closePicker();
		}
	}

	publishEvent() {
		this.ea.publish(Events.PickerClicked, this.id);
	}

	positionPicker() {
		setTimeout(() => {
			const offset = $(`#${this.id}`).offset();
			const pickerHeight = $(`#${this.pickerId}`).height() + 20;

			let top = offset.top + $(`#${this.id}`).height() - $(window).scrollTop() + 5;
			if (top + pickerHeight > $(window).height()) {
				top = offset.top - $(window).scrollTop() - pickerHeight - 5;
			}

			$(`#${this.pickerId}`).css({
				"top": top,
				"left": offset.left
			});
		}, 500);
	}

	openPicker() {
		if (!this.pickerOpen) {
			this.publishEvent();
			this.positionPicker();
		}
	}

	closePicker() {
		this.pickerOpen = false;
	}

	selectGif(result: GiphyImages) {
		this.gif = result.original.url;
		this.closePicker();
	}

	@computedFrom("gif")
	get ShowChosenGif(): boolean {
		return !ComponentHelper.NullOrEmpty(this.gif);
	}
}