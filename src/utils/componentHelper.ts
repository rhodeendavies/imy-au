export class ComponentHelper {
	static CreateId(component: string): string {
		return `${component}_${Math.random().toString(36).substring(2, 5)}`;
	}

	static Sleep(ms: number): Promise<void> {
		return new Promise(resolve => setTimeout(resolve, ms) );
	}

	static NullOrEmpty(value: string): boolean {
		return value == null || value == "";
	}
}