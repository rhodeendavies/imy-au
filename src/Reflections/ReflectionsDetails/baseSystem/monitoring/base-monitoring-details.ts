import { autoinject } from "aurelia-framework";
import { BaseSystemMonitoring } from "models/reflections";
import { BaseSystem } from "../base-system";

@autoinject
export class BaseMonitoringDetails {
	monitoringReflection: BaseSystemMonitoring;

	constructor(private localParent: BaseSystem) {}

	attached() {
		this.monitoringReflection = this.localParent.reflection.monitoringReflection;
	}
}