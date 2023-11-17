export const middlewareIsOn = (fn) => {
  chrome?.storage?.local.get("extensionOn", function (resultIsOn) {
    if (resultIsOn?.extensionOn === undefined) {
      chrome?.storage?.local?.set({ extensionOn: true });
      fn();
    } else if (resultIsOn?.extensionOn) {
      fn();
    }
  });
};
