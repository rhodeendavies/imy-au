import { FrameworkConfiguration } from 'aurelia-framework';

export function configure(config: FrameworkConfiguration): void {
	config.globalResources([
		'./accordion/accordion',
		'./checkbox/checkbox',
		'./checkMark/check-mark',
		'./iconButton/icon-button',
		'./inputBox/input-box',
		'./inputList/input-list',
		'./loader/loader',
		'./message/message',
		'./modal/modal',
		'./pageLoader/page-loader',
		'./popup/popup',
		'./radioButton/radio-button',
		'./ratingBox/rating-box',
		'./toast/toast',
	]);
}
