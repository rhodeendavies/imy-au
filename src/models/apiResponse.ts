export class ApiResponse {
	result: boolean;
	message: string;

	constructor(_result: boolean, _message: string) {
		this.result = _result;
		this.message = _message;
	}
}

export class GiphySearchResult {
	data: GiphySearchData[];
	pagination: GiphyPagination;
	meta: GiphyMeta;
}

export class GiphySearchData {
	type: string;
	id: string;
	url: string;
	slug: string;
	bitly_gif_url: string;
	bitly_url: string;
	embed_url: string;
	username: string;
	source: string;
	title: string;
	rating: string;
	content_url: string;
	source_tld: string;
	source_post_url: string;
	is_sticker: number;
	import_datetime: Date;
	trending_datetime: Date;
	images: GiphyImages;
	user: User;
	analytics_response_payload: string;
	analytics: GiphyAnalytics;
}

export class GiphyImages {
	original: GiphyImage;
	downsized: GiphyImage;
	downsized_large: GiphyImage;
	downsized_medium: GiphyImage;
	downsized_small: GiphyImage;
	downsized_still: GiphyImage;
	fixed_height: GiphyImage;
	fixed_height_downsampled: GiphyImage;
	fixed_height_small: GiphyImage;
	fixed_height_small_still: GiphyImage;
	fixed_height_still: GiphyImage;
	fixed_width: GiphyImage;
	fixed_width_downsampled: GiphyImage;
	fixed_width_small: GiphyImage;
	fixed_width_small_still: GiphyImage;
	fixed_width_still: GiphyImage;
	looping: GiphyImage;
	original_still: GiphyImage;
	original_mp4: GiphyImage;
	preview: GiphyImage;
	preview_gif: GiphyImage;
	preview_webp: GiphyImage;
}

export class GiphyImage {
	height: string;
	width: string;
	size: string;
	url: string;
	mp4_size: string;
	mp4: string;
	webp_size: string;
	webp: string;
	frames: string;
	hash: string;
}

export class User {
	avatar_url: string;
	banner_image: string;
	banner_url: string;
	profile_url: string;
	username: string;
	display_name: string;
	description: string;
	instagram_url: string;
	website_url: string;
	is_verified: string;
}

export class GiphyAnalytics {
	onload: GiphyAnalyticsEvent;
	onclick: GiphyAnalyticsEvent;
	onsent: GiphyAnalyticsEvent;

}

export class GiphyAnalyticsEvent {
	url: string;
}

export class GiphyPagination {
	total_count: number;
	count: number;
	offset: number;
}

export class GiphyMeta {
	status: number;
	msg: string;
	response_id: string;
}