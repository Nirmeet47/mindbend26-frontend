"use client";
import React, { useEffect, useState } from "react";
import { workshopsApi } from "../../../../lib/dashboardApi";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Check, X, ExternalLink, Calendar, DollarSign, User, Building2, Search, Filter } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";

interface PaymentRegistration {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
    phoneNumber: string;
    college_name: string;
    isSvnitian: boolean;
  };
  workshop: {
    _id: string;
    name: string;
    slug: string;
    workshopDate: string;
    entryFee: number;
  };
  paymentScreenshot: string;
  transactionId: string;
  paymentStatus: string;
  registeredAt: string;
}

export default function WorkshopPaymentsPage() {
  const [payments, setPayments] = useState<PaymentRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter payments based on search query
  const filteredPayments = payments.filter(payment => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      payment.user.name.toLowerCase().includes(query) ||
      payment.user.email.toLowerCase().includes(query) ||
      payment.workshop.name.toLowerCase().includes(query) ||
      payment.user.college_name.toLowerCase().includes(query) ||
      (payment.transactionId && payment.transactionId.toLowerCase().includes(query))
    );
  });

  const fetchPayments = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await workshopsApi.getAllPayments();
      setPayments(response.data?.data?.payments || []);
      if (response.data?.data?.payments?.length > 0) {
        toast.success(`Loaded ${response.data.data.payments.length} payment(s)`);
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Failed to load payments";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="border-b border-white/5 bg-[#0a0a0a]/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="px-8 py-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">Workshop Payments</h1>
              <p className="text-sm text-gray-400">View all workshop payment records and transaction details</p>
            </div>
            <Button
              onClick={fetchPayments}
              variant="outline"
              size="sm"
              disabled={loading}
              className="bg-transparent border-white/10 text-gray-400 hover:text-white hover:bg-white/5 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
          
          {/* Search Bar */}
          {payments.length > 0 && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search by name, email, workshop, college, or transaction ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#33ABB9] focus:bg-white/10 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="px-8 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mb-3" />
            <span className="text-sm text-gray-400">Loading payments...</span>
          </div>
        ) : error ? (
          <Card className="bg-[#0a0a0a] border-white/5">
            <CardContent className="pt-6">
              <div className="text-center py-20">
                <div className="text-red-400 text-sm mb-4">{error}</div>
                <Button
                  onClick={fetchPayments}
                  variant="outline"
                  className="bg-transparent border-white/10 text-gray-400 hover:text-white hover:bg-white/5"
                >
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : payments.length === 0 ? (
          <Card className="bg-[#0a0a0a] border-white/5">
            <CardContent className="pt-6">
              <div className="text-center py-20">
                <Check className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">No Payments Yet</h3>
                <p className="text-gray-400">No workshop payments have been recorded.</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">
                {searchQuery 
                  ? `Search Results (${filteredPayments.length} of ${payments.length})`
                  : `All Payments (${payments.length})`
                }
              </h2>
              {searchQuery && filteredPayments.length === 0 && (
                <p className="text-sm text-gray-400">No payments match your search</p>
              )}
            </div>

            {filteredPayments.length === 0 && searchQuery ? (
              <Card className="bg-[#0a0a0a] border-white/5">
                <CardContent className="pt-6">
                  <div className="text-center py-20">
                    <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">No matches found</h3>
                    <p className="text-gray-400 mb-4">Try different search terms</p>
                    <Button
                      onClick={() => setSearchQuery("")}
                      variant="outline"
                      className="bg-transparent border-white/10 text-gray-400 hover:text-white hover:bg-white/5"
                    >
                      Clear Search
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              filteredPayments.map((payment) => (
              <Card key={payment._id} className="bg-[#0a0a0a] border-white/5 hover:border-white/10 transition-colors">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* User Info */}
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <User className="w-4 h-4 text-gray-400" />
                          <h3 className="text-sm font-medium text-gray-400 uppercase">User Details</h3>
                        </div>
                        <div className="space-y-2">
                          <div>
                            <p className="text-white font-medium">{payment.user.name}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-400">{payment.user.email}</p>
                          </div>
                          {payment.user.phoneNumber && (
                            <div>
                              <p className="text-sm text-gray-400">{payment.user.phoneNumber}</p>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <Building2 className="w-3 h-3 text-gray-500" />
                            <p className="text-sm text-gray-400">{payment.user.college_name}</p>
                          </div>
                          <div>
                            {payment.user.isSvnitian ? (
                              <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                                SVNIT Student
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-purple-500/10 text-purple-400 border-purple-500/20">
                                External
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Workshop Info */}
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <h3 className="text-sm font-medium text-gray-400 uppercase">Workshop Details</h3>
                        </div>
                        <div className="space-y-2">
                          <p className="text-white font-medium">{payment.workshop.name}</p>
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-3 h-3 text-green-400" />
                            <p className="text-green-400 font-medium">₹{payment.workshop.entryFee}</p>
                          </div>
                          <p className="text-xs text-gray-500">
                            Registered: {new Date(payment.registeredAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Payment Screenshot */}
                    <div className="lg:col-span-1">
                      <div className="flex items-center gap-2 mb-3">
                        <ExternalLink className="w-4 h-4 text-gray-400" />
                        <h3 className="text-sm font-medium text-gray-400 uppercase">Payment Proof</h3>
                      </div>
                      <div className="relative group">
                        <Image
                          src={payment.paymentScreenshot}
                          alt="Payment Screenshot"
                          width={400}
                          height={300}
                          className="rounded border border-white/10 w-full object-cover cursor-pointer hover:border-white/30 transition-colors"
                          onClick={() => window.open(payment.paymentScreenshot, "_blank")}
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded">
                          <ExternalLink className="w-8 h-8 text-white" />
                        </div>
                      </div>
                      <button
                        onClick={() => window.open(payment.paymentScreenshot, "_blank")}
                        className="text-xs text-blue-400 hover:text-blue-300 mt-2 flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Open in new tab
                      </button>
                    </div>

                    {/* Transaction Details */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-400 uppercase mb-3">Transaction Details</h3>
                      <div className="space-y-3">
                        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                          <p className="text-xs text-gray-500 mb-1">Transaction ID:</p>
                          <p className="text-white font-mono break-all">{payment.transactionId || 'N/A'}</p>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                          <p className="text-xs text-gray-500 mb-1">Status:</p>
                          <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20">
                            {payment.paymentStatus.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                          <p className="text-xs text-gray-500 mb-1">Registration Date:</p>
                          <p className="text-white text-sm">{new Date(payment.registeredAt).toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
