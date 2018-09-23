<?php

// http://stackoverflow.com/questions/2029409/get-version-of-exe-via-php
function GetExeVersion($FileName)
{

    // TODO
    return [8,0,1,27843];

    $handle = fopen($FileName, 'rb');
    if (!$handle) {
        return false;
    }
    $Header = fread($handle, 64);
    if (substr($Header, 0, 2) != 'MZ') {
        return false;
    }
    $PEOffset = unpack("V", substr($Header, 60, 4));
    if ($PEOffset[1] < 64) {
        return false;
    }
    fseek($handle, $PEOffset[1], SEEK_SET);
    $Header = fread($handle, 24);
    if (substr($Header, 0, 2) != 'PE') {
        return false;
    }
    $Machine = unpack("v", substr($Header, 4, 2));
    if ($Machine[1] != 332) {
        return false;
    }
    $NoSections = unpack("v", substr($Header, 6, 2));
    $OptHdrSize = unpack("v", substr($Header, 20, 2));
    fseek($handle, $OptHdrSize[1], SEEK_CUR);
    $ResFound = false;
    for ($x = 0; $x < $NoSections[1]; $x++) {
        $SecHdr = fread($handle, 40);
        if (substr($SecHdr, 0, 5) == '.rsrc') { //resource section
            $ResFound = true;
            break;
        }
    }
    if (!$ResFound) {
        return false;
    }
    $InfoVirt = unpack("V", substr($SecHdr, 12, 4));
    $InfoSize = unpack("V", substr($SecHdr, 16, 4));
    $InfoOff = unpack("V", substr($SecHdr, 20, 4));
    fseek($handle, $InfoOff[1], SEEK_SET);
    $Info = fread($handle, $InfoSize[1]);
    $NumDirs = unpack("v", substr($Info, 14, 2));
    $InfoFound = false;
    for ($x = 0; $x < $NumDirs[1]; $x++) {
        $Type = unpack("V", substr($Info, ($x * 8) + 16, 4));
        if ($Type[1] == 16) { //FILEINFO resource
            $InfoFound = true;
            $SubOff = unpack("V", substr($Info, ($x * 8) + 20, 4));
            break;
        }
    }
    if (!$InfoFound) {
        return false;
    }
    $SubOff[1] &= 0x7fffffff;
    $InfoOff = unpack("V", substr($Info, $SubOff[1] + 20, 4)); //offset of first FILEINFO
    $InfoOff[1] &= 0x7fffffff;
    $InfoOff = unpack("V", substr($Info, $InfoOff[1] + 20, 4)); //offset to data
    $DataOff = unpack("V", substr($Info, $InfoOff[1], 4));
    $DataSize = unpack("V", substr($Info, $InfoOff[1] + 4, 4));
    $CodePage = unpack("V", substr($Info, $InfoOff[1] + 8, 4));
    $DataOff[1] -= $InfoVirt[1];
    $Version = unpack("v4", substr($Info, $DataOff[1] + 48, 8));
    $x = $Version[2];
    $Version[2] = $Version[1];
    $Version[1] = $x;
    $x = $Version[4];
    $Version[4] = $Version[3];
    $Version[3] = $x;
    return $Version;
}

