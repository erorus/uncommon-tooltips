const BNet = require('./battlenet');
const Tooltip = require('./tooltip');
const Locales = require('./locales');

const wait = function(ms) { return new Promise(function(resolve) { setTimeout(resolve, ms) })};

const IconPath = 'https://render-us.worldofwarcraft.com/icons/56/';
const CraftingReagents = [723,765,769,774,783,785,814,818,1015,1080,1206,1210,1288,1468,1475,1529,1705,2251,2318,2319,2320,2321,2324,2325,2447,2449,2450,2452,2453,2589,2592,2604,2605,2672,2673,2674,2675,2677,2678,2770,2771,2772,2775,2776,2835,2836,2838,2840,2841,2842,2880,2886,2924,2934,2996,2997,3164,3173,3182,3355,3356,3357,3358,3369,3371,3404,3466,3470,3478,3486,3575,3576,3577,3667,3685,3712,3730,3731,3818,3819,3820,3821,3857,3858,3859,3860,3864,4231,4232,4233,4234,4235,4236,4289,4291,4304,4305,4306,4337,4338,4339,4340,4341,4342,4357,4359,4364,4371,4375,4377,4382,4387,4389,4399,4400,4402,4404,4461,4470,4603,4611,4625,4655,5051,5082,5373,5465,5466,5467,5468,5469,5470,5471,5498,5500,5503,5504,5635,5637,5784,5785,6037,6260,6261,6289,6291,6303,6308,6317,6358,6359,6361,6362,6370,6371,6470,6471,6889,7067,7068,7069,7070,7071,7072,7075,7076,7077,7078,7079,7080,7081,7082,7191,7286,7392,7909,7910,7911,7912,7966,7971,7972,7974,8150,8153,8154,8165,8167,8169,8170,8171,8172,8343,8365,8831,8836,8838,8839,8845,8846,9060,9061,9210,9262,10285,10286,10290,10505,10558,10559,10560,10561,10620,10647,10938,10939,10940,10978,10998,11082,11083,11084,11134,11135,11137,11138,11139,11174,11175,11176,11177,11178,11291,11370,11371,11382,11754,12037,12184,12202,12203,12204,12205,12206,12207,12208,12223,12359,12360,12361,12363,12364,12365,12607,12644,12655,12662,12799,12800,12803,12804,12808,12809,12810,12811,12938,13422,13423,13463,13464,13465,13466,13467,13468,13754,13756,13757,13758,13759,13760,13888,13889,13926,14047,14048,14227,14256,14341,14342,14343,14344,15407,15408,15410,15412,15414,15415,15416,15417,15419,15992,15994,16000,16006,16202,16203,16204,17010,17011,17012,17056,17194,17203,18240,18335,18562,18567,18631,19441,19767,19768,19943,20381,20424,20520,20725,20816,20817,20963,21024,21071,21153,21752,21840,21842,21844,21845,21877,21881,21882,21884,21885,21886,21887,21929,22202,22203,22445,22446,22447,22448,22449,22450,22451,22452,22456,22457,22572,22573,22574,22575,22576,22577,22578,22644,22682,22785,22786,22787,22789,22790,22791,22792,22793,22794,23077,23079,23107,23112,23117,23424,23425,23426,23427,23436,23437,23438,23439,23440,23441,23445,23446,23447,23448,23449,23571,23572,23573,23676,23781,23782,23783,23784,23785,23786,23787,23793,24243,24271,24272,24477,24478,24479,25649,25699,25700,25707,25708,25867,25868,27422,27425,27429,27435,27437,27438,27439,27515,27516,27668,27669,27671,27674,27677,27678,27681,27682,29539,29547,29548,30183,30817,31079,31670,31671,32227,32228,32229,32230,32231,32249,32423,32428,33470,33567,33568,33823,33824,34052,34053,34054,34055,34056,34057,34664,34736,35128,35562,35622,35623,35624,35625,35627,36782,36783,36784,36860,36901,36903,36904,36905,36906,36907,36908,36909,36910,36912,36913,36916,36917,36918,36919,36920,36921,36922,36923,36924,36925,36926,36927,36928,36929,36930,36931,36932,36933,36934,37663,37700,37701,37702,37703,37704,37705,37921,38425,38426,38557,38558,38561,39151,39334,39338,39339,39340,39341,39342,39343,39354,39469,39681,39682,39683,39684,39690,39774,39970,40195,40199,40533,41163,41266,41334,41510,41511,41593,41594,41595,41800,41801,41802,41803,41805,41806,41807,41808,41809,41810,41812,41813,41814,42225,42253,43007,43009,43010,43011,43012,43013,43102,43103,43104,43105,43106,43107,43108,43109,43115,43116,43117,43118,43119,43120,43121,43122,43123,43124,43125,43126,43127,43501,44128,44499,44500,44501,44834,44835,44853,44958,45087,47556,49908,51950,52078,52177,52178,52179,52180,52181,52182,52183,52185,52186,52188,52190,52191,52192,52193,52194,52195,52196,52303,52325,52326,52327,52328,52329,52555,52718,52719,52720,52721,52722,52976,52977,52979,52980,52982,52983,52984,52985,52986,52987,52988,53010,53038,53039,53062,53063,53064,53065,53066,53067,53068,53069,53070,53071,53072,53643,54440,54849,56516,56850,58480,60224,61978,61979,61980,61981,62323,62778,62779,62780,62781,62782,62783,62784,62785,62786,62791,65365,65892,65893,67229,67319,67335,67749,69237,71805,71806,71807,71808,71809,71810,71998,72092,72093,72094,72095,72096,72103,72104,72120,72162,72163,72234,72235,72237,72238,72988,74247,74248,74249,74250,74251,74252,74659,74660,74661,74662,74832,74833,74834,74837,74838,74839,74840,74841,74842,74843,74844,74845,74846,74847,74848,74849,74850,74851,74852,74853,74854,74856,74857,74859,74860,74861,74863,74864,74865,74866,75014,76061,76130,76131,76132,76133,76134,76135,76136,76137,76138,76139,76140,76141,76142,76734,77467,77468,79010,79011,79101,79246,79250,79251,79253,79254,79255,79731,80433,82441,82447,83064,83092,85506,85583,85584,85585,87399,87828,89112,89639,90146,90407,90636,94111,94113,94289,97512,97546,97619,97620,97621,97622,97623,97624,98617,98619,98717,102218,102536,102537,102538,102539,102540,102541,102542,102543,107473,108042,108043,108255,108256,108257,108294,108295,108296,108297,108298,108299,108300,108301,108302,108303,108304,108305,108306,108307,108308,108309,108318,108319,108320,108321,108322,108323,108324,108325,108326,108327,108328,108329,108330,108331,108332,108333,108334,108335,108336,108337,108338,108339,108340,108341,108342,108343,108344,108345,108346,108347,108348,108349,108350,108351,108352,108353,108354,108355,108356,108357,108358,108359,108360,108361,108362,108363,108364,108365,108391,108996,109088,109096,109097,109098,109099,109100,109101,109102,109103,109104,109105,109106,109118,109119,109123,109124,109125,109126,109127,109128,109129,109130,109131,109132,109133,109134,109135,109136,109137,109138,109139,109140,109141,109142,109143,109144,109624,109625,109626,109627,109628,109629,109693,109991,109992,110609,110610,110611,110661,111245,111366,111556,111557,111589,111595,111601,111650,111651,111652,111656,111658,111659,111662,111663,111664,111665,111666,111667,111668,111669,111670,111671,111672,111673,111674,111675,111676,111849,112155,112156,112157,112158,112177,112178,112179,112180,112181,112182,112183,112184,112185,112377,112379,113111,113261,113262,113263,113264,113588,113589,114781,114931,114999,115002,115502,115504,115508,115524,116053,118472,119810,119813,119814,119815,119817,119819,120945,123918,123919,124101,124102,124103,124104,124105,124106,124107,124108,124109,124110,124111,124112,124113,124115,124116,124117,124118,124119,124120,124121,124122,124123,124124,124436,124437,124438,124439,124440,124441,124442,124444,124461,124632,124669,127004,127037,127681,127759,128304,128499,128500,129032,129034,129100,129284,129285,129286,129287,129288,129289,130172,130173,130174,130175,130176,130177,130178,130179,130180,130181,130182,130183,130245,133588,133589,133590,133591,133592,133593,133607,133680,133912,135500,136342,136533,136534,136538,136633,136636,136637,136638,137595,137596,137597,137609,138296,140781,140782,140783,140784,140785,142266,142335,142336,144329,151564,151565,151566,151567,151568,151579,151718,151719,151720,151721,151722];
const Toys = [1973,13379,17712,17716,18660,18984,18986,21540,23767,30542,30544,30690,32542,32566,32782,33079,33219,33223,33927,34480,34499,34686,35227,35275,36862,36863,37254,37460,37710,38301,38578,40727,40768,40895,43499,43824,44430,44606,44719,44820,45011,45013,45014,45015,45016,45017,45018,45019,45020,45021,45057,45063,45984,46709,46780,46843,48933,49703,49704,50471,52201,52253,53057,54212,54343,54437,54438,54452,54651,54653,60854,63141,63269,64358,64361,64373,64383,64456,64481,64482,64488,64646,64651,64881,64997,66888,67097,68806,69215,69227,69775,69776,69777,69895,69896,70159,70161,70722,71137,71259,71628,72159,72161,72220,72221,72222,72223,72224,72225,72226,72227,72228,72229,72230,72231,72232,72233,75042,79769,80822,82467,85500,85973,86565,86568,86571,86573,86575,86578,86581,86582,86583,86584,86586,86588,86589,86590,86593,86594,86596,87214,87215,87528,88370,88375,88377,88381,88385,88387,88417,88531,88566,88579,88580,88584,88587,88589,88801,88802,89139,89205,89222,89614,89869,89999,90000,90067,90175,90427,90883,90888,90899,91904,92738,93672,95567,95568,95589,95590,97919,97921,97942,97994,98132,98136,98552,101571,102467,103685,104262,104294,104302,104309,104318,104323,104324,104329,104331,105898,108631,108632,108633,108634,108635,108735,108739,108743,108745,109167,109183,109739,110586,111476,111821,112059,112324,113096,113375,113540,113542,113543,113570,113631,113670,114227,115468,115472,115503,115506,116067,116113,116115,116120,116122,116125,116139,116400,116435,116440,116456,116651,116689,116690,116691,116692,116757,116758,116763,116856,116888,116889,116890,116891,117550,117569,117573,118191,118221,118222,118224,118244,118427,118716,118935,118937,118938,119001,119003,119039,119083,119092,119093,119134,119144,119145,119160,119163,119178,119180,119182,119210,119211,119212,119215,119217,119218,119219,119220,119221,119421,119432,120276,120857,122117,122119,122120,122121,122122,122123,122126,122129,122283,122293,122298,122304,122674,122681,122700,123851,126931,127394,127652,127655,127659,127666,127668,127669,127670,127695,127696,127707,127709,127766,127859,127864,128223,128310,128328,128462,128471,128536,128636,128776,128794,128807,129045,129055,129057,129093,129111,129113,129149,129165,129211,129279,129367,129926,129929,129938,129952,129956,129958,129960,129961,129965,130102,130147,130151,130157,130158,130169,130170,130171,130191,130194,130199,130209,130214,130232,130249,130251,130254,131724,131811,131812,131814,131900,131933,132518,133511,133542,133997,133998,134004,134007,134019,134020,134021,134022,134023,134024,134026,134031,134032,134034,134831,136846,136849,136855,136927,136928,136934,136935,136937,137294,137663,138202,138415,138490,138873,138876,138878,138900,139337,139587,139773,140160,140231,140309,140314,140324,140325,140336,140363,140632,140779,140780,140786,141296,141297,141298,141299,141300,141301,141306,141331,141649,141862,141879,142265,142341,142360,142452,142494,142495,142496,142497,142528,142529,142530,142531,142532,142536,142542,143534,143543,143544,143545,143660,143662,143727,143827,143828,143829,144072,144339,144393,147307,147308,147309,147310,147311,147312,147537,147708,147832,147838,147843,147867,150547,150743,150744,150745,150746,151016,151184,151265,151270,151271,151343,151344,151348,151349,151652,151877,152556,152574,152982,153004,153039,153124,153126,153179,153180,153181,153182,153183,153193,153194,153204,153253,153293];

