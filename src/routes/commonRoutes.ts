import { RouteConfig } from 'aurelia-router';
import { Routes } from 'utils/constants';
import { RouterSettings } from './routeManager';

export class CommonRoutes {
	constructor() { }

	static getRoutes(): RouteConfig[] {
		return [{
			route: ['', 'login'],
			name: Routes.Login,
			moduleId: 'Login/login',
			title: 'Login',
			settings: {
				roles: [""],
				navbar: false,
				authenticated: false
			} as RouterSettings
		}, {
			route: ['register'],
			name: Routes.Register,
			moduleId: 'Register/register',
			title: 'Register',
			settings: {
				roles: [""],
				navbar: false,
				authenticated: false
			} as RouterSettings
		},  {
			route: ['reset_password/:resetToken'],
			name: Routes.Login,
			moduleId: 'PasswordReset/password-reset',
			title: 'Reset Password',
			settings: {
				roles: [""],
				navbar: false,
				authenticated: false
			} as RouterSettings
		}, {
			route: ['not-found'],
			name: Routes.Error,
			moduleId: 'ErrorPage/error-page',
			title: 'Page Not Found',
			settings: {
				roles: [""],
				navbar: false,
				authenticated: false
			} as RouterSettings
		}]
	}
}