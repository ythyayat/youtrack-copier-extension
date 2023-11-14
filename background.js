document.getElementById("clickme").addEventListener("click", function () {
  chrome.storage.local.remove("listOfTicket", function () {
    const error = chrome.runtime.lastError;
    if (error) {
      console.error(error);
    }
  });
});

document
  .getElementById("status_extension")
  .addEventListener("click", function () {
    chrome.storage.local.get("extensionOn", function (data) {
      const newStatus = !data.extensionOn;
      chrome.storage.local.set({ extensionOn: newStatus });
      const status = document.getElementById("status_extension");
      status.innerText = newStatus ? "On" : "Off";
      if (newStatus) {
        status.classList.add("on");
      } else {
        status.classList.remove("on");
      }
    });
  });

chrome?.storage?.local.get("extensionOn", function (result) {
  const status = document.getElementById("status_extension");
  status.innerText = result?.extensionOn ? "On" : "Off";
  if (result?.extensionOn) {
    status.classList.add("on");
  } else {
    status.classList.remove("on");
  }
});

const updateCounter = (counter) => {
  document.getElementById("counter").innerText = counter ?? 0;
};

chrome.storage.local.get("listOfTicket", function (result) {
  if (result?.listOfTicket) {
    updateCounter(result?.listOfTicket?.length);
  }
});

const handleCopyList = () => {
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
};

document.getElementById("copy-button").addEventListener("click", function () {
  handleCopyList();
});

chrome.storage.onChanged.addListener(function (changes) {
  for (let key in changes) {
    if (key === "listOfTicket") {
      updateCounter(changes[key]?.newValue?.length);
    }
  }
});
