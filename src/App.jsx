import { RouterProvider } from "react-router-dom";
import { router } from "./routes/routes";
import { Toaster } from "./components/ui/sonner";

export default function App() {
  return (
    <>
      <Toaster position="top-center" />

      <RouterProvider router={router} />
    </>
  );
}
