let currentUrl = window.location.href;
const buttonCLoseElement = `<div id="myWidgetStyleButtonCLose"><i class="material-icons" style="font-size:14px;" title='Clear Task'>delete</i></div>`;
const buttonCopyElement = `<div id="myWidgetStyleButtonCopy"><i class="material-icons" style="font-size:14px;" title='Copy Task'>content_copy</i></div>`;
const widgetElement = (count) =>
  `<p class="myWidgetStyle_p">${count} Ticket selected  </p>${buttonCopyElement}${buttonCLoseElement}`;

let link = document.createElement("link");
link.rel = "stylesheet";
link.href = "https://fonts.googleapis.com/icon?family=Material+Icons";
document.head.appendChild(link);
let link2 = document.createElement("link");
link2.rel = "stylesheet";
link2.href =
  "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0";
document.head.appendChild(link2);

function showToast(message) {
  let toast = document.createElement("div");
  toast.textContent = message;
  toast.className = "toast";
  document.body.appendChild(toast);

  setTimeout(function () {
    toast.remove();
  }, 2000);
}

const handleRemoveList = () => {
  let button = document.getElementById("myWidgetStyleButtonCLose");
  if (button) {
    button.addEventListener("click", function () {
      chrome.storage.local.remove("listOfTicket", function () {
        const error = chrome.runtime.lastError;
        if (error) {
          console.error(error);
        }
        handleMarkingCard();
      });
    });
  }
};

const handleCopyList = () => {
  let button = document.getElementById("myWidgetStyleButtonCopy");
  if (button) {
    button.addEventListener("click", function () {
      chrome?.storage?.local.get("listOfTicket", function (result) {
        let table = document.createElement("table");
        result?.listOfTicket?.forEach((row) => {
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
    });
  }
};

const middlewareIsOn = (fn) => {
  chrome?.storage?.local.get("extensionOn", function (resultIsOn) {
    if (resultIsOn?.extensionOn === undefined) {
      chrome?.storage?.local?.set({ extensionOn: true });
      fn();
    }
    if (resultIsOn?.extensionOn) {
      fn();
    }
  });
};

const removeMarkingCard = () => {
  const cards = document.getElementsByClassName("yt-issue-id");
  for (let i = 0; i < cards.length; i++) {
    const element = cards.item(i);
    element?.parentElement?.parentElement?.parentElement?.parentElement?.parentElement?.classList.remove(
      "myWidgetStyle_mark"
    );
  }
};

const handleMarkingCard = () => {
  removeMarkingCard();
  middlewareIsOn(() => {
    chrome?.storage?.local.get("listOfTicket", function (result) {
      const listOfTicket = result?.listOfTicket;
      if (listOfTicket) {
        let count = 0;
        const cards = document.getElementsByClassName("yt-issue-id");
        for (let i = 0; i < cards.length; i++) {
          const element = cards.item(i);
          const key = element.innerText;
          const isFound = listOfTicket.find((item) => item.key === key + " ");
          if (isFound) {
            element?.parentElement?.parentElement?.parentElement?.parentElement?.parentElement?.classList.add(
              "myWidgetStyle_mark"
            );
            count++;
            if (count === listOfTicket.length) {
              break;
            }
          }
        }
      }
    });
  });
};

const initWidget = (count) => {
  if (count) {
    let widget = document.createElement("div");
    widget.id = "myWidget";
    widget.classList.add("myWidgetStyle");
    widget.innerHTML = widgetElement(count);
    document.body.appendChild(widget);
    handleRemoveList();
    handleCopyList();
    handleMarkingCard();
  }
};

document.onreadystatechange = function () {
  if (document.readyState === "complete") {
    middlewareIsOn(() => {
      chrome.storage.local.get("listOfTicket", function (result) {
        if (result?.listOfTicket) {
          initWidget(result?.listOfTicket?.length);
          setTimeout(() => {
            handleMarkingCard();
          }, 4000);
        }
      });
    });
  }
};

const updateListOfTicket = (data) => {
  chrome?.storage?.local.get("listOfTicket", function (result) {
    if (result.listOfTicket === undefined) {
      chrome?.storage?.local.set({
        listOfTicket: [...[], data],
      });
    } else if (!result?.listOfTicket?.find((item) => item.key === data.key)) {
      chrome?.storage?.local.set({
        listOfTicket: [...result.listOfTicket, data],
      });
    } else {
      const filtered = result?.listOfTicket?.filter(
        (item) => item.key !== data.key
      );
      chrome?.storage?.local.set({
        listOfTicket: filtered,
      });
      if (filtered?.length === 0) {
        handleMarkingCard();
      }
    }
  });
};

document.addEventListener("click", function (event) {
  middlewareIsOn(() => {
    let element = event.target;

    if (element.className === "yt-agile-card__summary") {
      const childElement = element.children;

      const data = {
        key: childElement?.[0]?.innerText,
        value: `${childElement?.[0]?.innerText}: ${childElement?.[1]?.innerText}`,
      };
      updateListOfTicket(data);
    } else if (element?.parentElement?.className === "yt-agile-card__summary") {
      const childElement = element.parentElement.children;

      const data = {
        key: childElement?.[0]?.innerText,
        value: `${childElement?.[0]?.innerText}: ${childElement?.[1]?.innerText}`,
      };
      updateListOfTicket(data);
    }
  });
});

chrome.storage.onChanged.addListener(function (changes) {
  for (let key in changes) {
    if (key === "listOfTicket") {
      middlewareIsOn(() => {
        let storageChange = changes[key];
        let widget = document.getElementById("myWidget");

        if (!storageChange?.newValue?.length) {
          if (widget) {
            widget.parentNode.removeChild(widget);
            removeMarkingCard();
          }
          return;
        }

        if (widget) {
          widget.innerHTML = widgetElement(storageChange?.newValue?.length);
          handleRemoveList();
          handleCopyList();
          handleMarkingCard();
        } else {
          initWidget(storageChange?.newValue?.length);
        }
      });
    }
  }
});

chrome.storage.onChanged.addListener(function (changes) {
  for (let key in changes) {
    if (key === "extensionOn") {
      let storageChange = changes[key];
      if (storageChange?.newValue) {
        chrome.storage.local.get("listOfTicket", function (result) {
          if (result?.listOfTicket) {
            initWidget(result?.listOfTicket?.length);
            setTimeout(() => {
              handleMarkingCard();
            }, 4000);
          }
        });
      } else {
        let widget = document.getElementById("myWidget");
        if (widget) {
          widget.remove();
        }
        removeMarkingCard();
      }
    }
  }
});
