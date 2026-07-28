import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useGetAdminDashboard,
  getGetAdminDashboardQueryKey,
  useAdminApproveUser,
  useAdminRejectUser,
} from "@workspace/api-client-react";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";

// ─── PIN Gate ────────────────────────────────────────────────────────────────

function PinGate({ onUnlock }: { onUnlock: (pin: string) => void }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (pin.length < 4) {
      setError("PIN must be at least 4 digits.");
      return;
    }
    onUnlock(pin);
  }

  return (
    <div className="min-h-[100dvh] flex flex-col bg-muted/20">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-sm bg-white rounded-3xl shadow-md border border-border/50 p-10 flex flex-col items-center gap-6">
          {/* Icon */}
          <div className="w-16 h-16 rounded-2xl bg-[#006600] flex items-center justify-center shadow">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-extrabold text-foreground">Admin Access</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Enter your admin PIN to continue
            </p>
          </div>
          <form onSubmit={submit} className="w-full flex flex-col gap-3">
            <Input
              type="password"
              inputMode="numeric"
              placeholder="Enter PIN"
              value={pin}
              onChange={(e) => {
                setPin(e.target.value);
                setError("");
              }}
              className="text-center text-xl tracking-widest h-12"
              autoFocus
            />
            {error && <p className="text-sm text-red-600 text-center">{error}</p>}
            <Button
              type="submit"
              className="w-full h-12 bg-[#006600] hover:bg-[#005200] text-white font-bold"
            >
              Unlock Dashboard
            </Button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}

// ─── Status badge helper ──────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string | null }) {
  if (!status)
    return (
      <Badge variant="outline" className="text-muted-foreground">
        No Payment
      </Badge>
    );
  if (status === "verified")
    return <Badge className="bg-[#006600] hover:bg-[#005200] text-white">Verified ✓</Badge>;
  if (status === "rejected")
    return <Badge variant="destructive">Rejected</Badge>;
  return (
    <Badge variant="secondary" className="bg-amber-100 text-amber-800 border-amber-300">
      Pending Review
    </Badge>
  );
}

// ─── Dashboard ───────────────────────────────────────────────────────────────

type Tab = "all" | "pending" | "verified" | "rejected";

