import { useEffect } from "react";
import { Link, useLocation, useParams } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useGetUser, useUpdateUser, getGetUserQueryKey, getGetUserQueryOptions } from "@workspace/api-client-react";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2, ArrowLeft } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  county: z.string().min(2, "Please select a county"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  bio: z.string().max(500).optional().or(z.literal("")),
  salaryExpectation: z.coerce.number().min(1, "Please enter an expected salary"),
  skills: z.string().optional().or(z.literal("")),
  experience: z.string().optional().or(z.literal("")),
  languages: z.string().optional().or(z.literal("")),
  availability: z.string().optional().or(z.literal("")),
});

type FormValues = z.infer<typeof formSchema>;

export function EditProfile() {
  const { id } = useParams<{ id: string }>();
  const userId = parseInt(id || "0", 10);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: user, isLoading } = useGetUser(userId, { query: { queryKey: getGetUserQueryKey(userId), enabled: !!userId } });
  const updateUser = useUpdateUser();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
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

  useEffect(() => {
    if (user) {
      form.reset({
        fullName: user.fullName,
        county: user.county,
        phone: user.phone,
        email: user.email || "",
        bio: user.bio || "",
        salaryExpectation: user.salaryExpectation,
        skills: user.skills || "",
        experience: user.experience || "",
        languages: user.languages || "",
        availability: user.availability || "",
      });
    }
  }, [user, form]);

  const onSubmit = (values: FormValues) => {
    updateUser.mutate(
      { id: userId, data: values },
      {
        onSuccess: (updatedUser) => {
          queryClient.setQueryData(getGetUserQueryKey(userId), updatedUser);
          toast({
            title: "Profile Updated",
            description: "Your profile changes have been saved successfully.",
          });
          setLocation(`/profile/${userId}`);
        },
      }
    );
  };

  const counties = ["Nairobi", "Mombasa", "Nakuru", "Kiambu", "Machakos", "Kisumu", "Uasin Gishu", "Kajiado"];

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-muted/20">
        <Navbar />
        <main className="flex-1 flex justify-center items-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </main>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-muted/20">
        <Navbar />
        <main className="flex-1 flex justify-center items-center">
          <p>Profile not found.</p>
        </main>
      </div>
    );
  }

  const isHousekeeper = user.role === "housekeeper";

  return (
    <div className="min-h-[100dvh] flex flex-col bg-muted/20">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-12 max-w-3xl">
        <Link href={`/profile/${userId}`} className="inline-flex items-center text-sm font-semibold text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Profile
        </Link>

        <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-border/50">
          <div className="mb-8 border-b border-border/50 pb-6">
            <h1 className="text-3xl font-extrabold mb-2">Edit Profile</h1>
            <p className="text-muted-foreground">Update your details to keep your profile current.</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input {...field} className="bg-muted/30" />
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
                        <Input type="tel" {...field} className="bg-muted/30" />
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
                      <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
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
                        <Input type="email" {...field} className="bg-muted/30" />
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
                        {isHousekeeper ? "Expected Salary (Ksh/month)" : "Budget (Ksh/month)"}
                      </FormLabel>
                      <FormControl>
                        <Input type="number" {...field} className="bg-muted/30" />
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
                        <Input {...field} className="bg-muted/30" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {isHousekeeper && (
                <div className="grid md:grid-cols-2 gap-6 p-6 bg-accent/20 rounded-2xl border border-accent">
                  <FormField
                    control={form.control}
                    name="skills"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Skills</FormLabel>
                        <FormControl>
                          <Input {...field} className="bg-white" />
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
                          <Input {...field} className="bg-white" />
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
                          <Input {...field} className="bg-white" />
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
                        className="resize-none h-32 bg-muted/30" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {updateUser.isError && (
                <Alert variant="destructive">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>
                    {updateUser.error?.data?.error || "Failed to update profile. Please try again."}
                  </AlertDescription>
                </Alert>
              )}

              <div className="pt-6 border-t border-border flex justify-end gap-4">
                <Link href={`/profile/${userId}`}>
                  <Button variant="outline" size="lg" className="rounded-full h-12 w-full md:w-auto" type="button">
                    Cancel
                  </Button>
                </Link>
                <Button 
                  type="submit" 
                  size="lg" 
                  className="rounded-full px-8 font-bold h-12 w-full md:w-auto"
                  disabled={updateUser.isPending}
                >
                  {updateUser.isPending && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                  Save Changes
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
