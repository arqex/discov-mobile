import { I18nManager } from "react-native";
import * as RNLocalize from "react-native-localize";
import i18n from "i18n-js";
import moment from 'moment';

const translationGetters = {
	// lazy requires (metro bundler does not support symlinks)
	ca: () => require("../../lang/ca.json"),
	en: () => require("../../lang/en.json"),
	es: () => require("../../lang/es.json"),
};

const momentLocales = {
	// lazy requires (metro bundler does not support symlinks)
	ca: () => require("moment/locale/ca.js"),
	es: () => require("moment/locale/es.js"),
}

global.__ = function( key, config ){
	return i18n.t(key, config);
}

function setI18nConfig() {
	// fallback if no available language fits
	const { languageTag, isRTL } =
		RNLocalize.findBestAvailableLanguage(Object.keys(translationGetters)) ||
		{ languageTag: "en", isRTL: false }
	;
	
	if( momentLocales[ languageTag ] ){
		momentLocales[languageTag]();
		moment.locale( languageTag );
	}
	console.log( languageTag );

	// update layout direction
	I18nManager.forceRTL(isRTL);

	// set i18n-js config
	i18n.translations = { [languageTag]: translationGetters[languageTag]() };
	i18n.locale = languageTag;
};
setI18nConfig();