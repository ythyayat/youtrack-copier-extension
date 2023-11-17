import { handleMarkingCard } from "./mark.js";
import { showToast } from "./util.js";

const setListOfTicket = (data) => {
  chrome?.storage?.local.set({
    listOfTicket: data,
  });
};

export const getListOfTicket = (fn) => {
  chrome?.storage?.local.get("listOfTicket", function (result) {
    if (fn) {
      fn(result?.listOfTicket);
    }
  });
};

export const removeListOfTicket = () => {
  chrome.storage.local.remove("listOfTicket", function () {
    const error = chrome.runtime.lastError;
    if (error) {
      console.error(error);
    }
  });
};

export const updateListOfTicket = (data) => {
  getListOfTicket((listOfTicket) => {
    if (listOfTicket === undefined) {
      setListOfTicket([...[], data]);
    } else if (!listOfTicket?.find((item) => item.key === data.key)) {
      setListOfTicket([...listOfTicket, data]);
    } else {
      const filtered = listOfTicket?.filter((item) => item.key !== data.key);
      setListOfTicket(filtered);
      if (filtered?.length === 0) {
        handleMarkingCard();
      }
    }
  });
};

export const copyListOfTicket = () => {
  getListOfTicket((listOfTicket) => {
    let table = document.createElement("table");
    listOfTicket?.forEach((row) => {
      let tr = document.createElement("tr");
      let td = document.createElement("td");
      td.textContent = row?.value;
      tr.appendChild(td);
      table.appendChild(tr);
    });
    document.body.appendChild(table);
    let range = document.createRange();
    range.selectNode(table);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);

    try {
      document.execCommand("copy");
      showToast("Ticket copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
    window.getSelection().removeAllRanges();
    table.remove();
  });
};
