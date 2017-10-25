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
