import { autoinject } from "aurelia-framework";
import { ReflectionsDetails } from "../reflections-details";

@autoinject
export class Ludus {


	constructor(private localParent: ReflectionsDetails) {}

}