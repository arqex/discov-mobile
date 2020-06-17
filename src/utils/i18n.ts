import { I18nManager } from "react-native";
import * as RNLocalize from "react-native-localize";
import i18n from "i18n-js";

const translationGetters = {
	// lazy requires (metro bundler does not support symlinks)
	ca: () => require("../../lang/ca.json"),
	en: () => require("../../lang/en.json"),
	es: () => require("../../lang/es.json"),
};

global.__ = function( key, config ){
	return i18n.t(key, config);
}

function setI18nConfig() {
	// fallback if no available language fits

	const { languageTag, isRTL } =
		RNLocalize.findBestAvailableLanguage(Object.keys(translationGetters)) ||
		{ languageTag: "en", isRTL: false }
	;

	// update layout direction
	I18nManager.forceRTL(isRTL);

	// set i18n-js config
	i18n.translations = { [languageTag]: translationGetters[languageTag]() };
	i18n.locale = languageTag;
};
setI18nConfig();