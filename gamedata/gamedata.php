<?php

require_once __DIR__ . '/db2/src/autoload.php';
require_once __DIR__ . '/exeversion.php';

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

    $wowPath = $db2Path . '../Wow.exe';
    if (file_exists($wowPath) && ($version = GetExeVersion($wowPath))) {
        ksort($version);
        echo 'exports["patch"]=' , json_encode(implode('.', array_values($version))), ";\n";
    }

    fwrite(STDERR, "Finding scaling bonuses...\n");
    $reader = new Reader($db2Path . 'ItemBonus.db2');
    $reader->setFieldNames([
        0 => 'params',
        1 => 'bonusid',
        2 => 'changetype',
    ]);
    $distReader = new Reader($db2Path . 'ScalingStatDistribution.db2');

    $a = [];
    foreach ($reader->generateRecords() as $record) {
        if ($record['changetype'] == 13) { // itemlevel scaling dist
            $distRecord = $distReader->getRecord($record['params'][0]);
            if (!$distRecord) {
                fwrite(STDERR, sprintf("Could not find distribution %s for bonus %s\n", $record['params'][0], $record['bonusid']));
            } else {
                $a[$record['bonusid']] = $distRecord[0];
            }
        }
    }
    unset($distReader);
    echo 'exports["scalingBonusMap"]=' , json_encode($a, $jsonFlags), ";\n";

    fwrite(STDERR, "Building curves used in scaling bonuses...\n");
    $curves = array_flip($a);
    $reader = new Reader($db2Path . 'CurvePoint.db2');
    $reader->setFieldNames([
        0 => 'pair',
        1 => 'curve',
        2 => 'step',
    ]);
    $a = [];
    foreach ($reader->generateRecords() as $record) {
        if (isset($curves[$record['curve']])) {
            $a[$record['curve']][$record['step']] = $record['pair'];
        }
    }
    echo 'exports["scalingCurveMap"]=' . json_encode($a, $jsonFlags), ";\n";

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
        $a[$id] = array_values(array_filter($record[1]));
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
        0 => 'spell',
        1 => 'name',
        2 => 'scalingPoints',
        5 => 'effectPoints',
        12 => 'type',
        15 => 'maxLevel',
        16 => 'scalingClass',
    ]);
    $a = [];
    foreach ($reader->generateRecords() as $id => $record) {
        $b = [];
        foreach ($record['type'] as $x => $type) {
            if ($type) {
                $b[] = [$type, $record['spell'][$x], $record['effectPoints'][$x]];
            }
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
