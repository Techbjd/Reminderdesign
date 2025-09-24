import React, { useState } from "react";
import image from "../assets/Nodata.jpg";

function Assets() {
  const [activeTab, setActiveTab] = useState("device"); // device | history

  // Mock Data
  const myDeviceData = []; // empty means "no data" for My Device
  const historyData = [
    {
      device: "Laptop",
      category: "Electronics",
      startDate: "2025-01-10",
      returnDate: "2025-06-10",
      status: "Returned",
    },
    {
      device: "Mouse",
      category: "Accessories",
      startDate: "2025-03-01",
      returnDate: "2025-03-15",
      status: "Pending",
    },
  ];

  const renderTableHeader = (headers) => (
    <div className="grid grid-cols-6 text-center font-semibold text-black bg-blue-100 py-3 rounded-md mt-4">
      {headers.map((h, i) => (
        <span key={i}>{h}</span>
      ))}
    </div>
  );

  return (
    <div className="w-full bg-white min-h-screen p-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-black">Device Tracker</h1>

        {/* Tabs */}
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab("device")}
            className={`px-4 py-2 rounded-md font-medium ${
              activeTab === "device"
                ? "bg-blue-600 text-white"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            My Device
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`px-4 py-2 rounded-md font-medium ${
              activeTab === "history"
                ? "bg-blue-600 text-white"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            History
          </button>
        </div>

        {/* My Device View */}
        {activeTab === "device" && (
          <>
            {renderTableHeader([
              "Device",
              "Action",
              "Category",
              "Assigned Date",
              "Brand",
              "Note",
              
            ])}

            {myDeviceData.length === 0 ? (
              <div className="flex flex-col items-center  mt-12">
                <img
                  src={image}
                  alt="No Data Available"
                  className="w-64 h-64 object-contain"
                />
                <p className="text-black font-medium mt-4">No data available</p>
              </div>
            ) : (
              myDeviceData.map((d, idx) => (
                <div
                  key={idx}
                  className="flex flex-col text-center py-2 border-b border-gray-200 items-center"
                >
                  <span>{d.device}</span>
                  <span>{d.category}</span>
                  <span>{d.assignedDate}</span>
                  <span>{d.brand}</span>
                  <span>{d.note}</span>
                  <span>{d.action}</span>
                </div>
              ))
            )}
          </>
        )}

        {/* History View */}
        {activeTab === "history" && (
          <>
            {renderTableHeader([
              "Device",
              "Category",
              "Start Date",
              "Return Date",
              "Status",
            ])}

            {historyData.length === 0 ? (
              <div className="flex flex-col items-center justify-center mt-12">
                <img
                  src={image}
                  alt="No Data Available"
                  className="w-64 h-64 object-contain"
                />
                <p className="text-black font-medium mt-4">No history found</p>
              </div>
            ) : (
              historyData.map((d, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-5 text-center py-2 border-b border-gray-200"
                >
                  <span>{d.device}</span>
                  <span>{d.category}</span>
                  <span>{d.startDate}</span>
                  <span>{d.returnDate}</span>
                  <span
                    className={`font-medium ${
                      d.status === "Returned" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {d.status}
                  </span>
                </div>
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Assets;
