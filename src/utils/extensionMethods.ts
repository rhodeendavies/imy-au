
interface String {
	isNullOrEmpty(): boolean;
}

String.prototype.isNullOrEmpty = function (): boolean {
	return this == null || this == "";
}