const DomainToLocale = {
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
    details.locale = DomainToLocale[details.domain.toLowerCase()] || 'en_US';

    if (details.type == 'item') {
        return getItem(details);
    }

    return false;
});

function getItem(details) {
    return BNet.GetItem(details.locale, details.id).then(buildItemTooltip.bind(null, details));
}

function formatNumber(locale, num, decimals) {
    if (locale) {
        locale = locale.replace(/_/g, '-');
    }
    if (!decimals) {
        decimals = 0;
    }
    return num.toLocaleString(locale, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    });
}

function buildItemTooltip(details, json) {
    Locales.setLocale(details.locale);
    var l = Locales.dictionary();
    var Format = formatNumber.bind(null, details.locale);

    console.log(json);

    var s, x, y, top = document.createElement('div');

    if (!json.id) {
        var reason = json.reason || 'Unable to get item information';
        top.appendChild(makeSpan(reason));
        return top;
    }

    if (json.icon) {
        var i = document.createElement('div');
        i.className = 'icon';
        i.style.backgroundImage = "url('" + IconPath + encodeURIComponent(json.icon) + ".jpg')";
        top.appendChild(i);
    }

    top.appendChild(makeSpan(json.name, 'name q' + json.quality));

    // todo: heroicTooltip(?)

    if (json.nameDescription) {
        s = makeSpan(json.nameDescription);
        if (json.nameDescriptionColor) {
            s.style.color = '#' + json.nameDescriptionColor;
        }
        top.appendChild(s);
    }

    if (json.itemLevel && [2,4].indexOf(json.itemClass) >= 0) {
        top.appendChild(makeSpan(l.itemLevel + ' ' + json.itemLevel, 'level'));
    }

    // upgrade level - not in json(?) always upgradable=true

    // conjured - not in json

    if (l.itemBindMap.hasOwnProperty(json.itemBind)) {
        // binds on battle.net account looks like BoP
        top.appendChild(makeSpan(l.itemBindMap[json.itemBind]));
    }

    if (json.maxCount) {
        top.appendChild(makeSpan(l.unique + (json.maxCount > 1 ? ' (' + json.maxCount + ')' : '')));
    }

    if (Toys.indexOf(json.id) >= 0) {
        top.appendChild(makeSpan(l.toy, 'blue'));
    }

    // begins a quest - not in json

    // todo: glyph type

    if (l.inventoryTypeMap.hasOwnProperty(json.inventoryType)) {
        var subType = '' + json.itemClass + '-' + json.itemSubClass;
        if (json.inventoryType == 18 && json.containerSlots) { // bag
            top.appendChild(makeSpan(json.containerSlots + ' ' + l.slot + ' ' +
                (l.inventorySubtypeMap.hasOwnProperty(subType) ? l.inventorySubtypeMap[subType] : l.inventoryTypeMap[json.inventoryType])
            ));
        } else {
            s = makeSpan(l.inventoryTypeMap[json.inventoryType]);
            if (l.inventorySubtypeMap.hasOwnProperty(subType)) {
                s.appendChild(makeSpan(l.inventorySubtypeMap[subType], 'right'));
            }
            top.appendChild(s);
        }
    }

    if (json.weaponInfo) {
        s = makeSpan('' + Format(json.weaponInfo.damage.min) + ' - ' + Format(json.weaponInfo.damage.max) + ' ' + l.damage);
        s.appendChild(makeSpan(l.speed + ' ' + Format(json.weaponInfo.weaponSpeed, 2), 'right'));
        top.appendChild(s);
        top.appendChild(makeSpan('(' + Format(json.weaponInfo.dps, 2) + ' ' + l.damagePerSecond + ')'));
    }

    if (json.armor) {
        top.appendChild(makeSpan(Format(json.armor) + ' ' + l.armor));
    }

    var baseStatOrder = [4, 3, 5, 71, 72, 73, 74, 7, 1, 0, 8, 9, 2, 10];
    var greenStatOrder = [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 42, 41, 43, 44, 45, 46, 47, 48, 49, 50, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 6];
    var baseStats = [];
    var greenStats = [];

    for (y = 0; y < json.bonusStats.length; y++) {
        if (baseStatOrder.indexOf(json.bonusStats[y].stat) >= 0) {
            baseStats.push(json.bonusStats[y]);
        } else {
            greenStats.push(json.bonusStats[y]);
        }
    }

    var statComparitor = function(order,a,b) {
        var apos = order.indexOf(a.stat);
        var bpos = order.indexOf(b.stat);

        if (apos < 0) {
            return 1;
        }
        if (bpos < 0) {
            return -1;
        }

        return apos < bpos ? -1 : 1;
    };

    baseStats.sort(statComparitor.bind(null, baseStatOrder));
    greenStats.sort(statComparitor.bind(null, greenStatOrder));

    var stat, statsList = [baseStats, greenStats];
    for (x = 0; x < statsList.length; x++) {
        for (y = 0; stat = statsList[x][y]; y++) {
            top.appendChild(makeSpan((stat.amount >= 0 ? '+' : '-') + Format(stat.amount) + ' ' + l.itemStatMap[stat.stat], x == 0 ? '' : 'q2'));
        }
    }

    // todo: enchants

    // todo: sockets

    // todo: socket bonus

    if (json.maxDurability) {
        top.appendChild(makeSpan(l.durability + ' ' + json.maxDurability + ' / ' + json.maxDurability));
    }

    if (json.allowableClasses && json.allowableClasses.length) {
        top.appendChild(allowList(json.allowableClasses, l.classMap, 'Class', l.classes));
    }

    if (json.allowableRaces && json.allowableRaces.length) {
        top.appendChild(allowList(json.allowableRaces, l.raceMap, 'Race', l.races));
    }

    if (json.itemSpells) {
        var spellText = '';
        for (x in json.itemSpells) {
            if (!json.itemSpells.hasOwnProperty(x)) {
                continue;
            }

            if (!json.itemSpells[x].spell || !json.itemSpells[x].spell.description) {
                continue;
            }

            spellText = '';
            spellText += (l.spellTriggerMap.hasOwnProperty(json.itemSpells[x].trigger) ? l.spellTriggerMap[json.itemSpells[x].trigger] : (json.itemSpells[x].trigger + ':')) + ' ';
            spellText += json.itemSpells[x].spell.description;

            top.appendChild(makeSpan(spellText, 'q2'));
        }
    }

    if (json.requiredLevel > 1) {
        top.appendChild(makeSpan(l.requiresLevel + ' ' + json.requiredLevel));
    }

    if (json.requiredSkill) {
        top.appendChild(makeSpan(l.requires + ' ' + l.skillMap[json.requiredSkill] + ' (' + json.requiredSkillRank + ')'));
    }

    // todo: required spell

    if (json.minFactionId && json.minReputation && l.factionMap.hasOwnProperty(json.minFactionId)) {
        top.appendChild(makeSpan(l.requires + ' ' + l.factionMap[json.minFactionId] + ' - ' + l.reputationMap[json.minReputation]));
    }

    if (json.description) {
        top.appendChild(makeSpan('"' + json.description + '"', 'q'));
    }

    if (CraftingReagents.indexOf(json.id) >= 0) {
        top.appendChild(makeSpan(l.craftingReagent, 'blue'));
    }

    // todo: itemset

    return top;
}

