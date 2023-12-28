(async () => {
  const src = chrome.runtime.getURL("js/project.min.js");
  const contentScript = await import(src);
  contentScript.main();
})();
