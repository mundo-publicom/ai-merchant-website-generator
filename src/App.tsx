import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { LandingPage } from "@/pages/LandingPage";
import { WizardPage } from "@/pages/WizardPage";
import { GeneratingPage } from "@/pages/GeneratingPage";
import { ResultsPage } from "@/pages/ResultsPage";
import { Toaster } from "@/components/ui/Toast";
import { useProjectStore } from "@/store/useProjectStore";

export default function App() {
  const hydrate = useProjectStore((state) => state.hydrate);
  const hydrated = useProjectStore((state) => state.hydrated);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  if (!hydrated) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-canvas">
        <span className="sr-only">Loading</span>
      </div>
    );
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/plan" element={<Navigate to="/plan/basics" replace />} />
        <Route path="/plan/:stepId" element={<WizardPage />} />
        <Route path="/generating" element={<GeneratingPage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster />
    </>
  );
}
