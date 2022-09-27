import { Roles } from './../utils/constants';
export class RouteRoleVisibility {
	showAdmin: boolean = false;
	showStudent: boolean = false;

	constructor(routeGroup: Roles) {
		this.init(routeGroup);
	}

	init(routeGroup: Roles) {
		this.showAdmin = false;
		this.showStudent = false;

		switch (routeGroup) {
			case Roles.Admin:
				this.showAdmin = true;
				break;
			case Roles.Student:
				this.showStudent = true;
				break;
			case Roles.Common:
				this.showAdmin = true;
				this.showStudent = true;
				break;
		}
	}
}