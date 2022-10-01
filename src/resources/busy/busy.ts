export class Busy {
	private active: boolean = false;

	on() {
		this.active = true;
	}

	off() {
		this.active = false;
	}

	get Active(): boolean {
		return this.active;
	}
}