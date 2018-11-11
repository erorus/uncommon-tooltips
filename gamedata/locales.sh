#!/bin/bash

cd "${0%/*}"
locales="$*"
if [ "$locales" == "" ]; then
    locales="enUS deDE esES frFR itIT ptBR ruRU koKR zhTW"
fi
for locale in $locales; do
    echo "Generating $locale"
    php locales.php casc/$locale/DBFilesClient > ../out/locales/$locale.json
done
