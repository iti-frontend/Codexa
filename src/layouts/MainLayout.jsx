import { Outlet } from "react-router-dom";
import Navbar from "../components/shared/Navbar";

function MainLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}
export default MainLayout;
