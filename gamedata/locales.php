<?php

require_once __DIR__ . '/db2/src/autoload.php';

use \Erorus\DB2\Reader;

$SkillIds = [
    171, // Alchemy
    164, // Blacksmithing
    333, // Enchanting
    202, // Engineering
    182, // Herbalism
    165, // Leatherworking
    186, // Mining
    393, // Skinning
    197, // Tailoring
    755, // Jewelcrafting
    773, // Inscription

    794, // Archaeology
    185, // Cooking
    129, // First Aid
    356, // Fishing
    762, // Riding
];

$GlobalStringsTemplate = [
    'itemLevel' => 'ITEM_LEVEL', // Item Level %d

    'requiresMinSkill' => 'ITEM_MIN_SKILL', // Requires %s (%d)
    'requiresSkill' => 'ITEM_REQ_SKILL', // Requires %s
    'requiresLevel' => 'ITEM_MIN_LEVEL', // Requires Level %d
    'requiresItemLevel' => 'SOCKETING_ITEM_MIN_LEVEL_I', // Requires Item Level: %d
    'requiresReputation' => 'ITEM_REQ_REPUTATION', // Requires %s - %s

    'unique' => 'ITEM_UNIQUE', // Unique
    'craftingReagent' => 'PROFESSIONS_USED_IN_COOKING', // Crafting Reagent
    'toy' => 'TOY', // Toy
    'mount' => 'MOUNT', // Mount
    'battlePet' => 'TOOLTIP_BATTLE_PET', // Battle Pet
    'cannotBattle' => 'BATTLE_PET_CANNOT_BATTLE', // This creature cannot battle.

    'armor' => 'STAT_ARMOR', // Armor
    'durability' => 'DURABILITY_TEMPLATE', // Durability %d / %d
    'damage' => 'DAMAGE_TEMPLATE', // %s - %s Damage
    'speed' => 'STAT_SPEED', // Speed
    'damagePerSecond' => 'DPS_TEMPLATE', // (%s damage per second)
    'slotBag' => 'CONTAINER_SLOTS', // %d Slot %s
    'charges' => 'ITEM_SPELL_CHARGES', // %d |4Charge:Charges;
    'socketBonus' => 'ITEM_SOCKET_BONUS', // Socket Bonus: %s
    'enchanted' => 'ENCHANTED_TOOLTIP_LINE', // Enchanted: %s
    'itemSetName' => 'ITEM_SET_NAME', // %s (%d/%d)

    'classes' => 'ITEM_CLASSES_ALLOWED', // Classes: %s
    'races' => 'ITEM_RACES_ALLOWED', // Races: %s

    'itemSetBonus' => 'ITEM_SET_BONUS_GRAY', // (%d) Set: %s
    'resistAll' => 'ITEM_RESIST_ALL', // %c%d to All Resistances
    'allianceOnly' => 'ITEM_REQ_ALLIANCE', // Alliance Only
    'hordeOnly' => 'ITEM_REQ_HORDE', // Horde Only

    'relicSlot' => 'EMPTY_RELIC_TOOLTIP_TITLE', // %s Artifact Relic Slot
    'relic' => 'RELIC_TOOLTIP_TYPE', // %s Artifact Relic

    'spellTriggerMap' => [
        'ON_USE' => 'ITEM_SPELL_TRIGGER_ONUSE', // Use:
        'ON_EQUIP' => 'ITEM_SPELL_TRIGGER_ONEQUIP', // Equip:
        'ON_PROC' => 'ITEM_SPELL_TRIGGER_ONPROC', // Chance on hit:
        'ON_LEARN' => 'LEARN_SPELL_OBJECTIVE', // Learn Spell:
        'ON_PICKUP' => '', // empty, see 153290
    ],

    'itemBindMap' => [
        '1' => 'ITEM_BIND_ON_PICKUP',
        '2' => 'ITEM_BIND_ON_EQUIP',
        '3' => 'ITEM_BIND_ON_USE',
        '4' => 'ITEM_BIND_QUEST',
        '5' => 'ITEM_BIND_QUEST',
    ],

    'inventoryTypeMap' => [
        1 => 'INVTYPE_HEAD',
        2 => 'INVTYPE_NECK',
        3 => 'INVTYPE_SHOULDER',
        4 => 'INVTYPE_BODY',
        5 => 'INVTYPE_CHEST',
        6 => 'INVTYPE_WAIST',
        7 => 'INVTYPE_LEGS',
        8 => 'INVTYPE_FEET',
        9 => 'INVTYPE_WRIST',
        10 => 'INVTYPE_HAND',
        11 => 'INVTYPE_FINGER',
        12 => 'INVTYPE_TRINKET',
        13 => 'INVTYPE_WEAPON', // One-Hand
        14 => 'INVTYPE_WEAPONOFFHAND', // Off Hand
        15 => 'INVTYPE_RANGED',
        16 => 'INVTYPE_CLOAK', // Back
        17 => 'INVTYPE_2HWEAPON', // Two-Hand
        18 => 'INVTYPE_BAG',
        19 => 'INVTYPE_TABARD',
        20 => 'INVTYPE_ROBE', // Chest
        21 => 'INVTYPE_WEAPONMAINHAND', // Main Hand
        22 => 'INVTYPE_WEAPONOFFHAND', // Off Hand
        23 => 'INVTYPE_HOLDABLE', // Held In Off-hand
        24 => 'INVTYPE_AMMO', // Ammo (maybe should be "Projectile"?)
        25 => 'INVTYPE_THROWN',
        28 => 'INVTYPE_RELIC',
    ],
    
    'itemStatMap' => [
        0 => "ITEM_MOD_MANA_SHORT",
        1 => "ITEM_MOD_HEALTH_SHORT",
        2 => "Endurance",
        3 => "ITEM_MOD_AGILITY_SHORT",
        4 => "ITEM_MOD_STRENGTH_SHORT",
        5 => "ITEM_MOD_INTELLECT_SHORT",
        6 => "ITEM_MOD_SPIRIT_SHORT",
        7 => "ITEM_MOD_STAMINA_SHORT",
        8 => "ITEM_MOD_POWER_REGEN3_SHORT", // Energy Per 5 Sec.
        9 => "ITEM_MOD_POWER_REGEN1_SHORT", // Rage Per 5 Sec.
        10 => "ITEM_MOD_POWER_REGEN2_SHORT", // Focus Per 5 Sec.
        11 => "Weapon Skill",
        12 => "Defense Skill",
        13 => "ITEM_MOD_DODGE_RATING_SHORT", // Dodge
        14 => "ITEM_MOD_PARRY_RATING_SHORT", // Parry
        15 => "ITEM_MOD_BLOCK_RATING_SHORT", // Block
        16 => "ITEM_MOD_HIT_MELEE_RATING_SHORT", // Hit (Melee)
        17 => "ITEM_MOD_HIT_RANGED_RATING_SHORT", // Hit (Ranged)
        18 => "ITEM_MOD_HIT_SPELL_RATING_SHORT", // Hit (Spell)
        19 => "ITEM_MOD_CRIT_MELEE_RATING_SHORT", // Critical Strike (Melee)
        20 => "ITEM_MOD_CRIT_RANGED_RATING_SHORT", // Critical Strike (Ranged)
        21 => "ITEM_MOD_CRIT_SPELL_RATING_SHORT", // Critical Strike (Spell)
        22 => "ITEM_MOD_HIT_TAKEN_MELEE_RATING_SHORT", // Hit Avoidance (Melee)
        23 => "ITEM_MOD_HIT_TAKEN_RANGED_RATING_SHORT", // Hit Avoidance (Ranged)
        24 => "ITEM_MOD_HIT_TAKEN_SPELL_RATING_SHORT", // Hit Avoidance (Spell)
        25 => "ITEM_MOD_CRIT_TAKEN_MELEE_RATING_SHORT", // Critical Strike Avoidance (Melee)
        26 => "ITEM_MOD_CRIT_TAKEN_RANGED_RATING_SHORT", // Critical Strike Avoidance (Ranged)
        27 => "ITEM_MOD_CRIT_TAKEN_SPELL_RATING_SHORT", // Critical Strike Avoidance (Spell)
        28 => "Melee Haste",
        29 => "Ranged Haste",
        30 => "Spell Haste",
        31 => "ITEM_MOD_HIT_RATING_SHORT", // Hit
        32 => "ITEM_MOD_CRIT_RATING_SHORT", // Critical Strike
        33 => "ITEM_MOD_HIT_TAKEN_RATING_SHORT", // Hit Avoidance
        34 => "ITEM_MOD_CRIT_TAKEN_RATING_SHORT", // Critical Strike Avoidance
        35 => "ITEM_MOD_RESILIENCE_RATING_SHORT", // PvP Resilience
        36 => "ITEM_MOD_HASTE_RATING_SHORT", // Haste
        37 => "ITEM_MOD_EXPERTISE_RATING_SHORT", // Expertise
        38 => "ITEM_MOD_ATTACK_POWER_SHORT", // Attack Power
        39 => "ITEM_MOD_RANGED_ATTACK_POWER_SHORT", // Ranged Attack Power
        40 => "ITEM_MOD_VERSATILITY", // Versatility
        41 => "ITEM_MOD_SPELL_HEALING_DONE_SHORT", // Bonus Healing
        42 => "ITEM_MOD_SPELL_DAMAGE_DONE_SHORT", // Bonus Damage
        43 => "ITEM_MOD_POWER_REGEN0_SHORT", // Mana Per 5 Sec.
        44 => "ITEM_MOD_ARMOR_PENETRATION_RATING_SHORT", // Armor Penetration
        45 => "ITEM_MOD_SPELL_POWER_SHORT", // Spell Power
        46 => "ITEM_MOD_HEALTH_REGEN_SHORT", // Health Per 5 Sec.
        47 => "ITEM_MOD_SPELL_PENETRATION_SHORT", // Spell Penetration
        48 => "ITEM_MOD_BLOCK_VALUE_SHORT", // Block Value
        49 => "ITEM_MOD_MASTERY_RATING_SHORT", // Mastery
        50 => "ITEM_MOD_EXTRA_ARMOR_SHORT", // Bonus Armor
        51 => "RESISTANCE2_NAME", // Fire Resistance
        52 => "RESISTANCE4_NAME", // Frost Resistance
        53 => "RESISTANCE1_NAME", // Holy Resistance
        54 => "RESISTANCE5_NAME", // Shadow Resistance
        55 => "RESISTANCE3_NAME", // Nature Resistance
        56 => "RESISTANCE6_NAME", // Arcane Resistance
        57 => "ITEM_MOD_PVP_POWER_SHORT", // PvP Power
        58 => "Amplify",
        59 => "ITEM_MOD_CR_MULTISTRIKE_SHORT", // Multistrike
        60 => "Readiness",
        61 => "ITEM_MOD_CR_SPEED_SHORT", // Speed
        62 => "ITEM_MOD_CR_LIFESTEAL_SHORT", // Leech
        63 => "ITEM_MOD_CR_AVOIDANCE_SHORT", // Avoidance
        64 => "ITEM_MOD_CR_STURDINESS_SHORT", // Indestructible
        65 => "WOD_5",
        66 => "Cleave",
        // 71-74 handled below
    ],

];

