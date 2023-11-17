import { handleCardClick } from "./card.js";
import { middlewareIsOn } from "./middleware.js";
import { applyStyle } from "./util.js";
import { initWidget, removeWidget, updateWidget } from "./widget.js";

export const main = () => {
  applyStyle();

  document.onreadystatechange = function () {
    if (document.readyState === "complete") {
      middlewareIsOn(initWidget);
    }
  };

  document.addEventListener("click", function (event) {
    middlewareIsOn(() => handleCardClick(event));
  });

  chrome.storage.onChanged.addListener(function (changes) {
    for (let key in changes) {
      if (key === "listOfTicket") {
        middlewareIsOn(() => {
          let storageChange = changes[key];
          updateWidget(storageChange?.newValue?.length);
        });
      }
    }
  });

  chrome.storage.onChanged.addListener(function (changes) {
    for (let key in changes) {
      if (key === "extensionOn") {
        let storageChange = changes[key];
        if (storageChange?.newValue) {
          initWidget();
        } else {
          removeWidget();
        }
      }
    }
  });
};
