var locales = {
    'en_US': require('./locales/en_US.js'),
};

var currentLocale = 'en_US';

exports.dictionary = function() {
    return locales[currentLocale];
};

exports.setLocale = function(val) {
    if (locales.hasOwnProperty(val)) {
        currentLocale = val;
    }
    return currentLocale;
};

exports.format = function(pattern) {
    var pos = 1;
    var args = arguments;

    var s = pattern.replace(/%(.)/g, function(match, op) {
        var arg = args[pos];
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