import {
  copyListOfTicket,
  getListOfTicket,
  removeListOfTicket,
} from "./list.js";

const setExtensionStatus = (status) => {
  const statusElement = document.getElementById("status_extension");
  statusElement.innerText = status ? "On" : "Off";
  if (status) {
    statusElement.classList.add("on");
  } else {
    statusElement.classList.remove("on");
  }
};

document
  .getElementById("status_extension")
  .addEventListener("click", function () {
    chrome.storage.local.get("extensionOn", function (data) {
      const newStatus = !data.extensionOn;
      chrome.storage.local.set({ extensionOn: newStatus });
      setExtensionStatus(newStatus);
    });
  });

chrome?.storage?.local.get("extensionOn", function (result) {
  setExtensionStatus(result?.extensionOn);
});

const updateCounter = (counter) => {
  document.getElementById("counter").innerText = counter ?? 0;
};

getListOfTicket((listOfTicket) => {
  if (listOfTicket) {
    updateCounter(result?.listOfTicket?.length);
  }
});

document.getElementById("copy-button").addEventListener("click", function () {
  copyListOfTicket();
});

document.getElementById("remove-button").addEventListener("click", function () {
  removeListOfTicket();
});

chrome.storage.onChanged.addListener(function (changes) {
  for (let key in changes) {
    if (key === "listOfTicket") {
      updateCounter(changes[key]?.newValue?.length);
    }
  }
});
