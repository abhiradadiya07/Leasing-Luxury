import Header from "./components/Header";
import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster"
const Layout = () => {
  return (
    <div className="p-4 flex flex-col min-h-screen">
      <Header />
      <Outlet />
      <Toaster/>
    </div>
  );
};

export default Layout;
