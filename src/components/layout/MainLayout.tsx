import { ReactNode, useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { initializeData, isDataInitialized } from "@/data/initData";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Force initialize on first load if no data exists
    if (!isDataInitialized()) {
      initializeData(true);
    } else {
      initializeData(false);
    }
    setIsReady(true);
  }, []);

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="text-4xl mb-4">🎄</div>
          <p className="text-muted-foreground">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default MainLayout;
