import React from "react";

const PackagesDeals = ({ isDarkModeActive }) => {
  return (
    <div>
      {/* header */}
      <div className="flex justify-center items-center border-b-[2px] border-darkMode-dark500 shadow-2xl dark:shadow-xl dark:shadow-darkMode-dark500 p-5">
        <p className="text-4xl dark:text-darkMode-dark50">عروض الباقات</p>
      </div>
      {/* end */}
    </div>
  );
};

export default PackagesDeals;
