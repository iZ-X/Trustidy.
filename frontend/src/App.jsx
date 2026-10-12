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
    if (!url.trim()) {
      alert("Please enter a url.");
      return;
    }

    let normalizedUrl = url.trim();
    if (
      !normalizedUrl.startsWith("http://") &&
      !normalizedUrl.startsWith("https://")
    ) {
      normalizedUrl = `https://${normalizedUrl}`;
    }

    try {
      new URL(normalizedUrl);
    } catch (e) {
      alert("Please enter a valid url (e.g http://nike.com).");
      return;
    }

    try {
      const endpoint = isListingUrl(normalizedUrl)
        ? "/api/listing-scan"
        : "/api/site-scan";
      const bodyKey = isListingUrl(normalizedUrl) ? "listingUrl" : "url";

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}${endpoint}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ [bodyKey]: normalizedUrl }),
        },
      );

      if (!response.ok) {
        alert("Something went wrong whilst scanning, try again.");
        return;
      }

      const data = await response.json();
      navigate(`/results/${data.id}`, {
        state: { isListing: isListingUrl(normalizedUrl) },
      });
    } catch (error) {
      alert(
        "Couldn't reach the server. Please check your connection and try again.",
      );
    }
  }

  return (
    <div className="bg-paper h-screen flex flex-col items-center justify-start p-2 px-4">
      <h1 className="text-3xl tracking-wider font-semibold  h-[10%] mb-2 flex flex-col items-center justify-center font-averia">
        Trustidy
      </h1>
      <section className="w-full flex-1 flex flex-col items-center justify-center">
        <div className=" rounded-2xl border-2 border-ink3 w-[70%] h-[28%] bg-white flex flex-row items-center gap-4 justify-between p-6 shadow-md">
          <div className=" w-[99%] h-full p-4 flex flex-col items-center justify-center">
            <input
              className="font-quicksand w-full h-[75%] text-2xl text-ink2 focus:outline-none focus:ring-0 "
              type="text"
              placeholder="Link here: (e.g, nike.com)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            ></input>
            <div className=" w-full h-[25%] flex flex-row items-center justify-between px-4 py-2">
              <button
                title="Add Image"
                className="hover:text-ink2  transition-colors duration-500 cursor-pointer text-ink text-3xl text-center  w-[4.5%] h-[75%] flex items-center justify-center"
              >
                +
              </button>
              <button
                title="Submit"
                onClick={handleSubmit}
                className="hover:bg-blue-500 transition-colors duration-500 cursor-pointer text-paper2 text-3xl font-semibold rounded-sm flex items-center justify-center bg-blue-400 w-[2.5%] h-[99%]"
              >
                ↑
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
