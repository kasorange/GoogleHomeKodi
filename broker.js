import Helper from './helpers.js';
import path from 'path';
import fs from 'fs';
import accents from 'remove-accents';

let lastUsedLanguage = ``;
let localizedPhrases = null;

const testRegexNamedGroupesFeature = () => {

    let match = false;

    try {
        match = `named group test`.match(`(?<group>test)`);
    } catch (error) {
        match = false;
    }

    if (!match) {
        throw new Error(`regex named groups test failed. You need nodejs version 10 or higher for the broker to work!`);
    }
};

const loadLanguageFile = async (language) => {

    try {
        let configDirectory = '/config';

        try {
            let configFile = process.env.GOOGLE_HOME_KODI_CONFIG || './kodi-hosts.config.js';

            configDirectory = path.dirname(fs.realpathSync(configFile));
            let lang = (await import(`${configDirectory}/${language}.json`, { assert: { type: 'json' } })).default;
            console.log(`Found customized language file for '${language}'.`);
            return lang;
        } catch (error) {
            // NOOP
        }

        let lang = (await import(`${configDirectory}/${language}.json`, { assert: { type: 'json' } })).default;
        console.log(`Found customized language file for '${language}'`);
        return lang;

    } catch (error) {
        console.log(`No customized language file found for '${language}', loading default file.`);
        return (await import(`./broker/${language}.json`, { assert: { type: 'json' } })).default;
    }
};

const matchPhraseToEndpoint = (request) => {

    testRegexNamedGroupesFeature();

    if (request.query.phrase === undefined) {
        throw new Error(`Missing mandatory query parameter 'phrase'`);
    }

    let phrase = request.query.phrase.toLowerCase().trim();
    // Replace multiple space with single space.
    phrase = phrase.replace(/\s\s+/g, ' ');

    if (request.config?.brokerAccentInsensitiveMatch) {
        phrase = accents.remove(phrase);
    }

    let language = request.query.lang || `en`;

    if (request.config?.brokerLanguageCacheEnable === false || lastUsedLanguage !== language) {
        // reload lang file if caching is disabled or language has changed
        localizedPhrases = loadLanguageFile(language);
    }

    lastUsedLanguage = language;

    console.log(`Broker processing phrase: '${phrase}' (${language})`);

    for (let key in localizedPhrases) {

        let localizedPhrase = localizedPhrases[key];

        if (request.config?.brokerAccentInsensitiveMatch) {
            localizedPhrase = accents.remove(localizedPhrase);
        }

        let match = phrase.match(`^${localizedPhrase}`);

        if (match) {

            // copy named groups to request.query
            for (let g in match.groups) {
                if (match.groups[g]) {
                    request.query[g] = match.groups[g].trim();
                }
            }

            console.log(`redirecting request to: '${key}'`);
            return key;
        }
    }
    throw new Error(`Broker unknown phrase: '${phrase}' (${language})`);
};

export { matchPhraseToEndpoint, processRequest };
