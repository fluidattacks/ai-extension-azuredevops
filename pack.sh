rm *.vsix
pushd sorts_extension && npm install && popd
npx tfx-cli@0.9.3 extension create --manifest-globs vss-extension.json
cp *.vsix ~/Downloads/
