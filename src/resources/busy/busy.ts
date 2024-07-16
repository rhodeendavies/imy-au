export class Busy {
	active: boolean = false;

	on() {
		this.active = true;
	}

	off() {
		this.active = false;
	}
}