import { DateTime } from "luxon";

export class DateFormatValueConverter {
	toView(value: Date, format: string = "d LLLL") {
		const date = DateTime.fromJSDate(value);
		return date.toFormat(format);
	}
}