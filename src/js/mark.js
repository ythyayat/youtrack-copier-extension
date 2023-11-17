import { getListOfTicket } from "./list.js";
import { middlewareIsOn } from "./middleware.js";

export const removeMarkingCard = () => {
  const cards = document.getElementsByClassName("yt-issue-id");
  for (let i = 0; i < cards.length; i++) {
    const element = cards.item(i);
    element?.parentElement?.parentElement?.parentElement?.parentElement?.parentElement?.classList.remove(
      "myWidgetStyle_mark"
    );
  }
};

export const handleMarkingCard = () => {
  removeMarkingCard();
  middlewareIsOn(() => {
    getListOfTicket((listOfTicket) => {
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
