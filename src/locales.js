var validLocales = ['en_US', 'de_DE', 'es_ES', 'fr_FR', 'it_IT', 'ko_KR', 'pt_BR', 'ru_RU'];
var locales = {};

var localesPrefix = 'https://js.uncommon-tooltips.com/';
const localesVersion = 4;

exports.getVersions = function() {
    var o = {};
    for (var k in locales) {
        if (!locales.hasOwnProperty(k)) {
            continue;
        }
        o[k] = {
            'patch': locales[k].localeInfo.patch,
            'generated': locales[k].localeInfo.generated,
        }
    }
    return o;
};

exports.getLocalePrefix = function() {
    return localesPrefix;
};

exports.setLocalePrefix = function(val) {
    localesPrefix = val;
};

exports.getLocale = function(val) {
    var loc = val;
    if (validLocales.indexOf(loc) < 0) {
        loc = validLocales[0];
    }
    if (locales.hasOwnProperty(loc)) {
        return locales[loc];
    }

    return fetch(localesPrefix + loc.replace(/_/, '') + '.json?' + localesVersion, {
        credentials: 'omit',
        cache: 'force-cache',
        mode: 'cors',
    }).then(function(response){
        if (!response.ok) {
            return Promise.reject(response.status + ' ' + response.statusText);
        }
        return response.json().then(function(result) {
            return locales[loc] = result;
        }).catch(function(response) {
            return Promise.reject('JSON error: ' + response);
        });
    }).catch(function(response){
        var err = 'Cannot fetch locale ' + loc;
        console.error('Uncommon Tooltips: ' + err, response);
        return Promise.reject(err + ': ' + response);
    });
};

exports.format = function(pattern) {
    var pos = 1;
    var args = arguments;

    var s = pattern.replace(/%(?:(\d+)\$)?(.)/g, function(match, reqPos, op) {
        var arg = args[reqPos ? reqPos : pos];
        if (typeof arg == 'undefined') {
            return match;
        }
        switch (op) {
            case '%':
                return '%';
            case 'c':
                return parseInt(arg, 10) < 0 ? '' : '+';
            case 'd':
                arg = parseInt(arg, 10);
                // no break;
            case 's':
                pos++;
                return arg;
            default:
                return match;
        }
    });

    s = s.replace(/(\d+)(\s*)\|4([^:]*):(?:([^:;]+):)?([^:;]+);/g, function(match, qty, spc, sing, pl1, pl2) {
        var qtyNum = parseInt(qty, 10);

        if (!pl1) {
            // normal singular/plural
            return '' + qty + spc + ((qtyNum == 1) ? sing : pl2);
        }

        // russian rules with different plurals
        var lastDigit = qtyNum % 10;
        if ([11,12,13,14].indexOf(qtyNum) >= 0 || [5,6,7,8,9,0].indexOf(lastDigit) >= 0) {
            return '' + qty + spc + pl2;
        }
        if ([2,3,4].indexOf(lastDigit) >= 0) {
            return '' + qty + spc + pl1;
        }

        return '' + qty + spc + sing;
    });

    return s;
};