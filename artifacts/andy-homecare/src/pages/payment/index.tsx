import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreatePayment, useGetUser, useGetUserPayment, getGetUserQueryKey, getGetUserPaymentQueryKey } from "@workspace/api-client-react";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2, CheckCircle2, ShieldCheck, Info, Clock } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

const formSchema = z.object({
  mpesaCode: z.string().min(5, "Mpesa code is too short").regex(/^[A-Z0-9]+$/, "Invalid Mpesa code format"),
});

export function Payment() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const userId = parseInt(searchParams.get("userId") || "0", 10);
  
  const [isSuccess, setIsSuccess] = useState(false);
  const createPayment = useCreatePayment();
  const { data: user } = useGetUser(userId, { query: { queryKey: getGetUserQueryKey(userId), enabled: !!userId } });
  
  // Checking existing payment
  const { data: existingPayment, isLoading: isPaymentLoading } = useGetUserPayment(userId, { 
    query: { queryKey: getGetUserPaymentQueryKey(userId), enabled: !!userId && !isSuccess, retry: false } 
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mpesaCode: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    createPayment.mutate(
      { 
        data: { 
          userId, 
          mpesaCode: values.mpesaCode.toUpperCase(), 
          amount: 100 
        } 
      },
      {
        onSuccess: () => {
          setIsSuccess(true);
        },
      }
    );
  };

  if (!userId) {
    return (
      <div className="min-h-screen flex flex-col bg-muted/20">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-20 text-center">
          <Info className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Invalid Session</h1>
          <p className="text-muted-foreground mb-8">Please register or log in first.</p>
          <Link href="/register">
            <Button>Register</Button>
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] flex flex-col bg-muted/20">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-12 flex items-center justify-center">
        <div className="w-full max-w-lg bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-border/50 relative overflow-hidden">
          
          {isSuccess || existingPayment ? (
            <div className="text-center py-8 animate-in zoom-in-95 duration-500">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${existingPayment?.status === 'verified' ? 'bg-green-100 text-primary' : 'bg-yellow-100 text-yellow-600'}`}>
                {existingPayment?.status === 'verified' ? <CheckCircle2 className="w-10 h-10" /> : <Clock className="w-10 h-10" />}
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-3">
                {existingPayment?.status === 'verified' ? 'Payment Verified' : 'Verification Pending'}
              </h1>
              
              <div className="mb-6 flex justify-center">
                <Badge variant="outline" className="font-mono text-sm px-3 py-1">
                  Mpesa: {existingPayment?.mpesaCode || form.getValues().mpesaCode}
                </Badge>
              </div>

              <p className="text-muted-foreground mb-8 leading-relaxed">
                {existingPayment?.status === 'verified' 
                  ? "Your payment has been successfully verified! Your contact information is now unlocked on your profile."
                  : "Thank you! We have received your Mpesa code. Our team will verify the payment within 24 hours. Once verified, your profile will be unlocked and visible to everyone."}
              </p>
              
              <Link href={`/profile/${userId}`}>
                <Button size="lg" className="w-full rounded-full font-bold">Go to Profile</Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-primary to-accent"></div>
              
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShieldCheck className="w-8 h-8 text-primary" />
                </div>
                <h1 className="text-2xl font-extrabold mb-2">Verify Your Profile</h1>
                <p className="text-muted-foreground">
                  Complete a one-time payment of Ksh 100 to verify your identity and unlock direct contacts.
                </p>
              </div>

              <div className="bg-[#FAF8F5] border border-primary/20 rounded-2xl p-6 mb-8">
                <h3 className="font-bold text-lg mb-4 text-center">Mpesa Instructions</h3>
                <ol className="space-y-4 text-sm font-medium">
                  <li className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0">1</span>
                    <p>Go to M-PESA menu and select <strong>Lipa na M-PESA</strong></p>
                  </li>
                  <li className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0">2</span>
                    <p>Select <strong>Pay Bill</strong></p>
                  </li>
                  <li className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0">3</span>
                    <p>Enter Business Number: <strong className="text-lg bg-white px-2 py-0.5 rounded border">542542</strong></p>
                  </li>
                  <li className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0">4</span>
                    <p>Enter Account Number: <strong className="text-lg bg-white px-2 py-0.5 rounded border">22703</strong></p>
                  </li>
                  <li className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0">5</span>
                    <p>Enter Amount: <strong>Ksh 100</strong> and your PIN</p>
                  </li>
                </ol>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="mpesaCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold">Mpesa Transaction Code</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g. QFE2ABCD12" 
                            {...field} 
                            className="bg-muted/30 uppercase text-lg tracking-wider" 
                            onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {createPayment.isError && (
                    <Alert variant="destructive">
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>
                        {createPayment.error?.data?.error || "Failed to submit payment. Please try again."}
                      </AlertDescription>
                    </Alert>
                  )}

                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full rounded-full font-bold h-14"
                    disabled={createPayment.isPending || isPaymentLoading}
                  >
                    {createPayment.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Payment for Verification"
                    )}
                  </Button>
                  
                  <p className="text-center text-xs text-muted-foreground mt-4">
                    By submitting, you agree to our Terms of Service and Trust & Safety guidelines.
                  </p>
                </form>
              </Form>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
