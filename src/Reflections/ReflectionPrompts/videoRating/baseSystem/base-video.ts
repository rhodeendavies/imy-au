import { autoinject } from "aurelia-framework";
import { VideoRating } from "../video-rating";
import { ApplicationState } from "applicationState";
import { RadioOption } from "resources/radioButton/radio-button";

@autoinject
export class BaseVideo {

	ratingSelected: number = null;
	videoRatingOptions: RadioOption[] = [
		{ name: "I understand fully", subText: "3/3", value: 3 },
		{ name: "I understand partially", subText: "2/3", value: 2 },
		{ name: "I mostly don't understand", subText: "1/3", value: 1 },
		{ name: "I don't understand", subText: "0/3", value: 0 }
	];

	constructor(private localParent: VideoRating, private appState: ApplicationState) {}

	attached() {
		this.ratingSelected = null;
	}

	submitRating() {
		this.localParent.submitRating({
			rating: this.ratingSelected
		});
	}
}