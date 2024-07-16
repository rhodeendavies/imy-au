import 'bootstrap';
import { Aurelia, LogManager } from 'aurelia-framework';
import environment from './environment';
import { ApiWrapper } from 'api';
import { ApplicationState } from 'applicationState';
import { GiphyApi } from 'giphyApi';

export function configure(aurelia: Aurelia): void {
	aurelia.use
		.standardConfiguration()
		.feature('resources')
		.plugin('emoji-picker-element')
		.singleton(ApplicationState)
		.singleton(ApiWrapper)
		.singleton(GiphyApi);

	aurelia.use.developmentLogging(environment.debug ? 'debug' : 'warn');

	if (environment.testing) {
		aurelia.use.plugin('aurelia-testing');
	}

	LogManager.addAppender(new ServerLogAppender(new ApiWrapper()));
	LogManager.setLevel(LogManager.logLevel.debug);

	//Uncomment the line below to enable animation.
	// aurelia.use.plugin('aurelia-animator-css');
	//if the css animator is enabled, add swap-order="after" to all router-view elements

	//Anyone wanting to use HTMLImports to load views, will need to install the following plugin.
	// aurelia.use.plugin('aurelia-html-import-template-loader');

	aurelia.start().then(() => aurelia.setRoot());
}

export class ServerLogAppender {
	constructor(private api: ApiWrapper) { }

	debug(logger, message, ...rest) {
	}
	info(logger, message, ...rest) {
	}
	warn(logger, message, ...rest) {
	}

	error(logger, message, ...rest) {
		this.sendToServer(message, ...rest);
	}

	sendToServer(message, ...rest) {
		this.api.logError("999", `[JS] ${message}`, rest);
	}
}