var validLocales = ['en_US', 'de_DE', 'es_ES', 'fr_FR', 'it_IT', 'ko_KR', 'pt_BR', 'ru_RU'];
var locales = {};

var localesPrefix = 'locales/';
const localesVersion = 1;

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
        return locales[loc] = response.json();
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