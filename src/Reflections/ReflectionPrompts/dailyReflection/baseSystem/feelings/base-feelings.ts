import { autoinject } from "aurelia-framework";
import { BaseDaily } from "../base-daily";

@autoinject
export class BaseFeelings {

	constructor(private localParent: BaseDaily) {}
}