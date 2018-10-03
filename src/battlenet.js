var token = '';
var tokenFetchTries = 0;

const TOKEN_URL = 'https://js.uncommon-tooltips.com/token.txt';

const localeToDomain = {
    'en_US': 'us',
    'de_DE': 'eu',
    'es_ES': 'eu',
    'fr_FR': 'eu',
    'it_IT': 'eu',
    'pt_BR': 'us',
    'ru_RU': 'eu',
    'ko_KR': 'kr',
};

var apiCache = {};

module.exports = function(patch) {
    var exp = {};

    exp.GetItem = function(locale, id, params) {
        var url = '/wow/item/' + parseInt(id,10);
        for (var k in params) {
            if (!params.hasOwnProperty(k)) {
                continue;
            }
            url += '&' + encodeURIComponent(k) + '=' + encodeURIComponent(params[k]);
        }
        url = url.replace(/&/, '?'); // replace first &

        return APICall(locale, url, patch);
    };

    exp.GetSpecies = function(locale, id) {
        return APICall(locale, '/wow/pet/species/' + parseInt(id, 10), patch);
    };

    exp.GetAchievement = function(locale, id) {
        return APICall(locale, '/wow/achievement/' + parseInt(id, 10), patch);
    };

    FetchToken();

    return exp;
};

function APICall(locale, urlFragment, patch) {
    if (!localeToDomain.hasOwnProperty(locale)) {
        locale = 'en_US';
    }
    var domain = localeToDomain[locale];

    var fullUrl = 'https://' + domain + '.api.blizzard.com'
        + urlFragment
        + (urlFragment.indexOf('?') >= 0 ? '&' : '?')
        + 'locale=' + locale
        + '&access_token=' + token;

    if (patch) {
        fullUrl += '&cachepatch=' + encodeURIComponent(patch);
    }

    if (apiCache.hasOwnProperty(fullUrl)) {
        return apiCache[fullUrl];
    }

    return fetch(fullUrl, {
        credentials: 'omit',
        cache: 'force-cache',
        mode: 'cors',
    }).then(function(response){
        if (!response.ok) {
            console.warn('Uncommon Tooltips: Could not fetch ' + response.url + ' - error ' + response.status + ' ' + response.statusText);
        }
        return apiCache[fullUrl] = response.json();
    }).catch(function(response) {
        console.warn('Uncommon Tooltips: could not fetch ' + fullUrl, response);
        return {};
    });
}

function FetchToken() {
    fetch(TOKEN_URL, {
        credentials: 'omit',
        cache: 'force-cache',
        mode: 'cors',
    }).then(function(response){
        if (!response.ok) {
            console.warn('Uncommon Tooltips: could not fetch access token - error ' + response.status + ' ' + response.statusText);
            if (tokenFetchTries < 10) {
                window.setTimeout(FetchToken, 3000 + (tokenFetchTries++ * 10 * 1000));
            }
        } else {
            response.text().then(function(text) {
                token = text.trim();
            });
            tokenFetchTries = 0;
            window.setTimeout(FetchToken, 6 * 60 * 60 * 1000);
        }
    }).catch(function(response) {
        console.warn('Uncommon Tooltips: could not fetch access token', response);
    });
}
