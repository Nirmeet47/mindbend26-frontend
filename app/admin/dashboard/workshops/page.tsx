"use client";
import React, { useEffect, useState } from "react";
import { workshopsApi } from "../../../../lib/dashboardApi";
import Table from "../../../../components/admin/Table";
import Header from "../../../../components/Header";
import EditWorkshopModal from "../../../../components/admin/EditWorkshopModal";
import { Workshop } from "@/types";

export default function WorkshopsPage() {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editWorkshop, setEditWorkshop] = useState<Workshop | null>(null);

  const fetchWorkshops = () => {
    setLoading(true);
    setError("");
    workshopsApi
      .listAdmin()
      .then((res) => setWorkshops(res.data?.data?.workshops || []))
      .catch(() => setError("Failed to load workshops"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchWorkshops();
  }, []);

  const handleEditWorkshop = async (workshop: Workshop) => {
    try {
      setLoading(true);
      // Fetch fresh workshop data from backend
      const response = await workshopsApi.getAdmin(workshop._id);
      const freshWorkshop = response.data?.data?.workshop;
      if (freshWorkshop) {
        setEditWorkshop(freshWorkshop);
      } else {
        setEditWorkshop(workshop);
      }
    } catch (error) {
      console.error('Failed to fetch workshop details:', error);
      // Fallback to the workshop from list
      setEditWorkshop(workshop);
    } finally {
      setLoading(false);
    }
  };

  const columns = ["name", "instructor", "entryFee", "workshopDate", "maxParticipants", "edit"];

  return (
    <div className="px-8 py-10 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Header title="Workshops" />
      
      {loading ? (
        <div className="text-center text-base text-gray-500 py-12">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-500 py-12">{error}</div>
      ) : (
        <div>
          <Table
            columns={columns}
            data={workshops.map((workshop: any) => ({
              ...workshop,
              instructor: workshop.instructor?.name || 'N/A',
              workshopDate: workshop.workshopDate ? new Date(workshop.workshopDate).toLocaleDateString() : 'N/A',
              edit: (
                <button
                  className="px-3 py-1 rounded bg-blue-600 text-white text-xs hover:bg-blue-700 transition"
                  onClick={() => handleEditWorkshop(workshop)}
                >
                  Edit
                </button>
              ),
            }))}
          />
        </div>
      )}
      {editWorkshop && (
        <EditWorkshopModal
          workshop={editWorkshop}
          onClose={() => setEditWorkshop(null)}
          onSuccess={() => {
            setEditWorkshop(null);
            fetchWorkshops();
          }}
        />
      )}
    </div>
  );
}