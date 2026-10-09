import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Link } from "react-router-dom";

function ResultPage() {
  const { id } = useParams();
  const location = useLocation();
  // const data = location.state;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

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
    return <div className="p-4 text-center">Loading...</div>;
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

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Results</h1>

      <Link to="/" className="text-blue-600 underline mb-4 inline-block">
        ← Scan another
      </Link>

      <div className="bg-gray-100 rounded-lg pb-6 mb-4 text-center">
        <p className="text-sm text-gray-500 uppercase tracking-wide">
          Trust Score
        </p>
        <p className="text-5xl font-bold">{data.trustScore}</p>
        <p className="text-sm text-gray-500 mt-2">Status: {data.scanStatus}</p>
      </div>

      {isListing ? (
        <>
          <div className="bg-white border rounded-lg p-4 mb-4">
            <h2 className="text-lg font-semibold mb-2">Product</h2>
            {data.productImage && data.productImage.length > 0 && (
              <div className="flex gap-2 overflow-x-auto mb-2">
                {data.productImage.map((imgUrl, index) => (
                  <img
                    key={index}
                    src={imgUrl}
                    alt={`Product ${index + 1}`}
                    className="w-32 h-32 object-cover rounded shrink-0"
                  />
                ))}
              </div>
            )}
            <p>Price: ${data.currentPrice}</p>
            <p>
              Price range seen: ${data.priceHistoryLow} - $
              {data.priceHistoryHigh}
            </p>
          </div>

          <div className="bg-white border rounded-lg p-4 mb-4">
            <h2 className="text-lg font-semibold mb-2">Reviews</h2>
            <p>Count: {data.reviewCount}</p>
            <p>Average Rating: {data.averageRating ?? "N/A"}</p>
            <p>
              Suspicious date clustering: {""}
              {data.reviewDateClustering === null
                ? "Not enough data"
                : data.reviewDateClustering
                  ? "Yes"
                  : "No"}
            </p>
            <p>
              Generic review score: {""}
              {data.genericReviewScore === null
                ? "Not enough data"
                : `${data.genericReviewScore}%`}
            </p>
          </div>

          <div className="bg-white border rounded-lg p-4 mb-4">
            <h2 className="text-lg font-semibold mb-2">Red Flags</h2>
            <p>
              Urgency language: {""}
              {data.hasUrgencyLanguage === null
                ? "Not checked"
                : data.hasUrgencyLanguage
                  ? "⚠️ Detected"
                  : "None detected"}
            </p>
            <p>
              Return policy: {""}
              {data.hasReturnPolicy === null
                ? "Not checked"
                : data.hasReturnPolicy
                  ? "Present"
                  : "Not found"}
            </p>
          </div>
        </>
      ) : (
        <>
          <div className="bg-white border rounded-lg p-4 mb-4">
            <h2 className="text-lg font-semibold mb-2">Domain</h2>
            {data.previewImage && data.previewImage.length > 0 && (
              <div className="flex gap-2 overflow-x-auto mb-2">
                {data.previewImage.map((imgUrl, index) => (
                  <img
                    key={index}
                    src={imgUrl}
                    alt={`Product ${index + 1}`}
                    className="w-32 h-32 object-cover rounded shrink-0"
                  ></img>
                ))}
              </div>
              // <img
              //   src={data.previewImage}
              //   alt="Image"
              //   className="w-32 h-32 object-cover rounded mb-2"
              // ></img>
            )}
            <p>Link: {data.url}</p>
            <p>
              Domain info: Age: {data.domainAge}, Registrar name:{" "}
              {data.registrarName}
            </p>
          </div>

          <div className="bg-white border rounded-lg p-4 mb-4">
            <h2 className="text-lg font-semibold mb-2">Social presence</h2>
            <p>Has Instagram?: {data.hasInstagram ? "Yes" : "No"}</p>
            <p>Social Media platform total: {data.socialProfileCount}</p>
          </div>

          <div className="bg-white border rounded-lg p-4 mb-4">
            <h2 className="text-lg font-semibold mb-2">Security Concerns</h2>
            <p>SSL Issuer: {data.sslIssuer ?? "None!"}</p>
            <p>
              Flagged Unsafe:{" "}
              {data.isFlaggedUnsafe === null
                ? "Not checked"
                : data.isFlaggedUnsafe
                  ? "⚠️ Yes"
                  : "No"}
            </p>
            <p>Threat Type: {data.threatType ?? "None!"}</p>
          </div>
        </>
      )}
    </div>
  );
}

export default ResultPage;
