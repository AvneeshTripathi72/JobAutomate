import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Jobs from "@/pages/Jobs";
import Employers from "@/pages/Employers";
import UploadJobDescription from "@/pages/employers/UploadJobDescription";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Industries from "@/pages/Industries";
import Services from "@/pages/Services";
import Admin from "@/pages/Admin";
import SubmitResume from "@/pages/SubmitResume";
import CareerAdvice from "@/pages/CareerAdvice";
import CRM from "@/pages/CRM";
import ATS from "@/pages/ATS";
import SignIn from "@/pages/SignIn";
import Roadmap from "@/pages/Roadmap";
import VendorRegistration from "@/pages/VendorRegistration";
import JobSeekerAuth from "@/pages/JobSeekerAuth";
import JobSeekerDashboard from "@/pages/JobSeekerDashboard";
import ResetPassword from "@/pages/ResetPassword";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";
import Locations from "@/pages/Locations";
import SalaryGuide from "@/pages/SalaryGuide";
import GetStarted from "@/pages/GetStarted";
import AIRecruiter from "@/pages/AIRecruiter";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";
import AgastyaChat from "@/components/AgastyaChat";
import SuperAdmin from "@/pages/SuperAdmin";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/jobs" component={Jobs} />
      <Route path="/submit-cv"><Redirect to="/submit-resume" /></Route>
      <Route path="/submit-resume" component={SubmitResume} />
      <Route path="/apply/:id" component={SubmitResume} />
      <Route path="/career-advice" component={CareerAdvice} />
      <Route path="/employers" component={Employers} />
      <Route path="/upload-job-description" component={UploadJobDescription} />
      <Route path="/industries" component={Industries} />
      <Route path="/services" component={Services} />
      <Route path="/crm" component={CRM} />
      <Route path="/ats" component={ATS} />
      <Route path="/signin" component={SignIn} />
      <Route path="/login" component={SignIn} />
      <Route path="/crm/login"><Redirect to="/signin" /></Route>
      <Route path="/ats/login"><Redirect to="/signin" /></Route>
      <Route path="/ats-login"><Redirect to="/signin" /></Route>
      <Route path="/ats-signin"><Redirect to="/signin" /></Route>
      <Route path="/vendor-registration" component={VendorRegistration} />
      <Route path="/jobseeker-auth" component={JobSeekerAuth} />
      <Route path="/candidate-auth"><Redirect to="/jobseeker-auth" /></Route>
      <Route path="/jobseeker-dashboard" component={JobSeekerDashboard} />
      <Route path="/dashboard"><Redirect to="/jobseeker-dashboard" /></Route>
      <Route path="/reset-password" component={ResetPassword} />
      <Route path="/roadmap" component={Roadmap} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/terms" component={Terms} />
      <Route path="/locations" component={Locations} />
      <Route path="/salary-guide" component={SalaryGuide} />
      <Route path="/get-started" component={GetStarted} />
      <Route path="/ai-recruiter" component={AIRecruiter} />
      <Route path="/demo"><Redirect to="/get-started" /></Route>
      <Route path="/request-demo"><Redirect to="/get-started" /></Route>
      <Route path="/auth"><Redirect to="/signin" /></Route>
      <ProtectedRoute path="/admin" component={Admin} />
      <ProtectedRoute path="/admin/:section" component={Admin} />
      <ProtectedRoute path="/super-admin" component={SuperAdmin} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
          <AgastyaChat />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
