export const showToast = (message) => {
  let toast = document.createElement("div");
  toast.textContent = message;
  toast.className = "toast";
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 2000);
};

export const applyStyle = () => {
  let link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "https://fonts.googleapis.com/icon?family=Material+Icons";
  document.head.appendChild(link);
  let link2 = document.createElement("link");
  link2.rel = "stylesheet";
  link2.href =
    "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0";
  document.head.appendChild(link2);
};
