import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, Router as WouterRouter } from 'wouter';

import { Home } from '@/pages/home';
import { Browse } from '@/pages/browse';
import { ProfileDetail } from '@/pages/profile';
import { EditProfile } from '@/pages/profile/edit';
import { Register } from '@/pages/auth/register';
import { Payment } from '@/pages/payment';
import { AdminPayments } from '@/pages/admin/payments';

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/browse" component={Browse} />
      <Route path="/profile/:id" component={ProfileDetail} />
      <Route path="/edit-profile/:id" component={EditProfile} />
      <Route path="/register" component={Register} />
      <Route path="/payment" component={Payment} />
      <Route path="/admin/payments" component={AdminPayments} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
