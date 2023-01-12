import { DateTime } from "luxon";
import { log } from "./log";

export class DateHelper {

	static Format: string = "yyyy-LL-dd";

	static DateFromString(date: string, format: string = this.Format): Date {
		return DateTime.fromFormat(date, format).toJSDate();
	}

	static DateFromISOString(date: string): Date {
		return DateTime.fromISO(date).toJSDate();
	}
	
	static DateTimeFromString(date: string, format: string = this.Format): DateTime {
		return DateTime.fromFormat(date, format);
	}
}