# Uncommon Tooltips

This repository contains the source code to build uncommon-tooltips.js and its localization json files.

Visit [www.Uncommon-Tooltips.com](https://www.uncommon-tooltips.com/) for more information about what the script can do for your World of Warcraft website.

## Getting Tooltips On Your Site

Ignore all the build stuff below, and just visit [www.Uncommon-Tooltips.com](https://www.uncommon-tooltips.com/) for directions.

## Building the JS

If you don't want to use the pre-built library at the site above, and want to build it yourself, follow these steps.

### 1. Fetch Game Data from CASC

In `gamedata/db2list.txt` is a list of files you need to extract from WoW's CASC archives. CASC extraction tools are not included with this code. 

You should end up with the files in a directory tree that looks like:
```
casc/
     enUS/
          DBFilesClient/
                        ChrClasses.db2
                        ChrRaces.db2
                        (...)
          GameTables/
                     SpellScaling.txt
          Wow.exe
     deDE/
          DBFilesClient/
                        (...)
          GameTables/
                     (...)
          Wow.exe
     esES/
          (...)
```

### 2. Fetch DB2 Parsing Library

Run `git submodule update --init` to fetch the erorus/DB2 submodule.

### 3. Parse Game Data

Non-localized game data is embedded in the final JS, and you can build it with:

`php gamedata/gamedata.php gamedata/casc/enUS/DBFilesClient > src/gamedata.js`

### 4. Generate Localized Strings

Localized names from game data are saved as json files in out/locales. You can build them all with:

`gamedata/locales.sh`

### 5. Sanity Check

`nodejs sanity.js` will run some checks against game data and localizations to make sure the data was extracted correctly.

### 6. Build Final Javascript

`npm install` to get JS dependencies, then  
`npm run build` to build `uncommon-tooltips.js` in the `out/` dir.

## Disclaimer

This work is neither endorsed by nor affiliated with Blizzard Entertainment.

World of Warcraft, Warcraft, Battle.net and Blizzard Entertainment are trademarks or registered trademarks of Blizzard Entertainment, Inc. in the U.S. and/or other countries.

## Thanks

Thanks to Blizzard for their [Battle.net API](https://dev.battle.net/). Thanks to Wowhead for [their epic tooltips](http://www.wowhead.com/tooltips).

## License

Copyright 2017 Gerard Dombroski

Licensed under the Apache License, Version 2.0 (the "License");
you may not use these files except in compliance with the License.
You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.