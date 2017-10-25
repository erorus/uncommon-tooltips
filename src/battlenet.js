var key = '';

const localeToDomain = {
    'en_US': 'us',
    'de_DE': 'eu',
    'es_ES': 'eu',
    'fr_FR': 'eu',
    'it_IT': 'eu',
    'pt_BR': 'us',
    'ru_RU': 'eu',
    'ko_KR': 'kr',
    'zh_CN': 'tw',
};

var apiCache = {};

exports.SetKey = function(k) {
    key = k;
};

exports.GetItem = function(locale, id) {
    return APICall(locale, '/wow/item/' + id);
};


function APICall(locale, urlFragment) {
    if (!localeToDomain.hasOwnProperty(locale)) {
        locale = 'en_US';
    }
    var domain = localeToDomain[locale];

    var fullUrl = 'https://' + domain + '.api.battle.net'
        + urlFragment
        + (urlFragment.indexOf('?') >= 0 ? '&' : '?')
        + 'locale=' + locale
        + '&apikey=' + key;

    if (apiCache.hasOwnProperty(fullUrl)) {
        return apiCache[fullUrl];
    }

    return fetch(fullUrl).then(function(response){
        return apiCache[fullUrl] = response.json();
    });
}