$SpellEffectBySpell = [];

function main() {
    global $argv;

    if (!isset($argv[1])) {
        fwrite(STDERR, "Locales error: Supply the directory to the DB2 files as the first argument\n");
        return 1;
    }

    $db2Path = $argv[1];
    if (substr($db2Path, -1) != '/') {
        $db2Path .= '/';
    }

    if (!initSpellEffect($db2Path)) {
        return 1;
    }

    $json = [];

    $parts = [
        'getGlobalStrings',
        'getInventorySubtype',
        'getCharClasses',
        'getCharRaces',
        'getSkills',
        'getFactions',
        'getItemEnchants',
        'getItemRandomSuffix',
        'getItemRandomProperties',
    ];

    foreach ($parts as $part) {
        $partial = call_user_func($part, $db2Path);
        if (!$partial) {
            return 1;
        }
        $json = array_merge($json, $partial);
    }

    echo json_encode($json, JSON_NUMERIC_CHECK | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);

    return 0;
}

function initSpellEffect($db2Path) {
    global $SpellEffectBySpell;

    $SpellEffectBySpell = [];

    try {
        $reader = new Reader($db2Path . 'SpellEffect.db2');
    } catch (\Exception $e) {
        fwrite(STDERR, "Locales error: " . $e->getMessage() . "\n");
        return false;
    }

    $reader->setFieldsSigned([5 => true]);

    $reader->setFieldNames([
        2 => 'spell',
        3 => 'effecttypeid',
        5 => 'amount',
        6 => 'order',
        16 => 'diesides',
        17 => 'itemcreated',
    ]);

    foreach ($reader->generateRecords() as $record) {
        $SpellEffectBySpell[$record['spell']][$record['order']] = $record['amount'];
    }

    return true;
}

