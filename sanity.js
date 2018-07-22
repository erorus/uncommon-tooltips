const GameData = require('./src/gamedata');
const fs = require('fs');

var locales = ['enUS', 'deDE', 'esES', 'frFR', 'itIT', 'koKR', 'ptBR', 'ruRU'];
var localeChecks = {
    "enUS": {
        "charges": "%d |4Charge:Charges;",
        "spellTriggerMap": {
            "ON_LEARN": "Learn Spell:"
        },
        "itemBindMap": {
            "4": "Quest Item"
        },
        "inventoryTypeMap": {
            "4": "Shirt"
        },
        "itemStatMap": {
            "3": "Agility"
        },
        "reputationMap": {
            "3": "Neutral"
        },
        "socketMap": {
            "meta": "Meta Socket"
        },
        "petFamilyMap": {
            "3": "Undead"
        },
        "relicSlotMap": {
            "fel": "Fel"
        },
        "inventorySubtypeMap": {
            "1-3": "Enchanting Bag"
        },
        "classMap": {
            "4": "Rogue"
        },
        "raceMap": {
            "4": "Night Elf"
        },
        "skillMap": {
            "171": "Alchemy"
        },
        "factionMap": {
            "54": "Gnomeregan"
        },
        "enchantMap": {
            "16": "Reinforced (+2 Armor)"
        },
        "itemRandomPropertiesMap": {
            "15": "of stamina"
        }
    },
    "deDE": {
        "charges": "%d |4Aufladung:Aufladungen;",
        "spellTriggerMap": {
            "ON_LEARN": "Zauber erlernen:"
        },
        "itemBindMap": {
            "4": "Questgegenstand"
        },
        "inventoryTypeMap": {
            "4": "Hemd"
        },
        "itemStatMap": {
            "3": "Beweglichkeit"
        },
        "reputationMap": {
            "3": "Neutral"
        },
        "socketMap": {
            "meta": "Metasockel"
        },
        "petFamilyMap": {
            "3": "Untot"
        },
        "relicSlotMap": {
            "fel": "Dämonisches"
        },
        "inventorySubtypeMap": {
            "1-3": "Verzauberertasche"
        },
        "classMap": {
            "4": "Schurke"
        },
        "raceMap": {
            "4": "Nachtelf"
        },
        "skillMap": {
            "171": "Alchemie"
        },
        "factionMap": {
            "54": "Gnomeregan"
        },
        "enchantMap": {
            "16": "Verstärkt (+2 Rüstung)"
        },
        "itemRandomPropertiesMap": {
            "15": "der Ausdauer"
        }
    },
    "esES": {
        "charges": "%d |4carga:cargas;",
        "spellTriggerMap": {
            "ON_LEARN": "Aprende hechizo:"
        },
        "itemBindMap": {
            "4": "Objeto de misión"
        },
        "inventoryTypeMap": {
            "4": "Camisa"
        },
        "itemStatMap": {
            "3": "agilidad"
        },
        "reputationMap": {
            "3": "Neutral"
        },
        "socketMap": {
            "meta": "Ranura meta"
        },
        "petFamilyMap": {
            "3": "No-muerto"
        },
        "relicSlotMap": {
            "fel": "Vil"
        },
        "inventorySubtypeMap": {
            "1-3": "Bolsa de encantamiento"
        },
        "classMap": {
            "4": "Pícaro"
        },
        "raceMap": {
            "4": "Elfo de la noche"
        },
        "skillMap": {
            "171": "Alquimia"
        },
        "factionMap": {
            "54": "Gnomeregan"
        },
        "enchantMap": {
            "16": "Reforzado (+2 armadura)"
        },
        "itemRandomPropertiesMap": {
            "15": "de aguante"
        }
    },
    "frFR": {
        "charges": "%d |4charge:charges;",
        "spellTriggerMap": {
            "ON_LEARN": "Apprendre le sort :"
        },
        "itemBindMap": {
            "4": "Objet de quête"
        },
        "inventoryTypeMap": {
            "4": "Chemise"
        },
        "itemStatMap": {
            "3": "Agilité"
        },
        "reputationMap": {
            "3": "Neutre"
        },
        "socketMap": {
            "meta": "Méta-châsse"
        },
        "petFamilyMap": {
            "3": "Mort-vivant"
        },
        "relicSlotMap": {
            "fel": "de Corruption"
        },
        "inventorySubtypeMap": {
            "1-3": "Sac d’enchanteur"
        },
        "classMap": {
            "4": "Voleur"
        },
        "raceMap": {
            "4": "Elfe de la nuit"
        },
        "skillMap": {
            "171": "Alchimie"
        },
        "factionMap": {
            "54": "Gnomeregan"
        },
        "enchantMap": {
            "16": "Renforcé (+2 à l’Armure)"
        },
        "itemRandomPropertiesMap": {
            "15": "d'Endurance"
        }
    },
    "itIT": {
        "charges": "%d |4carica:cariche;",
        "spellTriggerMap": {
            "ON_LEARN": "Apprendi incantesimo:"
        },
        "itemBindMap": {
            "4": "Oggetto di missione"
        },
        "inventoryTypeMap": {
            "4": "Camicia"
        },
        "itemStatMap": {
            "3": "Agilità"
        },
        "reputationMap": {
            "3": "Neutrale"
        },
        "socketMap": {
            "meta": "Incavo Meta"
        },
        "petFamilyMap": {
            "3": "Non Morta"
        },
        "relicSlotMap": {
            "fel": "Vile"
        },
        "inventorySubtypeMap": {
            "1-3": "Sacca da incantatore"
        },
        "classMap": {
            "4": "Ladro"
        },
        "raceMap": {
            "4": "Elfo della Notte"
        },
        "skillMap": {
            "171": "Alchimia"
        },
        "factionMap": {
            "54": "Gnomeregan"
        },
        "enchantMap": {
            "16": "Rinforzato (+2 Armatura)"
        },
        "itemRandomPropertiesMap": {
            "15": "della Tempra"
        }
    },
    "koKR": {
        "charges": "%d회 사용 가능",
        "spellTriggerMap": {
            "ON_LEARN": "주문 배우기:"
        },
        "itemBindMap": {
            "4": "퀘스트 아이템"
        },
        "inventoryTypeMap": {
            "4": "속옷"
        },
        "itemStatMap": {
            "3": "민첩성"
        },
        "reputationMap": {
            "3": "중립적"
        },
        "socketMap": {
            "meta": "얼개 보석 홈"
        },
        "petFamilyMap": {
            "3": "언데드"
        },
        "relicSlotMap": {
            "fel": "지옥"
        },
        "inventorySubtypeMap": {
            "1-3": "마법부여 가방"
        },
        "classMap": {
            "4": "도적"
        },
        "raceMap": {
            "4": "나이트 엘프"
        },
        "skillMap": {
            "171": "연금술"
        },
        "factionMap": {
            "54": "놈리건"
        },
        "enchantMap": {
            "16": "방어도 보강 (방어도 +2)"
        },
        "itemRandomPropertiesMap": {
            "15": "체력의"
        }
    },
    "ptBR": {
        "charges": "%d |4carga:cargas;",
        "spellTriggerMap": {
            "ON_LEARN": "Aprender feitiço:"
        },
        "itemBindMap": {
            "4": "Item de missão"
        },
        "inventoryTypeMap": {
            "4": "Camisa"
        },
        "itemStatMap": {
            "3": "Agilidade"
        },
        "reputationMap": {
            "3": "Tolerado"
        },
        "socketMap": {
            "meta": "Engaste meta"
        },
        "petFamilyMap": {
            "3": "Morto-vivo"
        },
        "relicSlotMap": {
            "fel": "Vil"
        },
        "inventorySubtypeMap": {
            "1-3": "Bolsa de Encantamento"
        },
        "classMap": {
            "4": "Ladino"
        },
        "raceMap": {
            "4": "Elfo Noturno"
        },
        "skillMap": {
            "171": "Alquimia"
        },
        "factionMap": {
            "54": "Gnomeregan"
        },
        "enchantMap": {
            "16": "Reforçado (+2 de Armadura)"
        },
        "itemRandomPropertiesMap": {
            "15": "do Vigor"
        }
    },
    "ruRU": {
        "charges": "%d |4заряд:заряда:зарядов;",
        "spellTriggerMap": {
            "ON_LEARN": "Выучить заклинание:"
        },
        "itemBindMap": {
            "4": "Требуется для задания"
        },
        "inventoryTypeMap": {
            "4": "Рубашка"
        },
        "itemStatMap": {
            "3": "к ловкости"
        },
        "reputationMap": {
            "3": "Равнодушие"
        },
        "socketMap": {
            "meta": "особое гнездо"
        },
        "petFamilyMap": {
            "3": "Нежить"
        },
        "relicSlotMap": {
            "fel": "Скверна"
        },
        "inventorySubtypeMap": {
            "1-3": "Сумка зачаровывателя"
        },
        "classMap": {
            "4": "Разбойник"
        },
        "raceMap": {
            "4": "Ночной эльф"
        },
        "skillMap": {
            "171": "Алхимия"
        },
        "factionMap": {
            "54": "Гномреган"
        },
        "enchantMap": {
            "16": "Доспех усилен (+2 к броне)"
        },
        "itemRandomPropertiesMap": {
            "15": "с печатью выносливости"
        }
    }
};

