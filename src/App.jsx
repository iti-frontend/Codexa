import { RouterProvider } from "react-router-dom";
import { router } from "./routes/routes";

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}
