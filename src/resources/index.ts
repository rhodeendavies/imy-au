import { FrameworkConfiguration } from 'aurelia-framework';

export function configure(config: FrameworkConfiguration): void {
	config.globalResources([
		'./accordion/accordion',
		'./checkbox/checkbox',
		'./iconButton/icon-button',
		'./inputBox/input-box',
		'./inputList/input-list',
		'./popup/popup',
		'./radioButton/radio-button',
	]);
}
