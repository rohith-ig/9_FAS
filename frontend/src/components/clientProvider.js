// components/ClientProvider.js

"use client";

import { useState } from "react";
import { Context } from "@/components/context.js";
import { Toaster } from "react-hot-toast";

export function ClientProvider({ children }) {
  const [userData, setUserData] = useState(null);

  return (
    <Context.Provider value={{ userData, setUserData }}>
      {children}
      <Toaster 
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#ffffff',
            color: '#1F3A5F',
            borderRadius: '12px',
            border: '1px solid #DCE3ED',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
            fontSize: '14px',
            fontWeight: '600'
          },
          success: {
            iconTheme: {
              primary: '#2E7D42',
              secondary: '#ffffff',
            },
            duration: 4000
          },
          error: {
            style: {
              color: '#B05555',
              borderColor: '#E4B8B8',
              backgroundColor: '#FDECEC'
            },
            iconTheme: {
              primary: '#B05555',
              secondary: '#ffffff',
            },
            duration: 5000
          },
        }}
      />
    </Context.Provider>
  );
}