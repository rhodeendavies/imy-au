import { autoinject } from "aurelia-framework";
import { ReflectionsDetails } from "../reflections-details";

@autoinject
export class Paidia {


	constructor(private localParent: ReflectionsDetails) {}

}