const response = await fetch("http://localhost:3000/api/listing-scan", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    listingUrl:
      "https://www.nike.com/t/air-jordan-1-high-og-royal-mens-shoes-KVpEM9a8/IQ5495-005",
  }),
});

const data = await response.json();
console.log(data);
