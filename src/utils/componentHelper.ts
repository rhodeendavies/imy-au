export class ComponentHelper {
	static CreateId(component: string): string {
		return `${component}_${Math.random().toString(36).substring(2, 5)}`;
	}
}