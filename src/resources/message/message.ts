import { autoinject, bindable, computedFrom } from "aurelia-framework";

@autoinject
export class Message {
	@bindable type: MessageTypes = MessageTypes.Error;

	@computedFrom("type")
	get Icon(): string {
		switch (this.type) {
			case MessageTypes.Error:
				return "fas fa-times";
			case MessageTypes.Warning:
				return "fas fa-exclamation-triangle";
			case MessageTypes.Success:
				return "fas fa-check";
			case MessageTypes.Info:
				return "fas fa-info";
			default:
				break;
		}
	}
}

enum MessageTypes {
	Error = "error",
	Warning = "warning",
	Success = "success",
	Info = "info"
}