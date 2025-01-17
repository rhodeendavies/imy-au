import { Colour } from "models/prompts";

export class Events {
	static readonly AccordionToggle: string = "AccordionToggle";
	static readonly Login: string = "Login";
	static readonly Logout: string = "Logout";
	static readonly LessonRatingTriggered: string = "LessonRatingTriggered";
	static readonly LessonCompleted: string = "LessonCompleted";
	static readonly DailyTriggered: string = "DailyTriggered";
	static readonly PlanningTriggered: string = "PlanningTriggered";
	static readonly MonitoringTriggered: string = "MonitoringTriggered";
	static readonly EvaluationTriggered: string = "EvaluationTriggered";
	static readonly RefreshApp: string = "RefreshApp";
	static readonly PickerClicked: string = "PickerClicked";
	static readonly Scrolled: string = "Scrolled";
	static readonly ReflectionDetailsChanged: string = "ReflectionDetailsChanged";
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

export class AttributionLinks {
	static readonly onlineEducation: string = "https://www.vecteezy.com/free-vector/online-education";
	static readonly human: string = "https://www.vecteezy.com/free-vector/human";
}

export class StatusCodes {
	static readonly Unauthorized: number = 401;
	static readonly BadRequest: number = 400;
	static readonly NotFound: number = 404;
	static readonly Forbidden: number = 403;
	static readonly InternalServerError: number = 500;
}