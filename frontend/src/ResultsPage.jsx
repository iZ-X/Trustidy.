import { useLocation } from "react-router-dom";

function ResultPage() {
  const location = useLocation();
  const data = location.state;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Results</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

export default ResultPage;
