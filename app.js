(async () => {
  const src = chrome.runtime.getURL("src/js/index.js");
  const contentScript = await import(src);
  contentScript.main();
})();
