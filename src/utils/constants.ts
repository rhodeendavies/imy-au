import { Colour } from "models/prompts";

export class Events {
	static readonly AccordionToggle: string = "AccordionToggle";
	static readonly Login: string = "Login";
	static readonly Logout: string = "Logout";
	static readonly DailyTriggered: string = "DailyTriggered";
	static readonly RefreshApp: string = "RefreshApp";
	static readonly PickerClicked: string = "PickerClicked";
	static readonly Scrolled: string = "Scrolled";
}

export class Routes {
	static readonly AdminDash: string = "admin-dashboard";
	static readonly Login: string = "login";
	static readonly Register: string = "register";
	static readonly Error: string = "error";
	static readonly Dashboard: string = "home";
	static readonly Reflections: string = "reflections";
	static readonly CourseContent: string = "content";
}

export class Colours {
	static readonly Orange: Colour = {
		red: 242,
		green: 100,
		blue: 48
	}
	static readonly OrangeHex: string = "#F26430";
	static readonly LightGreyHex: string = "#E2E2E2";
}