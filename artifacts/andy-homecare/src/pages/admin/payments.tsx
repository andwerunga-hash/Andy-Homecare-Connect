import { useListPayments } from "@workspace/api-client-react";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export function AdminPayments() {
  const { data: payments, isLoading } = useListPayments();

  return (
    <div className="min-h-[100dvh] flex flex-col bg-muted/20">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-border/50">
          <h1 className="text-3xl font-extrabold mb-8">Admin: Payments</h1>

          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-muted animate-pulse rounded-lg"></div>
              ))}
            </div>
          ) : payments && payments.length > 0 ? (
            <div className="rounded-xl border border-border overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>User ID</TableHead>
                    <TableHead>Mpesa Code</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">#{payment.id}</TableCell>
                      <TableCell>User {payment.userId}</TableCell>
                      <TableCell className="font-mono">{payment.mpesaCode}</TableCell>
                      <TableCell>Ksh {payment.amount}</TableCell>
                      <TableCell>
                        <Badge variant={payment.status === 'verified' ? 'default' : payment.status === 'rejected' ? 'destructive' : 'secondary'} className={payment.status === 'verified' ? 'bg-green-600 hover:bg-green-700' : ''}>
                          {payment.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{format(new Date(payment.submittedAt), "MMM d, yyyy HH:mm")}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-10">No payments found.</p>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
