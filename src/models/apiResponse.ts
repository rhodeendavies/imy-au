export class ApiResponse {
	result: boolean;
	message: string;

	constructor(_result: boolean, _message: string) {
		this.result = _result;
		this.message = _message;
	}
}