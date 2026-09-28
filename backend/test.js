const response = await fetch("http://localhost:3000/api/site-scan", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ url: "https://google.com" }),
});

const data = await response.json();
console.log(data);
