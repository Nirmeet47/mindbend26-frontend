"use client";
import React, { useEffect, useState } from "react";
import { workshopsApi } from "../../../../lib/dashboardApi";
import Table from "../../../../components/admin/Table";
import EditWorkshopModal from "../../../../components/admin/EditWorkshopModal";
import AddWorkshopModal from "../../../../components/admin/AddWorkshopModal";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Workshop } from "@/types";
import { RefreshCw, Calendar, Users, Plus } from "lucide-react";

export default function WorkshopsPage() {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editWorkshop, setEditWorkshop] = useState<Workshop | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

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
      const response = await workshopsApi.getAdmin(workshop._id);
      const freshWorkshop = response.data?.data?.workshop;
      if (freshWorkshop) {
        setEditWorkshop(freshWorkshop);
      } else {
        setEditWorkshop(workshop);
      }
    } catch (error) {
      console.error('Failed to fetch workshop details:', error);
      setEditWorkshop(workshop);
    } finally {
      setLoading(false);
    }
  };

  const columns = ["name", "entryFee", "workshopDate", "venue", "edit"];

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="border-b border-white/5 bg-[#0a0a0a]/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">Workshops Management</h1>
              <p className="text-sm text-gray-400">Manage all workshops and sessions</p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => setShowAddModal(true)}
                variant="outline"
                size="sm"
                className="bg-blue-600 border-blue-600 text-white hover:bg-blue-700 hover:border-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Workshop
              </Button>
              <Button
                onClick={fetchWorkshops}
                variant="outline"
                size="sm"
                className="bg-transparent border-white/10 text-gray-400 hover:text-white hover:bg-white/5"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-8 py-8">
        <Card className="bg-[#0a0a0a] border-white/5">
          <CardHeader>
            <CardTitle className="text-white">All Workshops</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mb-3" />
                <span className="text-sm text-gray-400">Loading workshops...</span>
              </div>
            ) : error ? (
              <div className="text-center py-20">
                <div className="text-red-400 text-sm mb-4">{error}</div>
                <Button
                  onClick={fetchWorkshops}
                  variant="outline"
                  className="bg-transparent border-white/10 text-gray-400 hover:text-white hover:bg-white/5"
                >
                  Try Again
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table
                  columns={columns}
                  data={workshops.map((workshop: any) => ({
                    ...workshop,
                    entryFee: workshop.isFree || workshop.entryFee === 0 ? (
                      <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20">
                        Free
                      </Badge>
                    ) : (
                      <span className="text-green-400 font-medium">₹{workshop.entryFee.toLocaleString()}</span>
                    ),
                    workshopDate: workshop.workshopDate ? (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3 h-3 text-gray-400" />
                        <span className="text-gray-300">{new Date(workshop.workshopDate).toLocaleDateString()}</span>
                      </div>
                    ) : (
                      <span className="text-gray-500">N/A</span>
                    ),
                    venue: workshop.venue ? (
                      <span className="text-gray-300">{workshop.venue}</span>
                    ) : (
                      <span className="text-gray-500">N/A</span>
                    ),
                    edit: (
                      <Button
                        onClick={() => handleEditWorkshop(workshop)}
                        variant="outline"
                        size="sm"
                        className="bg-transparent border-white/10 text-gray-400 hover:text-white hover:bg-white/5"
                      >
                        Edit
                      </Button>
                    ),
                  }))}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <AddWorkshopModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={() => {
          setShowAddModal(false);
          fetchWorkshops();
        }}
      />

      {editWorkshop && (
        <EditWorkshopModal
          workshop={editWorkshop}
          open={true}
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