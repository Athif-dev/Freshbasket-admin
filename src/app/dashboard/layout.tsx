import Sidebar from "../components/sidebar";
import Navbar from "../components/navbar";
import { Inter } from "next/font/google";
import ReduxProvider from "../store/reduxProvider";

const inter = Inter({ subsets: ["latin"] });

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={inter.className}>
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex flex-col overflow-y-auto scrollbar-thin px-6 flex-1">
          <Navbar />
          <main className="flex-1 py-4">
            <ReduxProvider>{children}</ReduxProvider>
          </main>
        </div>
      </div>
    </div>
  );
}
