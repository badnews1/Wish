"use client";

import { Toaster as Sonner, ToasterProps } from "sonner@2.0.3";

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      position="top-center"
      toastOptions={{
        style: {
          background: 'white',
          color: 'var(--color-text)',
          border: '1px solid var(--color-border)',
          borderRadius: '12px',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