process.exit(main());

function main()
{
    if (localeChecks === false) {
        localeChecks = {};
        for (var x = 0; x < locales.length; x++) {
            localeChecks[locales[x]] = BuildCheckTemplate(locales[x]);
        }
        console.log(JSON.stringify(localeChecks, null, 4));
        return 1;
    }

    var failed = false;
    var ok;

    failed |= !(ok = GameData.patch.substr(0, 2) == '8.');
    console.log('Patch: ' + GameData.patch + OkOut(ok));

    failed |= !(ok = GameData.scalingBonusMap['615'] == 2794);
    console.log('Scaling Bonus Map:' + OkOut(ok));

    failed |= !(ok = SameArray(GameData.scalingCurveMap['1558'][0], [98, 138]));
    console.log('Scaling Curve Map:' + OkOut(ok));

    failed |= !(ok = GameData.speciesMap['2671'] == 39);
    console.log('Species Map:' + OkOut(ok));

    failed |= !(ok = GameData.toys.indexOf(17716) >= 0);
    console.log('Toys:' + OkOut(ok));

    failed |= !(ok = SameArray(GameData.randPropPoints[30][0], [15, 11, 9, 8, 8]));
    console.log('Random Prop Points:' + OkOut(ok));

    failed |= !(ok = SameArray(GameData.itemRandomProperties[247], [91, 95]));
    console.log('Item Random Properties:' + OkOut(ok));

    //failed |= !(ok = GameData.itemRandomSuffix['43']['2805'] == 5259);
    //console.log('Item Random Suffix:' + OkOut(ok));

    failed |= !(ok = SameArray(GameData.itemEnchants[1048][0], [5,4,21]));
    console.log('Item Enchants:' + OkOut(ok));

    failed |= !(ok = GameData.craftingReagents.indexOf(7075) >= 0);
    console.log('Crafting Reagents:' + OkOut(ok));

    var locales = ['enUS', 'deDE', 'esES', 'frFR', 'itIT', 'koKR', 'ptBR', 'ruRU'];
    for (var x = 0; x < locales.length; x++) {
        failed |= !LocaleCheck(locales[x], localeChecks[locales[x]]);
    }

    console.log('Sanity check ' + (failed ? 'failed' : 'successful'));
    return failed ? 1 : 0;
}

