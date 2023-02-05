import 'bootstrap';
import { Aurelia } from 'aurelia-framework';
import environment from './environment';
import { ApiWrapper } from 'api';
import { ApplicationState } from 'applicationState';
import { GiphyApi } from 'giphyApi';

export function configure(aurelia: Aurelia): void {
	aurelia.use
		.standardConfiguration()
		.feature('resources')
		.plugin('aurelia-configuration')
		.plugin('emoji-picker-element')
		.singleton(ApplicationState)
		.singleton(ApiWrapper)
		.singleton(GiphyApi);

	aurelia.use.developmentLogging(environment.debug ? 'debug' : 'warn');

	if (environment.testing) {
		aurelia.use.plugin('aurelia-testing');
	}

	//Uncomment the line below to enable animation.
	// aurelia.use.plugin('aurelia-animator-css');
	//if the css animator is enabled, add swap-order="after" to all router-view elements

	//Anyone wanting to use HTMLImports to load views, will need to install the following plugin.
	// aurelia.use.plugin('aurelia-html-import-template-loader');

	aurelia.start().then(() => aurelia.setRoot());
}
