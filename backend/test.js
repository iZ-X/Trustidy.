const response = await fetch("http://localhost:3000/api/listing-scan", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    listingUrl:
      "https://www.nike.com/t/air-force-1-07-mens-shoes-DZejrQoC/CW2288-111",
  }),
});

const data = await response.json();
console.log(data);