function SameArray(a1,a2) {
    return a1.length==a2.length && a1.every(function(v,i) { return v === a2[i]});
}

function OkOut(b) {
    return ' (' + (b ? 'ok' : 'bad') + ')';
}

function LocaleCheck(localeName, checks) {
    var ok, path = 'out/locales/' + localeName + '.json';

    var failed = false;

    ok = fs.existsSync(path);

    if (!ok) {
        console.log('Locale ' + localeName + ' found:' + OkOut(ok));
        return false;
    }

    var loc, locJson = fs.readFileSync(path);
    try {
        loc = JSON.parse(locJson);
    } catch (e) {
        console.log('Locale ' + localeName + ' could not be parsed (bad)');
        return false;
    }

    if (!loc.localeInfo || !loc.localeInfo.patch) {
        console.log('Locale ' + localeName + ' has no patch info (bad)');
        failed = true;
    } else {
        failed |= !(ok = loc.localeInfo.patch.substr(0,2) == '8.');
        console.log('Locale ' + localeName + ' patch: ' + loc.localeInfo.patch + OkOut(ok));
    }

    for (var k1 in checks) {
        if (!checks.hasOwnProperty(k1)) {
            continue;
        }
        if (typeof checks[k1] == 'object') {
            for (var k2 in checks[k1]) {
                if (!checks[k1].hasOwnProperty(k2)) {
                    continue;
                }
                if (loc[k1][k2] != checks[k1][k2]) {
                    console.log('Locale ' + localeName + ' ' + k1 + '/' + k2 + ': "' + loc[k1][k2] + '" (expected "' + checks[k1][k2] + '")' + OkOut(false));
                    failed = true;
                }
            }
        } else {
            if (loc[k1] != checks[k1]) {
                console.log('Locale ' + localeName + ' ' + k1 + ': "' + loc[k1] + '" (expected "' + checks[k1] + '")' + OkOut(false));
                failed = true;
            }
        }
    }

    return !failed;
}

function BuildCheckTemplate(localeName) {
    var path = 'out/locales/' + localeName + '.json';

    var locJson = fs.readFileSync(path);
    var loc = JSON.parse(locJson);

    var r = {};
    r['charges'] = loc['charges'];

    var lastKey, x;

    for (var k1 in loc) {
        if (!loc.hasOwnProperty(k1)) {
            continue;
        }
        if (k1 == 'localeInfo') {
            continue;
        }
        if (typeof loc[k1] == 'object') {
            lastKey = '';
            x = 0;
            for (var k2 in loc[k1]) {
                if (!loc[k1].hasOwnProperty(k2)) {
                    continue;
                }
                lastKey = k2;
                if (x++ >= 3) {
                    break;
                }
            }
            if (lastKey) {
                r[k1] = {};
                r[k1][lastKey] = loc[k1][lastKey];
            }
        }
    }

    return r;
}