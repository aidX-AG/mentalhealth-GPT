export default function transformer(fileInfo, api) {
  const j = api.jscodeshift;
  const root = j(fileInfo.source);

  // Suche nach JSXText (reiner Text zwischen Tags)
  root.find(j.JSXText)
    .filter(path => path.value.value.trim().length > 1)
    .forEach(path => {
      const text = path.value.value.trim();
      // Wrap mit t("…") – nur im Dry-Run reporten
      console.log(`${fileInfo.path}:${path.value.loc.start.line} => ${text}`);
    });

  return fileInfo.source; // unverändert zurückgeben
}