function Dashboard({ adminPin }: { adminPin: string }) {
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<Tab>("pending");
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  const { data: users = [], isLoading, isError } = useGetAdminDashboard(
    { adminPin },
    { query: { queryKey: getGetAdminDashboardQueryKey({ adminPin }), retry: false, staleTime: 0 } }
  );

  const approve = useAdminApproveUser({
    mutation: {
      onSuccess: (_, vars) => {
        queryClient.invalidateQueries({ queryKey: getGetAdminDashboardQueryKey({ adminPin }) });
        const userId = (vars as { userId: number }).userId;
        const user = users.find((u) => u.id === userId);
        setActionMsg(`✅ ${user?.fullName ?? "User"} approved — WhatsApp notification sent.`);
        setTimeout(() => setActionMsg(null), 4000);
      },
    },
  });

  const reject = useAdminRejectUser({
    mutation: {
      onSuccess: (_, vars) => {
        queryClient.invalidateQueries({ queryKey: getGetAdminDashboardQueryKey({ adminPin }) });
        const userId = (vars as { userId: number }).userId;
        const user = users.find((u) => u.id === userId);
        setActionMsg(`❌ ${user?.fullName ?? "User"} rejected — WhatsApp notification sent.`);
        setTimeout(() => setActionMsg(null), 4000);
      },
    },
  });

  function handleApprove(userId: number) {
    approve.mutate({ userId, data: { adminPin } });
  }

  function handleReject(userId: number) {
    reject.mutate({ userId, data: { adminPin } });
  }

  // Stats
  const total = users.length;
  const pending = users.filter((u) => u.paymentStatus === "pending").length;
  const verified = users.filter((u) => u.paymentVerified).length;
  const rejected = users.filter((u) => u.paymentStatus === "rejected").length;
  const noPayment = users.filter((u) => !u.paymentStatus).length;

  // Filter
  const filtered =
    tab === "all"
      ? users
      : tab === "pending"
      ? users.filter((u) => u.paymentStatus === "pending")
      : tab === "verified"
      ? users.filter((u) => u.paymentVerified)
      : users.filter((u) => u.paymentStatus === "rejected");

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: "pending", label: "Pending", count: pending },
    { key: "all", label: "All Users", count: total },
    { key: "verified", label: "Approved", count: verified },
    { key: "rejected", label: "Rejected", count: rejected },
  ];

  return (
    <div className="min-h-[100dvh] flex flex-col bg-muted/20">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-10 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Review registrations, verify Mpesa payments, and approve profiles.
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Registered", value: total, color: "border-[#006600]", text: "text-[#006600]" },
            { label: "Pending Review", value: pending, color: "border-amber-400", text: "text-amber-700" },
            { label: "Approved", value: verified, color: "border-green-500", text: "text-green-700" },
            { label: "No Payment Yet", value: noPayment, color: "border-slate-300", text: "text-slate-500" },
          ].map(({ label, value, color, text }) => (
            <div
              key={label}
              className={`bg-white rounded-2xl border-l-4 ${color} p-5 shadow-sm`}
            >
              <div className={`text-3xl font-extrabold ${text}`}>{value}</div>
              <div className="text-xs text-muted-foreground mt-1 font-medium">{label}</div>
            </div>
          ))}
        </div>

        {/* Toast notification */}
        {actionMsg && (
          <div className="mb-4 bg-[#006600]/10 border border-[#006600]/30 text-[#006600] text-sm rounded-xl px-4 py-3 font-medium">
            {actionMsg}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {tabs.map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                tab === key
                  ? "bg-[#006600] text-white border-[#006600] shadow"
                  : "bg-white text-foreground border-border hover:border-[#006600]/50"
              }`}
            >
              {label}{" "}
              <span
                className={`ml-1 text-xs font-bold rounded-full px-1.5 py-0.5 ${
                  tab === key ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"
                }`}
              >
                {count}
              </span>
            </button>
          ))}
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-24 bg-white rounded-2xl animate-pulse border border-border/40" />
            ))}
          </div>
        ) : isError ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
            <p className="text-red-700 font-semibold">Invalid PIN or server error.</p>
            <p className="text-red-500 text-sm mt-1">Please reload the page and try again.</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-border/40 p-12 text-center">
            <p className="text-muted-foreground">No users in this category.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((user) => {
              const isPending = user.paymentStatus === "pending";
              const isVerified = user.paymentVerified;
              const busy =
                approve.isPending || reject.isPending;

              return (
                <div
                  key={user.id}
                  className={`bg-white rounded-2xl border shadow-sm p-5 flex flex-col md:flex-row md:items-center gap-4 transition-all ${
                    isPending ? "border-amber-300 bg-amber-50/30" : "border-border/50"
                  }`}
                >
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center font-extrabold text-lg text-white shadow ${
                        user.role === "housekeeper" ? "bg-[#006600]" : "bg-[#BB0000]"
                      }`}
                    >
                      {user.fullName.charAt(0).toUpperCase()}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-foreground">{user.fullName}</span>
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          user.role === "housekeeper"
                            ? "border-[#006600] text-[#006600]"
                            : "border-[#BB0000] text-[#BB0000]"
                        }`}
                      >
                        {user.role === "housekeeper" ? "House Help" : "Employer"}
                      </Badge>
                      <StatusBadge status={user.paymentStatus ?? null} />
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-1 text-sm text-muted-foreground">
                      <span>{user.county} County</span>
                      <span>📞 {user.phone}</span>
                      <span>Ksh {user.salaryExpectation.toLocaleString()}/mo</span>
                    </div>
                    {user.mpesaCode && (
                      <div className="mt-1.5 flex flex-wrap gap-x-4 text-sm">
                        <span className="font-mono font-semibold text-foreground">
                          Mpesa: {user.mpesaCode}
                        </span>
                        <span className="text-muted-foreground">
                          Ksh {user.paymentAmount ?? 0}
                        </span>
                        {user.paymentSubmittedAt && (
                          <span className="text-muted-foreground">
                            {format(new Date(user.paymentSubmittedAt), "MMM d, yyyy HH:mm")}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  {!isVerified && user.paymentStatus !== "rejected" && (
                    <div className="flex gap-2 flex-shrink-0">
                      <Button
                        size="sm"
                        disabled={busy}
                        onClick={() => handleApprove(user.id)}
                        className="bg-[#006600] hover:bg-[#005200] text-white font-semibold px-4"
                      >
                        {approve.isPending ? "…" : "✓ Approve"}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={busy}
                        onClick={() => handleReject(user.id)}
                        className="border-red-300 text-red-600 hover:bg-red-50 font-semibold px-4"
                      >
                        {reject.isPending ? "…" : "✗ Reject"}
                      </Button>
                    </div>
                  )}

                  {isVerified && (
                    <div className="flex-shrink-0 text-[#006600] font-semibold text-sm">
                      Profile Live ✓
                    </div>
                  )}

                  {user.paymentStatus === "rejected" && !isVerified && (
                    <div className="flex-shrink-0">
                      <Button
                        size="sm"
                        disabled={busy}
                        onClick={() => handleApprove(user.id)}
                        className="bg-[#006600] hover:bg-[#005200] text-white font-semibold"
                      >
                        Re-approve
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

// ─── Page entry point ─────────────────────────────────────────────────────────

export function AdminPayments() {
  const [pin, setPin] = useState<string | null>(null);
  return pin ? <Dashboard adminPin={pin} /> : <PinGate onUnlock={setPin} />;
}