function getGlobalStrings($db2Path) {
    global $GlobalStringsTemplate;

    $json = [];
    $jsonFirstPass = [];

    try {
        $reader = new Reader($db2Path . 'GlobalStrings.db2');
    } catch (\Exception $e) {
        fwrite(STDERR, "Locales error: " . $e->getMessage() . "\n");
        return false;
    }
    $reader->setFieldNames([
        0 => 'key',
        1 => 'value',
    ]);
    $gsLookup = [];
    foreach ($reader->generateRecords() as $record) {
        $gsLookup[$record['key']] = $record['value'];
        if (preg_match('/^RELIC_SLOT_TYPE_(\w+)$/', $record['key'], $res)) {
            $jsonFirstPass['relicSlotMap'][strtolower($res[1])] = $record['value'];
        }
        if (preg_match('/^EMPTY_SOCKET_([\w\W]+)$/', $record['key'], $res)) {
            $jsonFirstPass['socketMap'][preg_replace('/[^a-z0-9]+/', '', strtolower($res[1]))] = $record['value'];
        }
        if (preg_match('/BATTLE_PET_NAME_(\d+)$/', $record['key'], $res)) {
            $jsonFirstPass['petFamilyMap'][intval($res[1], 10) - 1] = $record['value'];
        }
        if (preg_match('/FACTION_STANDING_LABEL(\d+)$/', $record['key'], $res)) {
            $jsonFirstPass['reputationMap'][intval($res[1], 10) - 1] = $record['value'];
        }
    }

    foreach ($GlobalStringsTemplate as $k => $lookup) {
        if (!is_array($lookup)) {
            $json[$k] = isset($gsLookup[$lookup]) ? $gsLookup[$lookup] : $lookup;
        } else {
            foreach ($lookup as $k2 => $lookup2) {
                $json[$k][$k2] = isset($gsLookup[$lookup2]) ? $gsLookup[$lookup2] : $lookup2;
            }
        }
    }

    $json = array_merge($json, $jsonFirstPass);

    /*
        //-------------------------------
        3 => "ITEM_MOD_AGILITY_SHORT",
        4 => "ITEM_MOD_STRENGTH_SHORT",
        5 => "ITEM_MOD_INTELLECT_SHORT",
        71 => "[Agility or Strength or Intellect]",
        72 => "[Agility or Strength]",
        73 => "[Agility or Intellect]",
        74 => "[Strength or Intellect]"
     */

    $json['itemStatMap'][71] = sprintf('[%s / %s / %s]', $json['itemStatMap'][3], $json['itemStatMap'][4], $json['itemStatMap'][5]);
    $json['itemStatMap'][72] = sprintf('[%s / %s]', $json['itemStatMap'][3], $json['itemStatMap'][4]);
    $json['itemStatMap'][73] = sprintf('[%s / %s]', $json['itemStatMap'][3], $json['itemStatMap'][5]);
    $json['itemStatMap'][74] = sprintf('[%s / %s]', $json['itemStatMap'][4], $json['itemStatMap'][5]);

    return $json;
}

