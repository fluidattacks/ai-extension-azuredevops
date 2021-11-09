rm *.vsix
npm install
pushd sorts_extension && npm install && popd
npx tfx extension create --manifest-globs vss-extension.json
cp *.vsix ~/Downloads/
