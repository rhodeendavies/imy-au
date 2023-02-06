import { autoinject, computedFrom } from "aurelia-framework";
import { PublicReflections } from "../public-reflections";
import { ReflectionsService } from "services/reflectionsService";
import { PaidiaLearningExperience, PublicPaidiaLearningExperience } from "models/reflectionsApiModels";
import { ComponentHelper } from "utils/componentHelper";

@autoinject
export class PaidiaPublic {
	reflections: PublicPaidiaLearningExperience[];

	constructor(private localParent: PublicReflections, private reflectionsApi: ReflectionsService) { }

	attached() {
		this.getPublicReflections();
	}

	async getPublicReflections() {
		const result = await this.reflectionsApi.getPaidiaPublicReflections(this.localParent.SectionId);
		this.reflections = result.map(x => {
			return {
				color: x.color,
				emoji: ComponentHelper.EmojiFromString(x.emoji),
				text: x.text,
				gif: x.gif,
				postPublicly: false,
				hasColour: !ComponentHelper.NullOrEmpty(x.color),
				hasText: !ComponentHelper.NullOrEmpty(x.text),
				hasEmoji: !ComponentHelper.NullOrEmpty(x.emoji),
				hasGif: !ComponentHelper.NullOrEmpty(x.gif),
				backgroundColour: `background-color: ${x.color}`,
				shadowColour: `box-shadow: box-shadow: 0px 3px 6px ${x.color}`
			} 
		})
	}

	@computedFrom("localParent.sectionSelected.id", "reflections.length")
	get Reflections(): PaidiaLearningExperience[] {
		this.getPublicReflections();
		return this.reflections;
	}
}