import React from "react";
import { getWeddings } from "../services/api";
import { Link } from "react-router-dom";
import type { WeddingInterface } from "../constants/interface";
import { Button } from "antd";
import AddWeddingsModal from "../components/AddWeddingsModal";

const RSVPDashboard: React.FC = () => {
  const [weddings, setWeddings] = React.useState<WeddingInterface[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const fetchLogs = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getWeddings();
        const { weddings: fetchedWeddings } = response.data;
        if (Array.isArray(fetchedWeddings)) {
          setWeddings(fetchedWeddings);
        } else {
          setError("Invalid data format received from API.");
        }
      } catch (error) {
        console.error("Error fetching logs:", error);
        setError("Failed to load weddings. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

  React.useEffect(() => {
    fetchLogs();
  }, []);
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-2 text-center">RSVP Dashboard</h1>
      <p className="text-[#0057b8] mb-6 text-center">
        Welcome to the RSVP Dashboard. Here you can manage your RSVPs.
      </p>

      {loading && <p className="text-[#0057b8]">Loading...</p>}
      {error && <p className="text-red-400">{error}</p>}

      <div className="mb-6 text-right">
        <Button
          type="primary"
          onClick={showModal}
          className="inline-flex items-center px-4 py-2 bg-[#1677ff] text-white rounded-lg shadow hover:bg-blue-400 transition font-medium border border-blue-100"
        >
          + Create Wedding
        </Button>
      </div>

      {!loading && !error && (
        <>
          {weddings.length === 0 ? (
            <p className="text-gray-400">No weddings found.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {weddings.map((wedding) => (
                <WeddingCard key={wedding._id} wedding={wedding} />
              ))}
            </div>
          )}
        </>
      )}
      <AddWeddingsModal fetchWeddings={fetchLogs} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
    </div>
  );
};

export default RSVPDashboard;

const WeddingCard: React.FC<{ wedding: WeddingInterface }> = ({ wedding }) => {
  return (
    <Link
      to={`/rsvp/${wedding._id}`}
      className="block rounded-2xl border border-blue-100 shadow-sm hover:shadow-lg transition p-5 bg-white"
    >
      <h2 className="text-xl font-semibold mb-2 ">{wedding.coupleNames}</h2>
      <div className="space-y-1 text-sm text-[#1677ff]">
        <p>
          <span className="font-medium text-[#0057b8]">Host:</span>{" "}
          {wedding.hostName}
        </p>
        <p>
          <span className="font-medium text-[#0057b8]">Date:</span>{" "}
            {new Date(wedding.weddingDate).toLocaleDateString("en-GB")}
        </p>
        <p>
          <span className="font-medium text-[#0057b8]">Location:</span>{" "}
          {wedding.location}
        </p>
      </div>
      <div className="mt-3 text-xs text-blue-300">
        <p>Created: {new Date(wedding.createdAt).toLocaleDateString("en-GB")}</p>
        <p>Updated: {new Date(wedding.updatedAt).toLocaleDateString("en-GB")}</p>
      </div>
    </Link>
  );
};
