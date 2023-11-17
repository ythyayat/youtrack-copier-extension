import { updateListOfTicket } from "./list.js";

export const handleCardClick = (e) => {
  let element = e.target;

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
};
