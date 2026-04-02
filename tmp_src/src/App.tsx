import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import ScrollToTop from "@/components/ScrollToTop";

// Pages
import WelcomeSelector from "./pages/WelcomeSelector";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Testimonials from "./pages/Testimonials";

// Professional
import ProfessionalHome from "./pages/professional/ProfessionalHome";
import ProfessionalServices from "./pages/professional/ProfessionalServices";
import ProfessionalPortfolio from "./pages/professional/ProfessionalPortfolio";
import RequestProposal from "./pages/professional/RequestProposal";
import BrowseEvents from "./pages/professional/BrowseEvents";
import EventDetail from "./pages/professional/EventDetail";
import MyTickets from "./pages/professional/MyTickets";
import MyProposals from "./pages/professional/MyProposals";

// Social
import SocialHome from "./pages/social/SocialHome";
import SocialServices from "./pages/social/SocialServices";
import SocialGallery from "./pages/social/SocialGallery";
import BookConsultation from "./pages/social/BookConsultation";
import SocialTemplates from "./pages/social/SocialTemplates";
import SocialCreate from "./pages/social/SocialCreate";
import SocialEventPage from "./pages/social/SocialEventPage";
import SocialInvitations from "./pages/social/SocialInvitations";

// Admin
import AdminLayout from "./pages/admin/AdminLayout";
import AdminOverview from "./pages/admin/AdminOverview";
import AdminEvents from "./pages/admin/AdminEvents";
import AdminAttendees from "./pages/admin/AdminAttendees";
import AdminTickets from "./pages/admin/AdminTickets";
import AdminRSVPs from "./pages/admin/AdminRSVPs";
import AdminPromotionRequests from "./pages/admin/AdminPromotionRequests";
import AdminCheckin from "./pages/admin/AdminCheckin";
import AdminMessaging from "./pages/admin/AdminMessaging";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminMedia from "./pages/admin/AdminMedia";
import AdminSettings from "./pages/admin/AdminSettings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <ScrollToTop />
          <Routes>
            {/* Public */}
            <Route path="/" element={<WelcomeSelector />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/testimonials" element={<Testimonials />} />

            {/* Professional Portal */}
            <Route path="/professional" element={<ProfessionalHome />} />
            <Route path="/professional/services" element={<ProfessionalServices />} />
            <Route path="/professional/portfolio" element={<ProfessionalPortfolio />} />
            <Route path="/professional/request-proposal" element={<RequestProposal />} />
            <Route path="/professional/events" element={<BrowseEvents />} />
            <Route path="/professional/events/:slug" element={<EventDetail />} />
            <Route path="/professional/my-tickets" element={<MyTickets />} />
            <Route path="/professional/my-proposals" element={<ProtectedRoute requiredRole="USER"><MyProposals /></ProtectedRoute>} />
            <Route path="/professional/signin" element={<SignIn />} />

            {/* Social Portal */}
            <Route path="/social" element={<SocialHome />} />
            <Route path="/social/services" element={<SocialServices />} />
            <Route path="/social/gallery" element={<SocialGallery />} />
            <Route path="/social/book-consultation" element={<BookConsultation />} />
            <Route path="/social/templates" element={<SocialTemplates />} />
            <Route path="/social/create" element={<SocialCreate />} />
            <Route path="/social/e/:slug" element={<SocialEventPage />} />
            <Route path="/social/invitations" element={<SocialInvitations />} />
            <Route path="/social/signin" element={<SignIn />} />

            {/* Admin Dashboard (Protected) */}
            <Route path="/admin" element={<ProtectedRoute requiredRole="CONTENT_MANAGER"><AdminLayout /></ProtectedRoute>}>
              <Route index element={<AdminOverview />} />
              <Route path="events" element={<AdminEvents />} />
              <Route path="attendees" element={<AdminAttendees />} />
              <Route path="proposals" element={<AdminPromotionRequests />} />
              <Route path="tickets" element={<AdminTickets />} />
              <Route path="rsvps" element={<AdminRSVPs />} />
              <Route path="checkin" element={<AdminCheckin />} />
              <Route path="messaging" element={<AdminMessaging />} />
              <Route path="media" element={<AdminMedia />} />
              <Route path="analytics" element={<AdminAnalytics />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
