const BNet = require('./battlenet');
const Tooltip = require('./tooltip');
const Locales = require('./locales');

const wait = function(ms) { return new Promise(function(resolve) { setTimeout(resolve, ms) })};

const IconPath = 'https://render-us.worldofwarcraft.com/icons/56/';

const domainToLocale = {
    'www': 'en_US',
    'de': 'de_DE',
    'es': 'es_ES',
    'fr': 'fr_FR',
    'it': 'it_IT',
    'pt': 'pt_BR',
    'ru': 'ru_RU',
    'ko': 'ko_KR',
    'cn': 'zh_CN',
};

const acceptableTypes = ['item'];

function paramWalk(str) {
    var t = this;
    var re = /\b([a-zA-Z0-9\.-]+)=([a-zA-Z0-9\.-]+)/g;

    var k, v;

    var results;
    while (results = re.exec(str)) {
        k = results[1].toLowerCase();
        v = results[2];

        if (acceptableTypes.indexOf(k) >= 0) {
            continue;
        }

        t[k] = v;
    }
}

Tooltip.setLinkResolver(function(a) {
    var result;
    var details = {};
    var rel = a.rel ? a.rel : '';
    if (a.dataset && a.dataset.wowhead) {
        rel = a.dataset.wowhead;
    } else if (a.getAttribute && a.getAttribute('data-wowhead')) {
        rel = a.getAttribute('data-wowhead');
    }

    if (/^np\b/.test(rel)) {
        return false;
    }

    if (result = a.href.match(new RegExp('^https?://(?:([^\.]+)\.)?wowhead\.com/(' + acceptableTypes.join('|') + ')=(\\d+)', 'i'))) {
        details.domain = result[1];
        details.type = result[2];
        details.id = result[3];

        paramWalk.call(details, a.href);
    }

    if (result = rel.match(new RegExp('\\b(' + acceptableTypes.join('|') + ')=(\\d+)', 'i'))) {
        details.type = result[1];
        details.id = result[2];
    }
    paramWalk.call(details, rel);

    if (!details.domain) {
        details.domain = 'www';
    }
    details.locale = domainToLocale[details.domain.toLowerCase()] || 'en_US';

    if (details.type == 'item') {
        return getItem(details);
    }

    return false;
});

function getItem(details) {
    return BNet.GetItem(details.locale, details.id).then(buildItemTooltip.bind(null, details));
}

function buildItemTooltip(details, json) {
    Locales.setLocale(details.locale);
    var l = Locales.dictionary();

    console.log(json);

    var top = document.createElement('div');
    top.appendChild(makeSpan(json.name, 'line name q' + json.quality));

    if (json.itemLevel && [2,4].indexOf(json.itemClass) >= 0) {
        top.appendChild(makeSpan(l.itemlevel + ' ' + json.itemLevel, 'line level'));
    }

    if (json.icon) {
        var i = document.createElement('div');
        i.className = 'icon';
        i.style.backgroundImage = "url('" + IconPath + encodeURIComponent(json.icon) + ".jpg')";
        top.appendChild(i);
    }

    return top;
}

function makeSpan(txt, cls) {
    var s = document.createElement('span');
    s.appendChild(document.createTextNode(txt));
    s.className = cls;
    return s;
}

var ranSetup = false;
function setupAfterLoad() {
    if (ranSetup) {
        return;
    }
    ranSetup = true;

    Tooltip.init();
}

window.uncommonTooltips = {
    init: function(key) {
        BNet.SetKey(key);

        if (document.readyState === "interactive" || document.readyState === "complete") {
            setupAfterLoad();
        } else {
            window.addEventListener('load', setupAfterLoad);
        }
    }
};