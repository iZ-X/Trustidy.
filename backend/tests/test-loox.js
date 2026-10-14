const url =
  "https://www.gymshark.com/products/gymshark-everyday-holdall-small-bags-black-aw26";

const response = await fetch(url);
const html = await response.text();

const index = html.toLowerCase().indexOf("loox-rating");
console.log("Index of loox-rating:", index);
console.log(html.slice(index - 100, index + 500));

const index2 = html.toLowerCase().indexOf("loox.io");
console.log("Index of loox.io:", index2);
console.log(html.slice(index2 - 100, index2 + 500));
