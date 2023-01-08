import { EventAggregator } from "aurelia-event-aggregator";
import { autoinject, computedFrom } from "aurelia-framework";
import { Router } from "aurelia-router";
import { ApiResponse } from "models/apiResponse";
import { Course } from "models/course";
import { UserDetails, UserLogin } from "models/userDetails";
import { Busy } from "resources/busy/busy";
import { Events, Routes } from "utils/constants";
import { Roles, Systems } from "utils/enums";
import { log } from "utils/log";
import { CoursesService } from "./coursesService";
import { UsersService } from "./usersService";

@autoinject
export class AuthenticationService {

	busy: Busy = new Busy();
	private user: UserDetails;

	constructor(
		private router: Router,
		private ea: EventAggregator,
		private usersApi: UsersService,
		private courseApi: CoursesService
	) { }

	async login(userLogin: UserLogin): Promise<ApiResponse> {
		try {
			this.busy.on();
			this.user = await this.usersApi.login(userLogin);
			await this.initUser();
			return new ApiResponse(true, "");
		} catch (error) {
			log.error(error);
			return new ApiResponse(false, "An error occurred");
		} finally {
			this.busy.off();
		}
	}

	async initUser() {
		let course: Course = null;
		switch (this.Role) {
			case Roles.Admin:
				this.router.navigate(Routes.AdminDash);
				break;
			case Roles.Student:
				course = await this.courseApi.getCourse(this.user.courseId);
				this.user.course = course.name;
				this.router.navigate(Routes.Dashboard);
				break
			default:
				throw "Invalid login";
		}
		this.ea.publish(Events.Login);
	}

	async logout(): Promise<void> {
		try {
			this.busy.on();
			this.usersApi.logout();
			this.user = null;
			this.ea.publish(Events.Logout);
			this.redirectToLogin();
		} catch (error) {
			log.debug(error);
		} finally {
			this.busy.off();
		}
	}

	async Authenticated(): Promise<boolean> {
		if (this.user == null || this.user == undefined) {
			this.user = await this.usersApi.authenticate();
			if (this.user == null || this.user == undefined) {
				this.redirectToLogin();
				return false;
			}
			await this.initUser();
		}
		return this.user !== null && this.user !== undefined && this.user.activated;
	}

	get System(): Systems {
		return this.user !== null && this.user !== undefined && this.user.currentSystem;
	}

	get Course(): string {
		return this.user !== null && this.user !== undefined && this.user.course;
	}

	get CourseId(): number {
		return this.user !== null && this.user !== undefined && this.user.courseId;
	}

	@computedFrom("busy.Active")
	get Busy(): boolean {
		return this.busy.Active;
	}

	redirectToLogin() {
		this.router.navigateToRoute(Routes.Login);
	}

	get Role(): Roles {
		if (this.user == null || this.user == undefined) {
			this.logout();
			this.redirectToLogin();
			return Roles.Unauthenticated;
		}

		return this.user.role;
	}
}