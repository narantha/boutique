import React from "react";
import Footer from "../components/Footer";
import WhatsappButton from "../components/WhatsappButton";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <WhatsappButton />
    </div>
  );
}
