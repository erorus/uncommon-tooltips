<?php

require_once __DIR__ . '/db2/src/autoload.php';

use \Erorus\DB2\Reader;

function main() {
    global $argv;

    if (!isset($argv[1])) {
        fwrite(STDERR, "Gamedata error: Supply the directory to the DB2 files as the first argument\n");
        return 1;
    }

    $db2Path = $argv[1];
    if (substr($db2Path, -1) != '/') {
        $db2Path .= '/';
    }

    $jsonFlags = JSON_NUMERIC_CHECK | JSON_UNESCAPED_SLASHES;

    /*
    fwrite(STDERR, "Building Skill Map...\n");
    if (!($a = buildKeyValue($db2Path, 'SkillLine.db2', -1, 0))) {
        return 1;
    }
    echo 'exports["skillMap"]=', json_encode($a, $jsonFlags), ";\n";
    */

    fwrite(STDERR, "Building NPC->Species Map...\n");
    if (!($a = buildKeyValue($db2Path, 'BattlePetSpecies.db2', 0, -1))) {
        return 1;
    }
    echo 'exports["speciesMap"]=', json_encode($a, $jsonFlags), ";\n";

    fwrite(STDERR, "Building Toy List...\n");
    if (!($a = buildKeyValue($db2Path, 'Toy.db2', 0, 0))) {
        return 1;
    }
    echo 'exports["toys"]=', json_encode(array_keys($a), $jsonFlags), ";\n";

    fwrite(STDERR, "Building Random Property Points...\n");
    $reader = new Reader($db2Path . 'RandPropPoints.db2');
    $a = [[]];
    foreach ($reader->generateRecords() as $id => $record) {
        $a[$id] = $record;
    }
    ksort($a);
    echo 'exports["randPropPoints"]=', json_encode($a, $jsonFlags), ";\n";

    fwrite(STDERR, "Building Item Random Properties...\n");
    $reader = new Reader($db2Path . 'ItemRandomProperties.db2');
    $a = [];
    foreach ($reader->generateRecords() as $id => $record) {
        $a[$id] = arrayTrim($record[1]);
    }
    ksort($a);
    echo 'exports["itemRandomProperties"]=', json_encode($a, $jsonFlags), ";\n";

    fwrite(STDERR, "Building Item Random Suffix...\n");
    $reader = new Reader($db2Path . 'ItemRandomSuffix.db2');
    $reader->setFieldNames([
        1 => 'enchant',
        2 => 'amount',
    ]);
    $a = [];
    foreach ($reader->generateRecords() as $id => $record) {
        $b = [];
        foreach ($record['enchant'] as $x => $ench) {
            if (!$ench || !$record['amount'][$x]) {
                continue;
            }
            $b[$ench] = $record['amount'][$x];
        }
        if ($b) {
            $a[$id] = $b;
        }
    }
    ksort($a);
    echo 'exports["itemRandomSuffix"]=', json_encode($a, $jsonFlags), ";\n";

    fwrite(STDERR, "Building Item Enchantment...\n");
    $reader = new Reader($db2Path . 'SpellItemEnchantment.db2');
    $reader->setFieldNames([
        0 => 'key',
        5 => 'value',
        12 => 'type',
    ]);
    $a = [];
    foreach ($reader->generateRecords() as $id => $record) {
        $b = [];
        foreach ($record['type'] as $x => $type) {
            if ($type != 5) { // stat change
                continue;
            }
            $b[$record['key'][$x]] = $record['value'][$x];
        }
        if ($b) {
            $a[$id] = $b;
        }
    }
    ksort($a);
    echo 'exports["itemEnchants"]=', json_encode($a, $jsonFlags), ";\n";

    fwrite(STDERR, "Building Crafting Reagent List...\n");
    $reader = new Reader($db2Path . 'ItemSparse.db2');
    $a = [];
    foreach ($reader->generateRecords() as $id => $record) {
        if ($record[0][1] & 0x80000000) {
            $a[$id] = $id;
        }
    }
    ksort($a);
    echo 'exports["craftingReagents"]=', json_encode(array_keys($a), $jsonFlags), ";\n";

    return 0;
}

function arrayTrim($a) {
    while (count($a) && $a[count($a)-1] == 0) {
        array_pop($a);
    }
    return $a;
}

function buildKeyValue($db2Path, $db2File, $keyIndex, $valueIndex) {
    try {
        $reader = new Reader($db2Path.$db2File);
    } catch (\Exception $e) {
        fwrite(STDERR, "Gamedata error: " . $e->getMessage() . "\n");
        return false;
    }

    $a = [];
    foreach ($reader->generateRecords() as $id => $record) {
        $key = $keyIndex >= 0 ? $record[$keyIndex] : $id;
        $value = $valueIndex >= 0 ? $record[$valueIndex] : $id;

        $a[$key] = $value;
    }
    ksort($a);

    return $a;
}

exit(main());
