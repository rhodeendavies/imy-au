export class ComponentHelper {
	static CreateId(component: string): string {
		return `${component}_${Math.random().toString(36).substring(2, 5)}`;
	}

	static Sleep(ms: number): Promise<void> {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

	static NullOrEmpty(value: string): boolean {
		return value == null || value == "";
	}

	static ListNullOrEmpty(value: any[]): boolean {
		return value == null || value.length == 0;
	}

	static LoremIpsum(): string {
		return "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam fringilla sem dolor, et varius lorem egestas quis. Aenean auctor quam quam, ac porta leo suscipit ac. Donec malesuada dignissim feugiat. Aenean lobortis ex eu ante mollis dictum. Fusce dictum dignissim tristique. Vestibulum blandit rutrum elit vel bibendum. Aliquam vestibulum diam sit amet laoreet molestie. Maecenas et commodo dui, nec tempor libero. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; In varius turpis at tortor ultrices, et porta erat blandit. Vestibulum aliquet nibh nisi, nec accumsan sapien efficitur ut. Mauris tristique nec eros at semper. Ut eget dui diam. ";
	}

	static DonecInterdum(): string {
		return "Donec interdum ligula a enim dictum, id vulputate ex cursus. Sed vel lacinia nunc. Integer varius elit et nulla tempor, molestie feugiat neque malesuada. Aenean semper commodo aliquam. Praesent vel arcu maximus, ornare risus nec, tempus nulla. Quisque turpis elit, convallis sed neque eget, tempus dapibus urna. Proin viverra finibus magna, at mattis augue pretium porta. Donec tincidunt libero non vestibulum vestibulum. Pellentesque quis fringilla ante. Donec vestibulum feugiat rhoncus. Etiam elementum enim risus. ";
	}
}