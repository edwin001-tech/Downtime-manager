import NavBar from "../components/NavBar";
import SideBar from "../components/SideBar";
import { AuthContext } from "../context/Auth";
import { Outlet } from "react-router-dom";

export default function Dashboard() {
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    role: "admin",
  };

  return (
    <AuthContext.Provider value={user}>
      <div className="antialiased bg-gray-50 dark:bg-gray-900 min-h-dvh">
        <NavBar />
        <SideBar />

        <main className="p-4 md:ml-64  pt-20">
          <Outlet />
        </main>
      </div>
    </AuthContext.Provider>
  );
}
