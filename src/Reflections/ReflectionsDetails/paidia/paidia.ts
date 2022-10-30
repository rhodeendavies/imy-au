import { autoinject, bindable, computedFrom } from "aurelia-framework";
import { ReflectionSections } from "utils/enums";
import { ReflectionsDetails } from "../reflections-details";

@autoinject
export class Paidia {


	constructor(private localParent: ReflectionsDetails) {}

}