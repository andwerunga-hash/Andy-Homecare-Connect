import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreateUser } from "@workspace/api-client-react";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ArrowRight, Loader2, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const formSchema = z.object({
  role: z.enum(["employer", "housekeeper"]),
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  county: z.string().min(2, "Please select a county"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  bio: z.string().max(500).optional(),
  salaryExpectation: z.coerce.number().min(1, "Please enter an expected salary"),
  skills: z.string().optional(),
  experience: z.string().optional(),
  languages: z.string().optional(),
  availability: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function Register() {
  const [, setLocation] = useLocation();
  const createUser = useCreateUser();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: "housekeeper",
      fullName: "",
      county: "",
      phone: "",
      email: "",
      bio: "",
      salaryExpectation: 0,
      skills: "",
      experience: "",
      languages: "",
      availability: "",
    },
  });

  const role = form.watch("role");

  const onSubmit = (values: FormValues) => {
    createUser.mutate(
      { data: values },
      {
        onSuccess: (user) => {
          setLocation(`/payment?userId=${user.id}`);
        },
      }
    );
  };

  const counties = ["Nairobi", "Mombasa", "Nakuru", "Kiambu", "Machakos", "Kisumu", "Uasin Gishu", "Kajiado"];

  return (
    <div className="min-h-[100dvh] flex flex-col bg-muted/20">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-12 max-w-3xl">
        <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-border/50">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold mb-2">Join the Community</h1>
            <p className="text-muted-foreground text-lg">Create your profile to connect with trusted families and house helps across Kenya.</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-base font-bold">I am a...</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="grid md:grid-cols-2 gap-4"
                      >
                        <Label
                          htmlFor="role-housekeeper"
                          className={`flex flex-col items-center justify-between rounded-xl border-2 p-4 cursor-pointer hover:bg-muted/50 transition-colors ${
                            field.value === "housekeeper" ? "border-primary bg-primary/5" : "border-border"
                          }`}
                        >
                          <RadioGroupItem value="housekeeper" id="role-housekeeper" className="sr-only" />
                          <span className="font-bold text-lg mb-1">House Help</span>
                          <span className="text-sm text-muted-foreground font-normal text-center">I am looking for domestic work</span>
                        </Label>
                        <Label
                          htmlFor="role-employer"
                          className={`flex flex-col items-center justify-between rounded-xl border-2 p-4 cursor-pointer hover:bg-muted/50 transition-colors ${
                            field.value === "employer" ? "border-primary bg-primary/5" : "border-border"
                          }`}
                        >
                          <RadioGroupItem value="employer" id="role-employer" className="sr-only" />
                          <span className="font-bold text-lg mb-1">Employer</span>
                          <span className="text-sm text-muted-foreground font-normal text-center">I want to hire a house help</span>
                        </Label>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Jane Wanjiku" {...field} className="bg-muted/30" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 0712345678" type="tel" {...field} className="bg-muted/30" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="county"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>County</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-muted/30">
                            <SelectValue placeholder="Select county" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {counties.map(c => (
                            <SelectItem key={c} value={c}>{c}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. jane@example.com" type="email" {...field} className="bg-muted/30" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="salaryExpectation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {role === "employer" ? "Budget (Ksh/month)" : "Expected Salary (Ksh/month)"}
                      </FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g. 15000" {...field} className="bg-muted/30" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="availability"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Availability</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Immediate, Full-time, Live-in" {...field} className="bg-muted/30" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {role === "housekeeper" && (
                <div className="grid md:grid-cols-2 gap-6 p-6 bg-accent/20 rounded-2xl border border-accent">
                  <FormField
                    control={form.control}
                    name="skills"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Skills</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Cooking, Cleaning, Childcare, Laundry (comma separated)" {...field} className="bg-white" />
                        </FormControl>
                        <FormDescription>Separate skills with commas</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="experience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Experience</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. 5 years" {...field} className="bg-white" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="languages"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Languages</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. English, Swahili" {...field} className="bg-white" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>About You</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder={role === "employer" ? "Tell us about your family and home..." : "Tell us about yourself and your work ethic..."}
                        className="resize-none h-32 bg-muted/30" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {createUser.isError && (
                <Alert variant="destructive">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>
                    {createUser.error?.error || "Failed to register. Please try again."}
                  </AlertDescription>
                </Alert>
              )}

              <div className="pt-6 border-t border-border flex justify-end">
                <Button 
                  type="submit" 
                  size="lg" 
                  className="rounded-full px-8 font-bold h-12 w-full md:w-auto"
                  disabled={createUser.isPending}
                >
                  {createUser.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Creating Profile...
                    </>
                  ) : (
                    <>
                      Continue to Verification <ArrowRight className="ml-2 w-5 h-5" />
                    </>
                  )}
                </Button>
              </div>

            </form>
          </Form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
