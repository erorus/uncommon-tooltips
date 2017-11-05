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
};

var apiCache = {};

exports.HasKey = function() {
    return key != '';
};

exports.SetKey = function(k) {
    key = k;
};

exports.GetItem = function(locale, id, params) {
    var url = '/wow/item/' + parseInt(id,10);
    for (var k in params) {
        if (!params.hasOwnProperty(k)) {
            continue;
        }
        url += '&' + encodeURIComponent(k) + '=' + encodeURIComponent(params[k]);
    }
    url = url.replace(/&/, '?'); // replace first &

    return APICall(locale, url);
};

exports.GetSpecies = function(locale, id) {
    return APICall(locale, '/wow/pet/species/' + parseInt(id, 10));
};

exports.GetAchievement = function(locale, id) {
    return APICall(locale, '/wow/achievement/' + parseInt(id, 10));
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

    return fetch(fullUrl, {
        credentials: 'omit',
        cache: 'force-cache',
        mode: 'cors',
    }).then(function(response){
        return apiCache[fullUrl] = response.json();
    });
}