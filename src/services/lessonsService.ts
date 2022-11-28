import { ApiWrapper } from "api";
import { autoinject } from "aurelia-framework";
import { Course } from "models/course";
import { log } from "utils/log";

@autoinject
export class LessonsService {

	constructor(private api: ApiWrapper) { }
}