// finds the subclass only for items that have the subclass in the tooltip
function getInventorySubtype($db2Path) {
    $json = [];

    try {
        $reader = new Reader($db2Path . 'ItemSubClass.db2');
    } catch (\Exception $e) {
        fwrite(STDERR, "Locales error: " . $e->getMessage() . "\n");
        return false;
    }
    $reader->setFieldNames([
        0 => 'name',
        1 => 'plural',
        3 => 'class',
        4 => 'subclass',
    ]);

    foreach ($reader->generateRecords() as $record) {
        $includeRecord = false;
        switch ($record['class']) {
            case 1: // bags
                $includeRecord = true;
                break;
            case 2: // weapons
                /* skipping:
                 9 warglaives
                11 bear claws
                12 cat claws
                14 miscellaneous
                17 spear
                */
                $includeRecord = in_array($record['subclass'], [0,1,2,3,4,5,6,7,8,10,13,15,16,18,19,20]);
                break;
            case 4: // armor
                $includeRecord = in_array($record['subclass'], [1,2,3,4,5]);
                break;
        }
        if ($includeRecord) {
            $json[sprintf('%d-%d', $record['class'], $record['subclass'])] = $record['name'];
        }
    }

    uksort($json, function($a,$b){
        $a = explode('-', $a);
        $b = explode('-', $b);
        if ($a[0] == $b[0]) {
            return $a[1] > $b[1] ? 1 : -1;
        }
        return $a[0] > $b[0] ? 1 : -1;
    });

    return ['inventorySubtypeMap' => $json];
}

