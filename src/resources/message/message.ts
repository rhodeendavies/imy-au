import { autoinject, bindable, computedFrom } from "aurelia-framework";

@autoinject
export class Message {
	@bindable type: MessageTypes = MessageTypes.Error;

	@computedFrom("type")
	get Icon(): string {
		switch (this.type) {
			case MessageTypes.Error:
				return "error";
			case MessageTypes.Warning:
				return "warning";
			case MessageTypes.Success:
				return "check";
			case MessageTypes.Info:
				return "info";
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