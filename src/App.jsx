import { Routes, Route, Link } from "react-router-dom";
import Landing from "@/pages/Landing.jsx";
import Login from "@/pages/Login.jsx";
import Register from "@/pages/Register.jsx";
import Dashboard from "@/pages/Dashboard.jsx";
import Verify from "@/pages/Verify.jsx";
import LandsList from "@/pages/LandsList.jsx";
import LandsNew from "@/pages/LandsNew.jsx";
import LandDetail from "@/pages/LandDetail.jsx";
import TransfersList from "@/pages/TransfersList.jsx";
import TransfersNew from "@/pages/TransfersNew.jsx";
import TransferDetail from "@/pages/TransferDetail.jsx";
import AdminUsers from "@/pages/AdminUsers.jsx";

function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 font-display text-xl font-semibold">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/verify" element={<Verify />} />
      <Route path="/lands" element={<LandsList />} />
      <Route path="/lands/new" element={<LandsNew />} />
      <Route path="/lands/:landId" element={<LandDetail />} />
      <Route path="/transfers" element={<TransfersList />} />
      <Route path="/transfers/new" element={<TransfersNew />} />
      <Route path="/transfers/:transferId" element={<TransferDetail />} />
      <Route path="/admin/users" element={<AdminUsers />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
