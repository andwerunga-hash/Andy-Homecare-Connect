import { useState } from "react";
import { useGetAdminRevenue } from "@workspace/api-client-react";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function RevenueDashboard({ adminPin }: { adminPin: string }) {
  const { data, isLoading, error, refetch } = useGetAdminRevenue(
    { adminPin },
    {
      query: {
        queryKey: ["admin-revenue", adminPin],
        retry: false,
        staleTime: 0,
        refetchOnWindowFocus: true,
      },
    },
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#006600]">
              Revenue Dashboard
            </h1>
            <p className="mt-1 text-gray-600">
              Andy Homecare Connect revenue overview
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => refetch()}
            disabled={isLoading}
          >
            Refresh
          </Button>
        </div>

        {isLoading && (
          <div className="rounded-xl bg-white p-8 text-center shadow">
            Loading revenue data...
          </div>
        )}

        {error && (
          <div className="rounded-xl bg-red-50 p-6 text-center text-red-700">
            Unable to load revenue data. Please check the admin PIN.
          </div>
        )}

        {data && (
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-xl bg-white p-6 shadow">
              <p className="text-sm font-medium text-gray-500">Total Revenue</p>
              <p className="mt-2 text-3xl font-bold text-[#006600]">
                Ksh {data.totalRevenue.toLocaleString()}
              </p>
            </div>

            <div className="rounded-xl bg-white p-6 shadow">
              <p className="text-sm font-medium text-gray-500">
                Approved Profiles
              </p>
              <p className="mt-2 text-3xl font-bold text-[#006600]">
                {data.approvedProfiles.toLocaleString()}
              </p>
            </div>

            <div className="rounded-xl bg-white p-6 shadow">
              <p className="text-sm font-medium text-gray-500">
                Verified Payments
              </p>
              <p className="mt-2 text-3xl font-bold text-[#006600]">
                {data.verifiedPayments.toLocaleString()}
              </p>
            </div>
          </div>
        )}

        <div className="mt-8 rounded-xl bg-white p-6 shadow">
          <h2 className="text-lg font-semibold text-gray-800">
            Registration Revenue
          </h2>
          <p className="mt-2 text-gray-600">
            The registration fee is Ksh 100. Revenue is automatically updated
            when a payment is verified through profile approval.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function RevenuePage() {
  const [adminPin, setAdminPin] = useState("");
  const [unlocked, setUnlocked] = useState(false);

  if (unlocked) {
    return <RevenueDashboard adminPin={adminPin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex min-h-[70vh] items-center justify-center px-4">
        <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-md">
          <h1 className="mb-2 text-2xl font-bold text-[#006600]">
            Revenue Dashboard
          </h1>
          <p className="mb-6 text-gray-600">
            Enter the administrator PIN to continue.
          </p>
          <Input
            type="password"
            inputMode="numeric"
            value={adminPin}
            onChange={(e) => setAdminPin(e.target.value)}
            placeholder="Enter admin PIN"
          />
          <Button
            className="mt-4 w-full bg-[#006600] hover:bg-[#005500]"
            disabled={adminPin.length < 4}
            onClick={() => setUnlocked(true)}
          >
            Unlock Revenue
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
