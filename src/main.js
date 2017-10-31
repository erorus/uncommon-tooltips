const BNet = require('./battlenet');
const Tooltip = require('./tooltip');
const GameData = require('./gamedata');
const Locales = require('./locales');

const IconPath = 'https://render-us.worldofwarcraft.com/icons/56/';

const DomainToLocale = {
    'www': 'en_US',
    'de': 'de_DE',
    'es': 'es_ES',
    'fr': 'fr_FR',
    'it': 'it_IT',
    'pt': 'pt_BR',
    'ru': 'ru_RU',
    'ko': 'ko_KR',
};

const AcceptableTypes = ['item','npc'];

function paramWalk(str) {
    var t = this;
    var re = /\b([a-zA-Z0-9\.-]+)=([a-zA-Z0-9\.-]+)/g;

    var k, v;

    var results;
    while (results = re.exec(str)) {
        k = results[1].toLowerCase();
        v = results[2];

        if (AcceptableTypes.indexOf(k) >= 0) {
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

    if (result = a.href.match(new RegExp('^https?://(?:([^\.]+)\.)?wowhead\.com/(' + AcceptableTypes.join('|') + ')=(\\d+)', 'i'))) {
        details.domain = result[1];
        details.type = result[2];
        details.id = result[3];

        paramWalk.call(details, a.href);
    }

    if (result = rel.match(new RegExp('\\b(' + AcceptableTypes.join('|') + ')=(\\d+)', 'i'))) {
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
    if (details.type == 'npc' && GameData.speciesMap.hasOwnProperty(details.id)) {
        details.npc = details.id;
        details.type = 'species';
        details.id = GameData.speciesMap[details.npc];
        return getSpecies(details);
    }

    return false;
});

function getItem(details) {
    return BNet.GetItem(details.locale, details.id).then(function(item) {
        details.itemSetLookup = {};

        var promises = [];
        if (item.itemSet && item.itemSet.items) {
            for (var x in item.itemSet.items) {
                if (!item.itemSet.items.hasOwnProperty(x)) {
                    continue;
                }
                if (item.itemSet.items[x] == item.id) {
                    details.itemSetLookup[item.id] = item;
                    continue;
                }
                promises.push(BNet.GetItem(details.locale, item.itemSet.items[x]));
            }
        }

        return Promise.all(promises).then(function(responses) {
            for (var x in responses) {
                if (!responses.hasOwnProperty(x)) {
                    continue;
                }
                if (!responses[x].hasOwnProperty('id')) {
                    continue;
                }
                details.itemSetLookup[responses[x].id] = responses[x];
            }
            return buildItemTooltip(details, item);
        })
    });
}

function getSpecies(details) {
    return BNet.GetSpecies(details.locale, details.id).then(buildSpeciesTooltip.bind(null, details));
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

function buildSpeciesTooltip(details, json) {
    Locales.setLocale(details.locale);
    var l = Locales.dictionary();

    var s, x, y, top = document.createElement('div');

    if (!json.speciesId) {
        var reason = json.reason || 'Unable to get species information';
        top.appendChild(makeSpan(reason));
        return top;
    }

    if (json.icon) {
        var i = document.createElement('div');
        i.className = 'icon';
        i.style.backgroundImage = "url('" + IconPath + encodeURIComponent(json.icon) + ".jpg')";
        top.appendChild(i);
    }

    top.appendChild(makeSpan(json.name, 'name q'));

    s = makeSpan(l.battlePet);
    if (l.petFamilyMap.hasOwnProperty(json.petTypeId)) {
        s.appendChild(makeSpan(l.petFamilyMap[json.petTypeId], 'right'));
    }
    top.appendChild(s);

    if (!json.canBattle) {
        top.appendChild(makeSpan(l.cannotBattle, 'red'));
    }

    if (json.description) {
        top.appendChild(document.createElement('br'));
        top.appendChild(makeSpan('"' + json.description + '"', 'q'));
    }

    return top;
}

function buildItemTooltip(details, json) {
    Locales.setLocale(details.locale);
    var l = Locales.dictionary();
    var formatNum = formatNumber.bind(null, details.locale);

    console.log(details, json);

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

    var name = json.name;
    if (details.rand) {
        if (details.rand < 0) {
            if (l.itemRandomSuffixMap.hasOwnProperty(details.rand * -1)) {
                name += ' ' + l.itemRandomSuffixMap[details.rand * -1];
            }
        } else {
            if (l.itemRandomPropertiesMap.hasOwnProperty(details.rand)) {
                name += ' ' + l.itemRandomPropertiesMap[details.rand];
            }
        }
    }
    top.appendChild(makeSpan(name, 'name q' + json.quality));

    if (json.nameDescription) {
        s = makeSpan(json.nameDescription);
        if (json.nameDescriptionColor) {
            s.style.color = '#' + json.nameDescriptionColor;
        }
        top.appendChild(s);
    }

    if (json.itemClass == 16 && l.classMap.hasOwnProperty(json.itemSubClass)) { // glyph
        top.appendChild(makeSpan(l.classMap[json.itemSubClass]));
    }

    if (json.itemLevel && ([2,4].indexOf(json.itemClass) >= 0 || (json.itemClass == 3 && json.itemSubClass == 11))) {
        top.appendChild(makeSpan(Locales.format(l.itemLevel, json.itemLevel), 'level'));
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

    if (GameData.toys.indexOf(json.id) >= 0) {
        top.appendChild(makeSpan(l.toy, 'blue'));
    }

    if (json.itemClass == 15 && json.itemSubClass == 5) {
        top.appendChild(makeSpan(l.mount));
    }

    // begins a quest - not in json

    if (l.inventoryTypeMap.hasOwnProperty(json.inventoryType)) {
        var subType = '' + json.itemClass + '-' + json.itemSubClass;
        if (json.inventoryType == 18 && json.containerSlots) { // bag
            top.appendChild(makeSpan(Locales.format(l.slotBag, json.containerSlots,
                l.inventorySubtypeMap.hasOwnProperty(subType) ? l.inventorySubtypeMap[subType] : l.inventoryTypeMap[json.inventoryType]
            )));
        } else {
            s = makeSpan(l.inventoryTypeMap[json.inventoryType]);
            if (l.inventorySubtypeMap.hasOwnProperty(subType)) {
                s.appendChild(makeSpan(l.inventorySubtypeMap[subType], 'right'));
            }
            top.appendChild(s);
        }
    }

    if (json.gemInfo) {
        if (json.gemInfo.type && json.gemInfo.type.type) {
            x = json.gemInfo.type.type.toLowerCase().replace(/[^a-z0-9]/g, '');
            if (l.relicSlotMap.hasOwnProperty(x)) {
                top.appendChild(makeSpan(Locales.format(l.relic, l.relicSlotMap[x]), 'q6'));
            }
        }
        if (json.gemInfo.minItemLevel) {
            top.appendChild(makeSpan(Locales.format(l.requiresItemLevel, json.gemInfo.minItemLevel)));
        }
        if (json.gemInfo.bonus && json.gemInfo.bonus.name) {
            // relic bonuses come back as just "relic enhancement" without the ilvl boost or trait bonus data. i guess blizz got lazy.
            top.appendChild(makeSpan(json.gemInfo.bonus.name));
        }
    }

    if (json.weaponInfo) {
        s = makeSpan('' + Locales.format(l.damage, formatNum(json.weaponInfo.damage.min), formatNum(json.weaponInfo.damage.max)));
        s.appendChild(makeSpan(l.speed + ' ' + formatNum(json.weaponInfo.weaponSpeed, 2), 'right'));
        top.appendChild(s);
        top.appendChild(makeSpan(Locales.format(l.damagePerSecond, formatNum(json.weaponInfo.dps, 2))));
    }

    if (json.armor) {
        top.appendChild(makeSpan(formatNum(json.armor) + ' ' + l.armor));
    }

    var buildStats = statsSection.bind(null, formatNum, top);

    buildStats(json.bonusStats);
    buildStats(getRandEnchantStats(details, json), 'q2');

    var addedBlank = false;

    if (details.ench && l.enchantMap[details.ench]) {
        if (!addedBlank) {
            addedBlank = true;
            top.appendChild(document.createElement('br'));
        }
        top.appendChild(makeSpan(Locales.format(l.enchanted, l.enchantMap[details.ench]), 'q2'));
    }
    //buildStats(getEnchantStats(details, json), 'q2');

    if (json.socketInfo && json.socketInfo.sockets) {
        if (!addedBlank) {
            addedBlank = true;
            top.appendChild(document.createElement('br'));
        }
        for (x = 0; x < json.socketInfo.sockets.length; x++) {
            y = json.socketInfo.sockets[x].type;
            if (!y) {
                continue;
            }
            y = y.toLowerCase().replace(/[^a-z0-9]/g, '');

            s = makeSpan(false, 'q0');
            top.appendChild(s);
            s.appendChild(Tooltip.createSocket(y));
            if (l.relicSlotMap.hasOwnProperty(y)) {
                s.appendChild(document.createTextNode(Locales.format(l.relicSlot, l.relicSlotMap[y])));
            } else if (l.socketMap.hasOwnProperty(y)) {
                s.appendChild(document.createTextNode(l.socketMap[y]));
            } else {
                s.appendChild(document.createTextNode(y));
            }
            top.appendChild(s);
        }

        if (json.socketInfo.socketBonus) {
            top.appendChild(makeSpan(Locales.format(l.socketBonus, json.socketInfo.socketBonus), 'q0'));
        }
    }

    if (json.itemSpells) {
        var spellText = '';
        for (x in json.itemSpells) {
            if (!json.itemSpells.hasOwnProperty(x) || !json.itemSpells[x].spell) {
                continue;
            }
            if (json.itemSpells[x].trigger == 'ON_LEARN') {
                continue;
            }

            if (!json.itemSpells[x].spell.description) {
                if (json.itemSpells[x].trigger == 'ON_USE' && json.description) {
                    json.itemSpells[x].spell.description = json.description;
                    json.description = '';
                } else {
                    continue;
                }
            }

            spellText = '';
            spellText += (l.spellTriggerMap.hasOwnProperty(json.itemSpells[x].trigger) ? l.spellTriggerMap[json.itemSpells[x].trigger] : (json.itemSpells[x].trigger + ':')) + ' ';
            spellText += json.itemSpells[x].spell.description;

            if (!addedBlank) {
                addedBlank = true;
                top.appendChild(document.createElement('br'));
            }
            top.appendChild(makeSpan(spellText, 'q2'));

            if (json.itemSpells[x].nCharges > 1) {
                top.appendChild(makeSpan(Locales.format(l.charges, json.itemSpells[x].nCharges)));
            }

            // recipe reagents 24307 47654 - not in json
        }
    }

    if (json.itemSet && json.itemSet.name) {
        top.appendChild(document.createElement('br')); // even if we already added one, this is a new section for itself
        addedBlank = true;
        top.appendChild(makeSpan(json.itemSet.name, 'q'));

        s = document.createElement('div');
        s.className = 'itemset-items q0';
        top.appendChild(s);
        for (x in json.itemSet.items) {
            if (!json.itemSet.items.hasOwnProperty(x)
                || !details.itemSetLookup.hasOwnProperty(json.itemSet.items[x])
                || !details.itemSetLookup[json.itemSet.items[x]].name) {
                continue;
            }
            s.appendChild(makeSpan(details.itemSetLookup[json.itemSet.items[x]].name));
        }

        if (json.itemSet.setBonuses && json.itemSet.setBonuses.length) {
            top.appendChild(document.createElement('br'));
            for (x in json.itemSet.setBonuses) {
                if (!json.itemSet.setBonuses.hasOwnProperty(x) || !json.itemSet.setBonuses[x].description) {
                    continue;
                }
                top.appendChild(makeSpan(Locales.format(l.itemSetBonus, json.itemSet.setBonuses[x].threshold, json.itemSet.setBonuses[x].description), 'q0'));
            }
        }
    }

    if (addedBlank) { // add trailing blank
        top.appendChild(document.createElement('br'));
        addedBlank = false;
    }

    if (json.maxDurability) {
        top.appendChild(makeSpan(Locales.format(l.durability, json.maxDurability, json.maxDurability)));
    }

    if (json.allowableRaces && json.allowableRaces.length) {
        var allSet = {};
        allSet[l.allianceOnly] = [1,3,4,7,11,22,25];
        allSet[l.hordeOnly] = [2,5,6,8,9,10,26];
        top.appendChild(allowList(json.allowableRaces, l.raceMap, 'Race', l.races, allSet));
    }

    if (json.allowableClasses && json.allowableClasses.length) {
        top.appendChild(allowList(json.allowableClasses, l.classMap, 'Class', l.classes));
    }

    if (json.requiredLevel > 1) {
        top.appendChild(makeSpan(Locales.format(l.requiresLevel, json.requiredLevel)));
    }

    if (json.requiredSkill) {
        top.appendChild(makeSpan(Locales.format(l.requiresMinSkill, l.skillMap[json.requiredSkill], json.requiredSkillRank)));
    }

    if (json.requiredAbility && json.requiredAbility.name) {
        top.appendChild(makeSpan(Locales.format(l.requires, json.requiredAbility.name)));
    }

    if (json.minFactionId && json.minReputation && l.factionMap.hasOwnProperty(json.minFactionId)) {
        top.appendChild(makeSpan(Locales.format(l.requiresReputation, l.factionMap[json.minFactionId], l.reputationMap[json.minReputation])));
    }

    if (json.description) {
        top.appendChild(makeSpan('"' + json.description + '"', 'q'));
    }

    if (GameData.craftingReagents.indexOf(json.id) >= 0) {
        top.appendChild(makeSpan(l.craftingReagent, 'blue'));
    }

    return top;
}

function sortItemStats(bonusStats) {
    var statsOrders = [
        [4, 3, 5, 71, 72, 73, 74, 7, 1, 0, 8, 9, 2, 10],
        [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 42, 41, 43, 44, 45, 46, 47, 48, 49, 50, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 6],
        [56, 51, 55, 52, 54, 53],
    ];
    var x, y, statsLists = [[],[],[]];
    var effects = [];

    var allResistWatch = {
        '56': 0,
        '51': 0,
        '55': 0,
        '52': 0,
        '54': 0,
    };

    for (y = 0; y < bonusStats.length; y++) {
        if (!bonusStats[y].hasOwnProperty('stat')) {
            effects.push(bonusStats[y]);
            continue;
        }
        if (allResistWatch.hasOwnProperty(bonusStats[y].stat)) {
            allResistWatch[bonusStats[y].stat] += bonusStats[y].amount;
        }
        statsLists[statsLists.length - 1].push(bonusStats[y]);
        for (x = 0; x < statsOrders.length; x++) {
            if (statsOrders[x].indexOf(parseInt(bonusStats[y].stat,10)) >= 0) {
                statsLists[x].push(bonusStats[y]);
                statsLists[statsLists.length - 1].pop();
                break;
            }
        }
    }

    var allResistAmount = allResistWatch['56'];
    for (x in allResistWatch) {
        if (!allResistWatch.hasOwnProperty(x)) {
            continue;
        }
        if (allResistAmount != allResistWatch[x]) {
            allResistAmount = false;
            break;
        }
    }
    if (allResistAmount) {
        for (x = 0; x < statsLists[2].length; x++) {
            if (allResistWatch.hasOwnProperty(statsLists[2][x].stat)) {
                statsLists[2].splice(x--, 1);
            }
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

    for (x = 0; x < statsLists.length; x++) {
        statsLists[x].sort(statComparitor.bind(null, statsOrders[x]));
    }

    return {stats: statsLists, allResist: allResistAmount, effects: effects};
}

function getRandEnchantStats(details, json) {
    if (!details.rand) {
        return [];
    }

    var l = Locales.dictionary();

    var x, y, enchMap, enchId, stat, amount;

    if (details.rand < 0) {
        var enchId = -1 * details.rand;
        if (!GameData.itemRandomSuffix.hasOwnProperty(enchId)) {
            return [];
        }

        enchMap = GameData.itemRandomSuffix[enchId];
    } else {
        if (!GameData.itemRandomProperties.hasOwnProperty(details.rand)) {
            return [];
        }

        enchMap = {};
        x = GameData.itemRandomProperties[details.rand];
        for (y in x) {
            if (!x.hasOwnProperty(y)) {
                continue;
            }
            enchMap[x[y]] = 0;
        }
    }

    var enchIndex, statList = {};
    var effectType, effectPoints;
    var statArray = [];

    for (enchId in enchMap) {
        if (!enchMap.hasOwnProperty(enchId)) {
            continue;
        }
        if (!GameData.itemEnchants.hasOwnProperty(enchId)) {
            continue;
        }
        for (enchIndex in GameData.itemEnchants[enchId]) {
            if (!GameData.itemEnchants[enchId].hasOwnProperty(enchIndex)) {
                continue;
            }
            effectType = GameData.itemEnchants[enchId][enchIndex][0];
            stat = GameData.itemEnchants[enchId][enchIndex][1];
            effectPoints = GameData.itemEnchants[enchId][enchIndex][2];

            if (effectType == 5) {
                if (enchMap[enchId] == 0) {
                    // use baked-in amount
                    amount = effectPoints;
                } else {
                    // use random prop points
                    amount = getRandomPropPoints(json.itemLevel, json.quality, json.inventoryType, json.itemSubClass) * enchMap[enchId] / 10000;
                }
                if (!statList.hasOwnProperty(stat)) {
                    statList[stat] = 0;
                }
                statList[stat] += amount;
            } else {
                statArray.push(l.enchantMap[enchId]);
                break;
            }
        }
    }

    for (stat in statList) {
        if (!statList.hasOwnProperty(stat)) {
            continue;
        }
        if (!statList[stat]) {
            continue;
        }
        statArray.push({stat: stat, amount: statList[stat]});
    }

    return statArray;
}

function statsSection(formatNum, top, statOutput, defaultClass) {
    var l = Locales.dictionary();
    var x, y, stat;
    if (!defaultClass) {
        defaultClass = '';
    }
    var statsSorted = sortItemStats(statOutput);

    for (x = 0; x < statsSorted.stats.length; x++) {
        for (y = 0; stat = statsSorted.stats[x][y]; y++) {
            top.appendChild(makeSpan((stat.amount >= 0 ? '+' : '-') + formatNum(stat.amount) + ' ' + l.itemStatMap[stat.stat], x == 1 ? 'q2' : defaultClass));
        }
    }
    if (statsSorted.allResist) {
        top.appendChild(makeSpan((statsSorted.allResist >= 0 ? '+' : '-') + formatNum(statsSorted.allResist) + ' ' + l.allResistances, 'q2'));
    }
    for (x = 0; x < statsSorted.effects.length; x++) {
        top.appendChild(makeSpan(statsSorted.effects[x], 'q2'));
    }
}

function getRandomPropPoints(level, quality, inventoryType, subClass) {
    // https://github.com/TrinityCore/TrinityCore/blob/master/src/server/game/Entities/Item/ItemEnchantmentMgr.cpp

    var idx = 0;

    var idxMap = {
        '2': 2,
        '3': 1,
        '6': 1,
        '8': 1,
        '9': 2,
        '10': 1,
        '11': 2,
        '12': 1,
        '13': 3,
        '14': 2,
        '16': 2,
        '21': 3,
        '22': 3,
        '23': 2,
        '28': 4,
    };

    if (idxMap.hasOwnProperty(inventoryType)) {
        idx = idxMap[inventoryType];
    }

    if (inventoryType == 26 && subClass == 19) { // wand
        idx = 3;
    }

    var entry = GameData.randPropPoints[level];
    if (!entry.length) {
        return 0;
    }

    switch (quality) {
        case 2: // uncommon
            return entry[2][idx];
        case 3: // rare
        case 7: // heirloom
            return entry[1][idx];
        case 4: // epic
        case 5: // legendary
        case 6: // artifact
            return entry[0][idx];
    }

    return 0;
}

function allowList(jsonList, map, name, prompt, allSet) {
    var s, x, y;
    var raceMap = {}, races = [];

    for (x = 0; x < jsonList.length; x++) {
        if (map.hasOwnProperty(jsonList[x])) {
            raceMap[map[jsonList[x]]] = jsonList[x];
        } else {
            raceMap[name + ' #' + jsonList[x]] = jsonList[x];
        }
        if (allSet) {
            for (y in allSet) {
                if (!allSet.hasOwnProperty(y)) {
                    continue;
                }
                if (allSet[y].indexOf(jsonList[x]) >= 0) {
                    allSet[y].splice(allSet[y].indexOf(jsonList[x]), 1);
                }
            }
        }
    }

    if (allSet) {
        for (y in allSet) {
            if (!allSet.hasOwnProperty(y)) {
                continue;
            }
            if (allSet[y].length == 0) {
                return makeSpan(y, 'nobr');
            }
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

    s = makeSpan(prompt ? prompt.replace(/%s/, '') : '');
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