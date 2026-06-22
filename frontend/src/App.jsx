import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import DynamicFavicon from "./components/DynamicFavicon";

import ProtectedRoute from "./routes/ProtectedRoute";

/* Layouts */
import PublicLayout from "./layouts/PublicLayout";
import AdminLayout from "./layouts/AdminLayout";
import SuperAdminLayout from "./layouts/SuperAdminLayout";

/* Login */
import AdminLogin from "./pages/admin/AdminLogin";

/* Public Pages */
import HomePage from "./pages/public/home/HomePage";
import AboutPage from "./pages/public/about/AboutPage";
import ActivitiesPage from "./pages/public/activities/ActivitiesPage";
import ActivityDetailsPage from "./pages/public/activities/ActivityDetailsPage";
import NewsPage from "./pages/public/news/NewsPage";
import NewsDetailsPage from "./pages/public/news/NewsDetailsPage";
import GalleryPage from "./pages/public/gallery/GalleryPage";
import TeamPage from "./pages/public/team/TeamPage";
import MembersPage from "./pages/public/members/MembersPage";
import VolunteersPage from "./pages/public/volunteers/VolunteersPage";
import ContactPage from "./pages/public/contact/ContactPage";
import VolunteerApplyPage from "./pages/public/volunteer-apply/VolunteerApplyPage";
import ThankYouPage from "./pages/public/thank-you/ThankYouPage";
import PrivacyPolicyPage from "./pages/public/privacy-policy/PrivacyPolicyPage";
import TermsOfServicePage from "./pages/public/terms-of-service/TermsOfServicePage";

/* Admin Pages */
import AdminDashboard from "./pages/admin/dashboard/AdminDashboard";
import MemberManagement from "./pages/admin/members/MemberManagement";
import VolunteerManagement from "./pages/admin/volunteers/VolunteerManagement";
import ActivityManagement from "./pages/admin/activities/ActivityManagement";
import NewsManagement from "./pages/admin/news/NewsManagement";
import GalleryManagement from "./pages/admin/gallery/GalleryManagement";
import TeamManagement from "./pages/admin/team/TeamManagement";
import ContactManagement from "./pages/admin/contact/ContactManagement";
import SettingsPage from "./pages/admin/settings/SettingsManagement";

/* Super Admin Pages */
import SuperAdminDashboard from "./pages/super-admin/dashboard/SuperAdminDashboard";
import AdminManagement from "./pages/super-admin/admins/AdminManagement";
import SuperVolunteerManagement from "./pages/super-admin/volunteers/VolunteerManagement";

import SuperMemberManagement from "./pages/super-admin/members/MemberManagement";
import SuperActivityManagement from "./pages/super-admin/activities/ActivityManagement";
import SuperNewsManagement from "./pages/super-admin/news/NewsManagement";
import SuperGalleryManagement from "./pages/super-admin/gallery/GalleryManagement";
import SuperTeamManagement from "./pages/super-admin/team/TeamManagement";
import SuperContactManagement from "./pages/super-admin/contact/ContactManagement";
import SuperSettingsPage from "./pages/super-admin/settings/SettingsManagement";


function App() {
  return (
    <AuthProvider>
      <DynamicFavicon />
      <BrowserRouter>

        <Routes>

          {/* PUBLIC */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/activities" element={<ActivitiesPage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route
              path="/news/:slug"
              element={<NewsDetailsPage />}
            />

            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/team" element={<TeamPage />} />
            <Route path="/members" element={<MembersPage />} />
            <Route path="/volunteers" element={<VolunteersPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route
              path="/volunteer-apply"
              element={<VolunteerApplyPage />}
            />
            <Route
              path="/thank-you"
              element={<ThankYouPage />}
            />
            <Route
              path="/activities/:slug"
              element={<ActivityDetailsPage />}
            />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/terms-of-service" element={<TermsOfServicePage />} />
          </Route>

          {/* LOGIN */}
          <Route
            path="/login"
            element={<AdminLogin />}
          />

          {/* ADMIN */}
          <Route
            element={
              <ProtectedRoute
                roles={[
                  "admin",
                  "super_admin",
                ]}
              >
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route
              path="/admin/dashboard"
              element={<AdminDashboard />}
            />

            <Route
              path="/admin/members"
              element={<MemberManagement />}
            />

            <Route
              path="/admin/volunteers"
              element={<VolunteerManagement />}
            />

            <Route
              path="/admin/activities"
              element={<ActivityManagement />}
            />

            <Route
              path="/admin/news"
              element={<NewsManagement />}
            />

            <Route
              path="/admin/gallery"
              element={<GalleryManagement />}
            />

            <Route
              path="/admin/team"
              element={<TeamManagement />}
            />

            <Route
              path="/admin/contact"
              element={<ContactManagement />}
            />

            <Route
              path="/admin/settings"
              element={<SettingsPage />}
            />
          </Route>

          {/* SUPER ADMIN */}
          <Route
            element={
              <ProtectedRoute
                roles={["super_admin"]}
              >
                <SuperAdminLayout />
              </ProtectedRoute>
            }
          >
            <Route
              path="/super-admin/dashboard"
              element={<SuperAdminDashboard />}
            />

            <Route
              path="/super-admin/admins"
              element={<AdminManagement />}
            />

            <Route
              path="/super-admin/volunteers"
              element={<SuperVolunteerManagement />}
            />

            <Route
              path="/super-admin/members"
              element={<SuperMemberManagement />}
            />

            <Route
              path="/super-admin/activities"
              element={<SuperActivityManagement />}
            />

            <Route
              path="/super-admin/news"
              element={<SuperNewsManagement />}
            />

            <Route
              path="/super-admin/gallery"
              element={<SuperGalleryManagement />}
            />

            <Route
              path="/super-admin/team"
              element={<SuperTeamManagement />}
            />

            <Route
              path="/super-admin/contact"
              element={<SuperContactManagement />}
            />

            <Route
              path="/super-admin/settings"
              element={<SuperSettingsPage />}
            />
          </Route>

          {/* 404 */}
          <Route
            path="*"
            element={
              <Navigate
                to="/"
                replace
              />
            }
          />

        </Routes>

      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;