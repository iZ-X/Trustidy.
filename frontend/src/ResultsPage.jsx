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
      <div className="bg-paper h-screen flex flex-col items-center justify-start p-2 px-4">
        <h1 className="text-3xl tracking-wider font-semibold h-[10%] mb-2 flex flex-col items-center justify-center font-averia">
          Trustidy
        </h1>
        <section className="w-full flex-1 flex flex-col items-center justify-center font-quicksand">
          <div className="rounded-lg border-2 border-ink3 w-[70%] h-[70%] bg-white flex flex-row items-center gap-4 justify-between p-6 shadow-md">
            <div className="w-[99%] h-full flex flex-row items-center justify-between gap-4">
              <div className="bg-ink2 w-[28%] rounded-md h-full flex flex-col items-center justify-start py-8">
                <div className="bg-slate/20 bg-[length:200%_100%] animate-shimmer w-[85%] h-[60%] rounded-lg"></div>
                <div className="bg-slate/20 bg-[length:200%_100%] animate-shimmer w-[90%] h-6 rounded mt-5"></div>
              </div>
              <div className="w-[70%] h-full grid grid-flow-col grid-cols-3 grid-rows-6 px-8 py-8 gap-4">
                <div className="rounded-lg border-2 border-ink3 bg-white row-span-5 col-span-1 p-4">
                  <div className="bg-slate/20 bg-[length:200%_100%] animate-shimmer w-full h-full rounded"></div>
                </div>
                <div className="rounded-lg border-2 border-ink3 bg-white">
                  <div className="bg-slate/20 bg-[length:200%_100%] animate-shimmer w-full h-full rounded"></div>
                </div>
                <div className="rounded-lg border-2 border-ink3 bg-white row-span-2 col-span-2 p-4">
                  <div className="bg-slate/20 bg-[length:200%_100%] animate-shimmer w-full h-full rounded"></div>
                </div>
                <div className="rounded-lg border-2 border-ink3 bg-white row-span-3 col-span-1 p-4">
                  <div className="bg-slate/20 bg-[length:200%_100%] animate-shimmer w-full h-full rounded"></div>
                </div>
                <div className="rounded-lg border-2 border-ink3 bg-white">
                  <div className="bg-slate/20 bg-[length:200%_100%] animate-shimmer w-full h-full rounded"></div>
                </div>
                <div className="rounded-lg border-2 border-ink3 bg-white row-span-4 col-span-1 p-4">
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
    <div className="bg-paper h-screen flex flex-col items-center justify-start p-2 px-4">
      <h1 className="text-3xl tracking-wider font-semibold  h-[10%] mb-2 flex flex-col items-center justify-center font-averia">
        Trustidy
      </h1>

      {isListing ? (
        <>
          <section className="w-full flex-1 flex flex-col items-center justify-center font-quicksand">
            <div className=" rounded-lg border-2 border-ink3 w-[70%] h-[70%] bg-white flex flex-row items-center gap-4 justify-between p-6 shadow-md">
              <div className=" w-[99%] h-full  flex flex-row items-center justify-between gap-4">
                <div className="bg-ink2 w-[28%] rounded-md h-full flex flex-col items-center justify-start py-8">
                  <div className="bg-black w-[85%] h-[60%] rounded-lg">
                    <img
                      src={data.productImage[currentImgIndex]}
                      alt={`Product ${currentImgIndex + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                    ></img>
                  </div>
                  <div className="w-[90%] h-[7%]  p-2 text-lg flex flex-row items-center justify-center gap-4 mt-5 text-ink3">
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
                  <div className="w-[90%] h-[35%]  text-xl flex flex-col p-2 gap-4 pt-2">
                    <p className="text-ink overflow-auto">
                      Link Scanned: {data.listingUrl}
                    </p>
                  </div>
                </div>
                <div className="w-[70%] h-full  grid grid-flow-col grid-cols-3 grid-rows-6 px-8 py-8 gap-4">
                  <div className="rounded-lg border-2 border-ink3 bg-white row-span-5 col-span-1 p-4">
                    <div className="w-full h-full flex flex-col items-center justify-center">
                      <div className=" w-full h-[25%]">
                        <span className="text-lg text-black rounded-lg">
                          This score reflects the listing’s average rating, how
                          many reviews it has, whether a return policy is
                          listed, and whether the listing uses urgency language
                          like “only a few left.”
                        </span>
                      </div>
                      <div className=" w-full h-[40%]"></div>
                      <div className=" w-full h-[35%] flex flex-col items-start justify-end">
                        <div className="flex flex-row items-end justify-center gap-2">
                          <h1 className="text-black text-9xl">
                            {data.trustScore}
                          </h1>
                          <span className="text-ink font-semibold text-xl">
                            trust score
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-lg border-2 border-ink3 bg-white flex items-center justify-center text-lg">
                    <Link to="/">← return to Scan another</Link>
                  </div>
                  <div className="rounded-lg border-2 border-ink3 bg-white row-span-2 col-span-2 p-4">
                    <div className="w-full h-full  flex flex-row items-center justify-center">
                      <div className="w-[50%] h-full  flex flex-col items-start justify-end gap-4">
                        <h2 className="text-2xl w-full h-[60%]  flex items-end">
                          Reviews:
                        </h2>
                        <div className="w-full h-[40%]  flex flex-row items-end justify-start">
                          <h1 className="text-7xl">{data.reviewCount}</h1>
                          <span className="text-ink font-semibold">total</span>
                        </div>
                      </div>
                      <div className="w-[50%] h-full flex flex-col items-start justify-end gap-4">
                        <h2 className="text-2xl w-full h-[60%]  flex items-end">
                          Average Rating:
                        </h2>
                        <div className="w-full h-[40%]  flex flex-row items-end justify-start">
                          <h1 className="text-7xl">{data.averageRating}</h1>
                          <span className="text-ink font-semibold">
                            avg rating
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-lg border-2 border-ink3 bg-white row-span-3 col-span-1 p-4">
                    <div className="w-full h-full  flex flex-col items-start justify-center">
                      <div className="h-[50%] w-full flex flex-col items-start justify-end gap-4">
                        <h2 className="text-2xl w-full h-[60%]  flex items-end">
                          Price:
                        </h2>
                        <div className="w-full h-[40%]  flex flex-row items-end justify-start">
                          <h1 className="text-5xl">${data.currentPrice}</h1>
                          <p></p>
                        </div>
                      </div>
                      <div className="h-[50%] w-full  flex flex-col items-start justify-end gap-4">
                        <h2 className="text-2xl w-full h-[60%]  flex items-end">
                          Price Range Seen:
                        </h2>
                        <div className="w-full h-[40%]  flex flex-row items-end justify-start gap-2 ">
                          <h1 className="text-2xl flex flex-row items-center">
                            ${data.priceHistoryLow} - ${data.priceHistoryHigh}
                          </h1>
                          <span className="font-xs text-ink font-semibold">
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
                  <div className="rounded-lg border-2 border-ink3 bg-white row-span-4 col-span-1 p-4">
                    <div className="w-full h-full  flex flex-col items-start justify-center gap-4">
                      <div className="h-[50%] w-full flex flex-col items-start justify-end gap-4">
                        <h2 className="text-2xl w-full h-[30%]  flex items-end">
                          Reviews:
                        </h2>
                        <div className="w-full h-[70%]   flex flex-col items-start justify-start">
                          <h1 className="text-xl">
                            Suspicious date clustering:{" "}
                            {data.reviewDateClustering === null
                              ? "Not enough data"
                              : data.reviewDateClustering
                                ? "Yes"
                                : "No"}
                          </h1>
                          <h1 className="text-xl">
                            Generic review score:{" "}
                            {data.genericReviewScore === null
                              ? "Not enough data"
                              : `${data.genericReviewScore}%`}
                          </h1>
                        </div>
                      </div>
                      <div className="h-[50%] w-full  flex flex-col items-start justify-end gap-4 mt-8">
                        <h2 className="text-2xl w-full h-[30%]  flex items-end">
                          Red Flags:
                        </h2>
                        <div className="w-full h-[70%]  flex flex-col items-start justify-start">
                          <h1 className="text-xl">
                            Urgency Language:{" "}
                            {data.hasUrgencyLanguage === null
                              ? "Not checked"
                              : data.hasUrgencyLanguage
                                ? "⚠️ Detected"
                                : "None detected"}
                          </h1>
                          <h1 className="text-xl">
                            Return Policy:{" "}
                            {data.genericReviewScore === null
                              ? "Not enough data"
                              : `${data.genericReviewScore}%`}
                          </h1>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      ) : (
        <>
          <section className="w-full flex-1 flex flex-col items-center justify-center font-quicksand">
            <div className=" rounded-lg border-2 border-ink3 w-[70%] h-[70%] bg-white flex flex-row items-center gap-4 justify-between p-6 shadow-md">
              <div className=" w-[99%] h-full  flex flex-row items-center justify-between gap-4">
                <div className="bg-ink2 w-[28%] rounded-md h-full flex flex-col items-center justify-start py-8">
                  <div className="bg-black w-[85%] h-[60%] rounded-lg">
                    <img
                      src={data.previewImage}
                      className="w-full h-full object-cover"
                    ></img>
                  </div>
                  <div className="w-[90%] h-[35%]  text-xl flex flex-col p-2 gap-4 pt-2">
                    <p className="text-ink">Link Scanned: {data.url}</p>
                  </div>
                </div>
                <div className="w-[70%] h-full  grid grid-flow-col grid-cols-3 grid-rows-6 px-8 py-8 gap-4">
                  <div className="rounded-lg border-2 border-ink3 bg-white row-span-5 col-span-1 p-4">
                    <div className="w-full h-full flex flex-col items-center justify-center">
                      <div className=" w-full h-[25%]">
                        <span className="text-lg text-black rounded-lg">
                          This score reflects the domain’s age, SSL certificate,
                          Instagram presence, social media reach, and whether
                          Google has flagged the site as unsafe.
                        </span>
                      </div>
                      <div className=" w-full h-[40%]"></div>
                      <div className=" w-full h-[35%] flex flex-col items-start justify-end">
                        <div className="flex flex-row items-end justify-center gap-2">
                          <h1 className="text-black text-9xl">
                            {data.trustScore}
                          </h1>
                          <span className="text-ink font-semibold text-xl">
                            trust score
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-lg border-2 border-ink3 bg-white flex items-center justify-center text-lg">
                    <Link to="/">← return to Scan another</Link>
                  </div>
                  <div className="rounded-lg border-2 border-ink3 bg-white row-span-2 col-span-2 p-4">
                    <div className="w-full h-full  flex flex-row items-center justify-center">
                      <div className="w-[50%] h-full  flex flex-col items-start justify-end gap-4">
                        <h2 className="text-2xl w-full h-[60%]  flex items-end">
                          Domain Age:
                        </h2>
                        <div className="w-full h-[40%]  flex flex-row items-end justify-start">
                          <h1 className="text-7xl">{data.domainAge}</h1>
                          <span className="text-ink font-semibold">years</span>
                        </div>
                      </div>
                      <div className="w-[50%] h-full flex flex-col items-start justify-end gap-4">
                        <h2 className="text-2xl w-full h-[60%]  flex items-end">
                          SSL Issuer:
                        </h2>
                        <div className="w-full h-[40%]  flex flex-row items-end justify-start">
                          <h1 className="text-7xl">{data.sslIssuer}</h1>
                          <span className="text-ink font-semibold"></span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-lg border-2 border-ink3 bg-white row-span-3 col-span-1 p-4">
                    <div className="w-full h-full  flex flex-col items-start justify-center">
                      <div className="h-[50%] w-full flex flex-col items-start justify-end gap-4">
                        <h2 className="text-2xl w-full h-[60%]  flex items-end">
                          Flagged Unsafe:
                        </h2>
                        <div className="w-full h-[40%]  flex flex-row items-end justify-start">
                          <h1 className="text-5xl">
                            {data.isFlaggedUnsafe === null
                              ? "Not checked"
                              : data.isFlaggedUnsafe
                                ? "⚠️ Yes"
                                : "No"}
                          </h1>
                          <p></p>
                        </div>
                      </div>
                      <div className="h-[50%] w-full  flex flex-col items-start justify-end gap-4">
                        <h2 className="text-2xl w-full h-[60%]  flex items-end">
                          Threat Type:
                        </h2>
                        <div className="w-full h-[40%]  flex flex-row items-end gap-4 justify-start">
                          <h1 className="text-5xl">
                            {data.threatType ?? "None!"}
                          </h1>
                          <span className="text-ink font-semibold"></span>
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
                  <div className="rounded-lg border-2 border-ink3 bg-white row-span-4 col-span-1 p-4">
                    <div className="w-full h-full  flex flex-col items-start justify-center gap-4">
                      <div className="h-[50%] w-full flex flex-col items-start justify-end gap-4">
                        <h2 className="text-2xl w-full h-[30%]  flex items-end">
                          Registrar:
                        </h2>
                        <div className="w-full h-[70%]   flex flex-col items-start justify-start">
                          <h1 className="text-xl">
                            Name: {data.registrarName}
                          </h1>
                        </div>
                      </div>
                      <div className="h-[50%] w-full  flex flex-col items-start justify-end gap-4 mt-8">
                        <h2 className="text-2xl w-full h-[30%]  flex items-end">
                          Social Media:
                        </h2>
                        <div className="w-full h-[70%]  flex flex-col items-start justify-start">
                          <h1 className="text-xl">
                            Has an Instagram: {data.hasInstagram ? "Yes" : "No"}
                          </h1>
                          <h1 className="text-xl">
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
        </>
      )}
    </div>
  );
}

export default ResultPage;