function allowList(jsonList, map, name, prompt) {
    var s, x;
    var raceMap = {}, races = [];
    for (x = 0; x < jsonList.length; x++) {
        if (map.hasOwnProperty(jsonList[x])) {
            raceMap[map[jsonList[x]]] = jsonList[x];
        } else {
            raceMap[name + ' #' + jsonList[x]] = jsonList[x];
        }
    }
    for (x in raceMap) {
        if (!raceMap.hasOwnProperty(x)) {
            continue;
        }
        races.push(x);
    }

    races.sort(function(a,b){
        return raceMap[a] < raceMap[b] ? -1 : 1;
    });

    s = makeSpan(prompt + ': ');
    for (x = 0; x < races.length; x++) {
        if (x > 0) {
            s.appendChild(document.createTextNode(', '));
        }
        s.appendChild(makeSpan(races[x], 'nobr' + (name == 'Class' ? ' c' + raceMap[races[x]] : '')));
    }

    return s;
}

function makeSpan(txt, cls) {
    var s = document.createElement('span');
    if (txt) {
        s.appendChild(document.createTextNode(txt));
    }
    if (cls) {
        s.className = cls;
    }
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
    init: function(info) {
        if (typeof info == 'string') {
            BNet.SetKey(info);
        } else if (info.hasOwnProperty('key')) {
            BNet.SetKey(info.key);
        } else {
            return false;
        }

        if (document.readyState === "interactive" || document.readyState === "complete") {
            setupAfterLoad();
        } else {
            window.addEventListener('load', setupAfterLoad);
        }

        return true;
    }
};