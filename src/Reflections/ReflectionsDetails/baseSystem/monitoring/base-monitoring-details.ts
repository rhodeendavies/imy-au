import { autoinject, computedFrom } from "aurelia-framework";
import { BaseSystemMonitoring } from "models/reflections";
import { BaseSystem } from "../base-system";

@autoinject
export class BaseMonitoringDetails {
	constructor(private localParent: BaseSystem) {}
	
	@computedFrom("localParent.Reflection.id")
	get MonitoringReflection(): BaseSystemMonitoring {
		return this.localParent.Reflection.monitoringReflection;
	}
}