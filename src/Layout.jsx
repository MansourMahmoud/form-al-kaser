import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Toaster } from "react-hot-toast";
import Quote from "./pages/quote";

const Layout = () => {
  const [isDarkModeActive, setIsDarkModeActive] = useState(false);

  return (
    <div
      className={`${
        isDarkModeActive ? "dark:bg-darkMode-dark950" : "bg-main-bg"
      }`}
    >
      <Toaster position="top-center" reverseOrder={false} />

      <Header setIsDarkModeActive={setIsDarkModeActive} />
      <Routes>
        <Route
          path="/"
          element={<Quote isDarkModeActive={isDarkModeActive} />}
        />
      </Routes>
      <Footer />
    </div>
  );
};

export default Layout;
