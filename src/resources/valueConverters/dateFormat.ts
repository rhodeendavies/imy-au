import { DateTime, Duration } from "luxon";

export class DateFormatValueConverter {
	toView(value: Date, format: string = "d LLLL") {
		const date = DateTime.fromJSDate(value);
		return date.toFormat(format);
	}
}

export class SecondsValueConverter {
	toView(value: number) {
		const duration = Duration.fromObject({ seconds: value }).shiftTo("minutes", "seconds");
		return duration.toHuman({ unitDisplay: "short", maximumFractionDigits: 0 });
	}
}