function getCharClasses($db2Path) {
    return genericNameLookup($db2Path, 'ChrClasses.db2', 1, 'classMap');
}

function getCharRaces($db2Path) {
    $json = [];

    try {
        $reader = new Reader($db2Path . 'ChrRaces.db2');
    } catch (\Exception $e) {
        fwrite(STDERR, "Locales error: " . $e->getMessage() . "\n");
        return false;
    }
    $reader->setFieldNames([
        0 => 'flags',
        5 => 'name',
    ]);

    foreach ($reader->generateRecords() as $id => $record) {
        if (($record['flags'] & 1) == 0) {
            $json[$id] = $record['name'];
        }
    }

    ksort($json);

    return ['raceMap' => $json];
}

function getSkills($db2Path) {
    global $SkillIds;

    $json = [];

    try {
        $reader = new Reader($db2Path . 'SkillLine.db2');
    } catch (\Exception $e) {
        fwrite(STDERR, "Locales error: " . $e->getMessage() . "\n");
        return false;
    }
    $reader->setFieldNames([
        0 => 'name',
    ]);

    foreach ($SkillIds as $id) {
        if ($record = $reader->getRecord($id)) {
            $json[$id] = $record['name'];
        } else {
            $json[$id] = "Skill $id";
        }
    }

    ksort($json);

    return ['skillMap' => $json];
}

