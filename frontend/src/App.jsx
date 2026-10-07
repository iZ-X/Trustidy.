import { useState } from "react";
import { useNavigate } from "react-router-dom";

function isListingUrl(url) {
  const listingPatterns = ["/listing/", "/products/", "/t/", "/dp/", "/itm/"];
  return listingPatterns.some((pattern) => url.includes(pattern));
}

function App() {
  const [url, setUrl] = useState("");
  const navigate = useNavigate();

  async function handleSubmit() {
    const endpoint = isListingUrl(url) ? "/api/listing-scan" : "/api/site-scan";
    const bodyKey = isListingUrl(url) ? "listingUrl" : "url";

    const response = await fetch(`http://localhost:3000${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [bodyKey]: url }),
    });

    const data = await response.json();
    navigate("/results", { state: data });
  }

  return (
    <div className="h-screen flex flex-col items-center justify-start p-2 px-4">
      <h1 className="text-3xl font-bold mb-2">Trustidy</h1>
      <section className="w-full flex-1 flex flex-col items-center justify-center">
        <div className="bg-red-200 w-[90%] h-[26%] flex flex-row items-center gap-4 justify-between p-4">
          <div className="bg-amber-300 w-[75%] h-full p-4 flex items-center justify-center">
            <input
              className=" w-full h-full"
              type="text"
              placeholder="Link here."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            ></input>
          </div>
          <button className="w-[25%] h-full bg-amber-50" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </section>
    </div>
  );
}

export default App;
