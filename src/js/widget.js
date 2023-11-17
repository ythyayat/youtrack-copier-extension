import {
  copyListOfTicket,
  getListOfTicket,
  removeListOfTicket,
} from "./list.js";
import { handleMarkingCard, removeMarkingCard } from "./mark.js";

const buttonCLoseElement =
  '<div id="myWidgetStyleButtonCLose"><i class="material-icons" style="font-size:14px;" title="Clear Task">delete</i></div>';
const buttonCopyElement =
  '<div id="myWidgetStyleButtonCopy"><i class="material-icons" style="font-size:14px;" title="Copy Task">content_copy</i></div>';
const widgetElement = (count) =>
  `<p class="myWidgetStyle_p">${count} Ticket selected  </p>${buttonCopyElement}${buttonCLoseElement}`;

const addRemoveListHandler = () => {
  let button = document.getElementById("myWidgetStyleButtonCLose");
  if (button) {
    button.addEventListener("click", function () {
      removeListOfTicket();
    });
  }
};

const addCopyListHandler = () => {
  let button = document.getElementById("myWidgetStyleButtonCopy");
  if (button) {
    button.addEventListener("click", function () {
      copyListOfTicket();
    });
  }
};

const setWidgetFunction = () => {
  addRemoveListHandler();
  addCopyListHandler();
  handleMarkingCard();
};

const createWidget = (count) => {
  if (count) {
    let widget = document.createElement("div");
    widget.id = "myWidget";
    widget.classList.add("myWidgetStyle");
    widget.innerHTML = widgetElement(count);
    document.body.appendChild(widget);
    setWidgetFunction();
  }
};

export const updateWidget = (count) => {
  let widget = document.getElementById("myWidget");

  if (!count) {
    if (widget) {
      widget.parentNode.removeChild(widget);
      removeMarkingCard();
    }
    return;
  }

  if (widget) {
    widget.innerHTML = widgetElement(count);
    setWidgetFunction();
  } else {
    createWidget(count);
  }
};

export const removeWidget = () => {
  let widget = document.getElementById("myWidget");
  if (widget) {
    widget.remove();
  }
  removeMarkingCard();
};

export const initWidget = () => {
  getListOfTicket((listOfTicket) => {
    if (listOfTicket) {
      createWidget(listOfTicket?.length);
      setTimeout(() => {
        handleMarkingCard();
      }, 4000);
    }
  });
};