function getFactions($db2Path) {
    $json = [];

    try {
        $reader = new Reader($db2Path . 'Faction.db2');
    } catch (\Exception $e) {
        fwrite(STDERR, "Locales error: " . $e->getMessage() . "\n");
        return false;
    }
    $reader->setFieldNames([
        4 => 'name',
        7 => 'order',
    ]);

    foreach ($reader->generateRecords() as $id => $record) {
        if ($record['order'] < 4000) {
            $json[$id] = $record['name'];
        }
    }

    ksort($json);

    return ['factionMap' => $json];
}

function getItemRandomSuffix($db2Path) {
    return genericNameLookup($db2Path, 'ItemRandomSuffix.db2', 0, 'itemRandomSuffixMap');
}

function getItemRandomProperties($db2Path) {
    return genericNameLookup($db2Path, 'ItemRandomProperties.db2', 0, 'itemRandomPropertiesMap');
}

function getItemEnchants($db2Path) {
    $json = [];

    $record = [];
    $id = 0;

    $scalingTable = getGameTable($db2Path . '../GameTables/SpellScaling.txt');
    if (!$scalingTable) {
        return false;
    }

    $formatCallback = function($m) use (&$id, &$record, $scalingTable) {
        global $SpellEffectBySpell;
        static $seen = [];

        switch ($m[2]) {
            case 'k':
                if ($record['scalingPoints'][$m[3]-1]) {
                    $level = $record['maxLevel'] ?: 110;
                    $amount = round($record['scalingPoints'][$m[3] - 1] * $scalingTable[$level][11 + abs($record['scalingClass'])]);
                } else {
                    $amount = $record['effectPoints'][$m[3] - 1];
                }

                return $amount;
            case 's':
                return abs($SpellEffectBySpell[$m[1]][$m[3]-1]);
            default:
                if (!isset($seen[$m[2]])) {
                    $seen[$m[2]] = $m[0];
                    fwrite(STDERR, sprintf("New enchant description operator in enchant %d: \"%s\" - %s\n", $id, $m[2], $m[0]));
                }
        }

        return $m[0];
    };

    try {
        $reader = new Reader($db2Path . 'SpellItemEnchantment.db2');
    } catch (\Exception $e) {
        fwrite(STDERR, "Locales error: " . $e->getMessage() . "\n");
        return false;
    }
    $reader->setFieldNames([
        0 => 'spell',
        1 => 'name',
        2 => 'scalingPoints',
        5 => 'effectPoints',
        15 => 'maxLevel',
        16 => 'scalingClass',
    ]);
    $reader->setFieldsSigned([16 => true]);
    foreach ($reader->generateRecords() as $id => $record) {
        $json[$id] = preg_replace_callback('/\$(\d*)(\w)(\d)/', $formatCallback, $record['name']);
    }

    ksort($json);

    return ['enchantMap' => $json];
}

function genericNameLookup($db2Path, $db2File, $nameField, $arrayKey) {
    $json = [];

    try {
        $reader = new Reader($db2Path . $db2File);
    } catch (\Exception $e) {
        fwrite(STDERR, "Locales error: " . $e->getMessage() . "\n");
        return false;
    }
    foreach ($reader->generateRecords() as $id => $record) {
        $json[$id] = $record[$nameField];
    }

    ksort($json);

    return [$arrayKey => $json];
}

function getGameTable($path, $withNames = false) {
    if (!file_exists($path)) {
        fwrite(STDERR, "Locales error: Could not find game table at $path\n");
        return false;
    }
    $handle = fopen($path, 'r');
    if ($handle === false) {
        fwrite(STDERR, "Locales error: Could not open game table at $path\n");
        return false;
    }

    $header = fgetcsv($handle, 4096, "\t");
    array_shift($header);

    $expectedCols = count($header) + 1;

    $rows = [];
    while (!feof($handle)) {
        $data = fgetcsv($handle, 4096, "\t");
        if (!$data || count($data) != $expectedCols) {
            continue;
        }
        $id = array_shift($data);
        $rows[$id] = $withNames ? array_combine($header, $data) : $data;
    }
    fclose($handle);

    return $rows;
}

exit(main());