import { autoinject } from "aurelia-framework";
import { BaseDaily } from "../base-daily";

@autoinject
export class BaseLearningStrategies {
	
	constructor(private localParent: BaseDaily) {}
	
}