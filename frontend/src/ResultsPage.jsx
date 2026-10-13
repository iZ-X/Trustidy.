import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Link } from "react-router-dom";

function ResultPage() {
  const { id } = useParams();
  const location = useLocation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  useEffect(() => {
    async function fetchData() {
      const isListing = location.state?.isListing;

      async function tryFetch(endpoint) {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}${endpoint}/${id}`,
        );
        return response.ok ? await response.json() : null;
      }

      let result = null;

      if (isListing === true) {
        result = await tryFetch("/api/listing-scan");
      } else if (isListing === false) {
        result = await tryFetch("/api/site-scan");
      } else {
        result = await tryFetch("/api/listing-scan");
        if (!result) {
          result = await tryFetch("/api/site-scan");
        }
      }

      if (!result) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      setData(result);
      setLoading(false);
    }

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="bg-paper min-h-screen flex flex-col items-center justify-start p-2 px-4">
        <h1 className="text-2xl sm:text-3xl tracking-wider font-semibold h-[10%] mb-2 flex flex-col items-center justify-center font-averia">
          Trustidy
        </h1>
        <section className="w-full flex-1 flex flex-col items-center justify-center font-quicksand py-4">
          <div className="rounded-lg border-2 border-ink3 w-[95%] sm:w-[85%] xl:w-[70%] h-auto xl:h-[70%] bg-white flex flex-col xl:flex-row items-center gap-4 justify-between p-4 sm:p-6 shadow-md">
            <div className="w-full xl:w-[99%] h-auto xl:h-full flex flex-col xl:flex-row items-center justify-between gap-4">
              <div className="bg-ink2 w-full xl:w-[28%] rounded-md h-48 xl:h-full flex flex-col items-center justify-start py-4 xl:py-8">
                <div className="bg-slate/20 bg-[length:200%_100%] animate-shimmer w-[85%] h-[60%] rounded-lg"></div>
                <div className="bg-slate/20 bg-[length:200%_100%] animate-shimmer w-[90%] h-6 rounded mt-5"></div>
              </div>
              <div className="w-full xl:w-[70%] h-auto xl:h-full grid grid-cols-1 md:grid-cols-2 xl:grid-flow-col xl:grid-cols-3 xl:grid-rows-6 px-2 sm:px-8 py-4 sm:py-8 gap-4">
                <div className="rounded-lg border-2 border-ink3 bg-white h-32 xl:h-auto xl:row-span-5 xl:col-span-1 p-4">
                  <div className="bg-slate/20 bg-[length:200%_100%] animate-shimmer w-full h-full rounded"></div>
                </div>
                <div className="rounded-lg border-2 border-ink3 bg-white h-16 xl:h-auto">
                  <div className="bg-slate/20 bg-[length:200%_100%] animate-shimmer w-full h-full rounded"></div>
                </div>
                <div className="rounded-lg border-2 border-ink3 bg-white h-24 xl:h-auto xl:row-span-2 xl:col-span-2 p-4">
                  <div className="bg-slate/20 bg-[length:200%_100%] animate-shimmer w-full h-full rounded"></div>
                </div>
                <div className="rounded-lg border-2 border-ink3 bg-white h-24 xl:h-auto xl:row-span-3 xl:col-span-1 p-4">
                  <div className="bg-slate/20 bg-[length:200%_100%] animate-shimmer w-full h-full rounded"></div>
                </div>
                <div className="rounded-lg border-2 border-ink3 bg-white h-16 xl:h-auto">
                  <div className="bg-slate/20 bg-[length:200%_100%] animate-shimmer w-full h-full rounded"></div>
                </div>
                <div className="rounded-lg border-2 border-ink3 bg-white h-24 xl:h-auto xl:row-span-4 xl:col-span-1 p-4">
                  <div className="bg-slate/20 bg-[length:200%_100%] animate-shimmer w-full h-full rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (notFound || !data) {
    return (
      <div className="p-4 text-center">
        <p>No scan data found.</p>
        <Link to="/" className="text-blue-600 underline">
          Go back home
        </Link>
      </div>
    );
  }

  const isListing = data.listingUrl !== undefined;

  function showPrevImage() {
    setCurrentImgIndex((prev) =>
      prev === 0 ? data.productImage.length - 1 : prev - 1,
    );
  }

  function showNextImage() {
    setCurrentImgIndex((prev) =>
      prev === data.productImage.length - 1 ? 0 : prev + 1,
    );
  }

  return (
    <div className="bg-paper min-h-screen flex flex-col items-center justify-start p-2 px-4">
      <h1 className="text-2xl sm:text-3xl tracking-wider font-semibold mb-2 flex flex-col items-center justify-center font-averia pt-2">
        Trustidy
      </h1>

      {isListing ? (
        <section className="w-full flex-1 flex flex-col items-center justify-center font-quicksand py-4">
          <div className="rounded-lg border-2 border-ink3 w-[95%] sm:w-[85%] xl:w-[70%] h-auto xl:h-[70%] bg-white flex flex-col xl:flex-row items-center gap-4 justify-between p-4 sm:p-6 shadow-md">
            <div className="w-full xl:w-[99%] h-auto xl:h-full flex flex-col xl:flex-row items-center justify-between gap-4">
              <div className="bg-ink2 w-full xl:w-[28%] rounded-md h-auto xl:h-full flex flex-col items-center justify-start py-4 xl:py-8">
                <div className="bg-black w-[85%] h-48 sm:h-56 xl:h-[60%] rounded-lg">
                  <img
                    src={data.productImage[currentImgIndex]}
                    alt={`Product ${currentImgIndex + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  ></img>
                </div>
                <div className="w-[90%] p-2 text-base sm:text-lg flex flex-row items-center justify-center gap-4 mt-3 text-ink3">
                  <button className="cursor-pointer" onClick={showPrevImage}>
                    &lt;
                  </button>
                  <h2>
                    {currentImgIndex + 1} / {data.productImage.length}
                  </h2>
                  <button className="cursor-pointer" onClick={showNextImage}>
                    &gt;
                  </button>
                </div>
                <div className="w-[90%] text-base sm:text-xl flex flex-col p-2 gap-4 pt-2">
                  <p className="text-ink break-words">
                    Link Scanned: {data.listingUrl}
                  </p>
                </div>
              </div>
              <div className="w-full xl:w-[70%] h-auto xl:h-full grid grid-cols-1 md:grid-cols-2 xl:grid-flow-col xl:grid-cols-3 xl:grid-rows-6 px-2 sm:px-8 py-4 sm:py-8 gap-4">
                <div className="rounded-lg border-2 border-ink3 bg-white xl:row-span-5 xl:col-span-1 p-4">
                  <div className="w-full h-full flex flex-col items-center justify-center">
                    <div className="w-full">
                      <span className="text-sm sm:text-base xl:text-lg text-black rounded-lg">
                        This score reflects the listing's average rating, how
                        many reviews it has, whether a return policy is listed,
                        and whether the listing uses urgency language like "only
                        a few left."
                      </span>
                    </div>
                    <div className="w-full h-6 xl:h-[40%]"></div>
                    <div className="w-full flex flex-col items-start justify-end">
                      <div className="flex flex-row items-end justify-center gap-2">
                        <h1 className="text-black text-5xl sm:text-7xl xl:text-9xl">
                          {data.trustScore}
                        </h1>
                        <span className="text-ink font-semibold text-base sm:text-xl">
                          trust score
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg border-2 border-ink3 bg-white flex items-center justify-center text-base sm:text-lg p-4">
                  <Link to="/">← return to Scan another</Link>
                </div>
                <div className="rounded-lg border-2 border-ink3 bg-white xl:row-span-2 xl:col-span-2 p-4">
                  <div className="w-full h-full flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-0">
                    <div className="w-full sm:w-[50%] h-full flex flex-col items-start justify-end gap-2 sm:gap-4">
                      <h2 className="text-lg sm:text-2xl w-full flex items-end">
                        Reviews:
                      </h2>
                      <div className="w-full flex flex-row items-end justify-start">
                        <h1 className="text-4xl sm:text-7xl">
                          {data.reviewCount}
                        </h1>
                        <span className="text-ink font-semibold">total</span>
                      </div>
                    </div>
                    <div className="w-full sm:w-[50%] h-full flex flex-col items-start justify-end gap-2 sm:gap-4">
                      <h2 className="text-lg sm:text-2xl w-full flex items-end">
                        Average Rating:
                      </h2>
                      <div className="w-full flex flex-row items-end justify-start">
                        <h1 className="text-4xl sm:text-7xl">
                          {data.averageRating}
                        </h1>
                        <span className="text-ink font-semibold">
                          avg rating
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg border-2 border-ink3 bg-white xl:row-span-3 xl:col-span-1 p-4">
                  <div className="w-full h-full flex flex-col items-start justify-center gap-4">
                    <div className="w-full flex flex-col items-start justify-end gap-2 sm:gap-4">
                      <h2 className="text-lg sm:text-2xl w-full flex items-end">
                        Price:
                      </h2>
                      <div className="w-full flex flex-row items-end justify-start">
                        <h1 className="text-3xl sm:text-5xl">
                          ${data.currentPrice}
                        </h1>
                      </div>
                    </div>
                    <div className="w-full flex flex-col items-start justify-end gap-2 sm:gap-4">
                      <h2 className="text-lg sm:text-2xl w-full flex items-end">
                        Price Range Seen:
                      </h2>
                      <div className="w-full flex flex-row flex-wrap items-end justify-start gap-2">
                        <h1 className="text-lg sm:text-2xl flex flex-row items-center">
                          ${data.priceHistoryLow} - ${data.priceHistoryHigh}
                        </h1>
                        <span className="text-xs text-ink font-semibold">
                          (low - high)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg border-2 border-ink3 bg-white flex flex-row items-center justify-center gap-2 p-4">
                  <div className="bg-verified w-3.5 h-3.5 rounded-full text-lg"></div>
                  <span
                    className={
                      data.scanStatus === "complete"
                        ? "text-verified"
                        : data.scanStatus === "partial"
                          ? "text-seal"
                          : "text-flag"
                    }
                  >
                    {data.scanStatus}
                  </span>
                </div>
                <div className="rounded-lg border-2 border-ink3 bg-white xl:row-span-4 xl:col-span-1 p-4">
                  <div className="w-full h-full flex flex-col items-start justify-center gap-4">
                    <div className="w-full flex flex-col items-start justify-end gap-2 sm:gap-4">
                      <h2 className="text-lg sm:text-2xl w-full flex items-end">
                        Reviews:
                      </h2>
                      <div className="w-full flex flex-col items-start justify-start">
                        <h1 className="text-base sm:text-xl">
                          Suspicious date clustering:{" "}
                          {data.reviewDateClustering === null
                            ? "Not enough data"
                            : data.reviewDateClustering
                              ? "Yes"
                              : "No"}
                        </h1>
                        <h1 className="text-base sm:text-xl">
                          Generic review score:{" "}
                          {data.genericReviewScore === null
                            ? "Not enough data"
                            : `${data.genericReviewScore}%`}
                        </h1>
                      </div>
                    </div>
                    <div className="w-full flex flex-col items-start justify-end gap-2 sm:gap-4 mt-4 xl:mt-8">
                      <h2 className="text-lg sm:text-2xl w-full flex items-end">
                        Red Flags:
                      </h2>
                      <div className="w-full flex flex-col items-start justify-start">
                        <h1 className="text-base sm:text-xl">
                          Urgency Language:{" "}
                          {data.hasUrgencyLanguage === null
                            ? "Not checked"
                            : data.hasUrgencyLanguage
                              ? "⚠️ Detected"
                              : "None detected"}
                        </h1>
                        <h1 className="text-base sm:text-xl">
                          Return Policy:{" "}
                          {data.hasReturnPolicy === null
                            ? "Not checked"
                            : data.hasReturnPolicy
                              ? "Present"
                              : "Not found"}
                        </h1>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="w-full flex-1 flex flex-col items-center justify-center font-quicksand py-4">
          <div className="rounded-lg border-2 border-ink3 w-[95%] sm:w-[85%] xl:w-[70%] h-auto xl:h-[70%] bg-white flex flex-col xl:flex-row items-center gap-4 justify-between p-4 sm:p-6 shadow-md">
            <div className="w-full xl:w-[99%] h-auto xl:h-full flex flex-col xl:flex-row items-center justify-between gap-4">
              <div className="bg-ink2 w-full xl:w-[28%] rounded-md h-auto xl:h-full flex flex-col items-center justify-start py-4 xl:py-8">
                <div className="bg-black w-[85%] h-48 sm:h-56 xl:h-[60%] rounded-lg">
                  <img
                    src={data.previewImage}
                    className="w-full h-full object-cover rounded-lg"
                  ></img>
                </div>
                <div className="w-[90%] text-base sm:text-xl flex flex-col p-2 gap-4 pt-2">
                  <p className="text-ink break-words">
                    Link Scanned: {data.url}
                  </p>
                </div>
              </div>
              <div className="w-full xl:w-[70%] h-auto xl:h-full grid grid-cols-1 md:grid-cols-2 xl:grid-flow-col xl:grid-cols-3 xl:grid-rows-6 px-2 sm:px-8 py-4 sm:py-8 gap-4">
                <div className="rounded-lg border-2 border-ink3 bg-white xl:row-span-5 xl:col-span-1 p-4">
                  <div className="w-full h-full flex flex-col items-center justify-center">
                    <div className="w-full">
                      <span className="text-sm sm:text-base xl:text-lg text-black rounded-lg">
                        This score reflects the domain's age, SSL certificate,
                        Instagram presence, social media reach, and whether
                        Google has flagged the site as unsafe.
                      </span>
                    </div>
                    <div className="w-full h-6 xl:h-[40%]"></div>
                    <div className="w-full flex flex-col items-start justify-end">
                      <div className="flex flex-row items-end justify-center gap-2">
                        <h1 className="text-black text-5xl sm:text-7xl xl:text-9xl">
                          {data.trustScore}
                        </h1>
                        <span className="text-ink font-semibold text-base sm:text-xl">
                          trust score
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg border-2 border-ink3 bg-white flex items-center justify-center text-base sm:text-lg p-4">
                  <Link to="/">← return to Scan another</Link>
                </div>
                <div className="rounded-lg border-2 border-ink3 bg-white xl:row-span-2 xl:col-span-2 p-4">
                  <div className="w-full h-full flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-0">
                    <div className="w-full sm:w-[50%] h-full flex flex-col items-start justify-end gap-2 sm:gap-4">
                      <h2 className="text-lg sm:text-2xl w-full flex items-end">
                        Domain Age:
                      </h2>
                      <div className="w-full flex flex-row items-end justify-start">
                        <h1 className="text-4xl sm:text-7xl">
                          {data.domainAge}
                        </h1>
                        <span className="text-ink font-semibold">years</span>
                      </div>
                    </div>
                    <div className="w-full sm:w-[50%] h-full flex flex-col items-start justify-end gap-2 sm:gap-4">
                      <h2 className="text-lg sm:text-2xl w-full flex items-end">
                        SSL Issuer:
                      </h2>
                      <div className="w-full flex flex-row items-end justify-start">
                        <h1 className="text-2xl sm:text-4xl break-words">
                          {data.sslIssuer}
                        </h1>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg border-2 border-ink3 bg-white xl:row-span-3 xl:col-span-1 p-4">
                  <div className="w-full h-full flex flex-col items-start justify-center gap-4">
                    <div className="w-full flex flex-col items-start justify-end gap-2 sm:gap-4">
                      <h2 className="text-lg sm:text-2xl w-full flex items-end">
                        Flagged Unsafe:
                      </h2>
                      <div className="w-full flex flex-row items-end justify-start">
                        <h1 className="text-2xl sm:text-5xl">
                          {data.isFlaggedUnsafe === null
                            ? "Not checked"
                            : data.isFlaggedUnsafe
                              ? "⚠️ Yes"
                              : "No"}
                        </h1>
                      </div>
                    </div>
                    <div className="w-full flex flex-col items-start justify-end gap-2 sm:gap-4">
                      <h2 className="text-lg sm:text-2xl w-full flex items-end">
                        Threat Type:
                      </h2>
                      <div className="w-full flex flex-row items-end gap-4 justify-start">
                        <h1 className="text-2xl sm:text-5xl">
                          {data.threatType ?? "None!"}
                        </h1>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg border-2 border-ink3 bg-white flex flex-row items-center justify-center gap-2 p-4">
                  <div className="bg-verified w-3.5 h-3.5 rounded-full text-lg"></div>
                  <span
                    className={
                      data.scanStatus === "complete"
                        ? "text-verified"
                        : data.scanStatus === "partial"
                          ? "text-seal"
                          : "text-flag"
                    }
                  >
                    {data.scanStatus}
                  </span>
                </div>
                <div className="rounded-lg border-2 border-ink3 bg-white xl:row-span-4 xl:col-span-1 p-4">
                  <div className="w-full h-full flex flex-col items-start justify-center gap-4">
                    <div className="w-full flex flex-col items-start justify-end gap-2 sm:gap-4">
                      <h2 className="text-lg sm:text-2xl w-full flex items-end">
                        Registrar:
                      </h2>
                      <div className="w-full flex flex-col items-start justify-start">
                        <h1 className="text-base sm:text-xl break-words">
                          Name: {data.registrarName}
                        </h1>
                      </div>
                    </div>
                    <div className="w-full flex flex-col items-start justify-end gap-2 sm:gap-4 mt-4 xl:mt-8">
                      <h2 className="text-lg sm:text-2xl w-full flex items-end">
                        Social Media:
                      </h2>
                      <div className="w-full flex flex-col items-start justify-start">
                        <h1 className="text-base sm:text-xl">
                          Has an Instagram: {data.hasInstagram ? "Yes" : "No"}
                        </h1>
                        <h1 className="text-base sm:text-xl">
                          Social Media Accounts: {data.socialProfileCount}
                        </h1>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default ResultPage;
