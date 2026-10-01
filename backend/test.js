const response = await fetch("http://localhost:3000/api/listing-scan", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    listingUrl:
      "https://www.gymshark.com/products/gymshark-everyday-holdall-small-bags-black-aw26",
  }),
});

const data = await response.json();
console.log(data);
