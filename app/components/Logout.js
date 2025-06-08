"use client";
import { useEffect } from "react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

export default function Logout({ onLogout }) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("user");
      Swal.fire({
        title: "Logout Berhasil",
        text: "Anda telah logout. Terima kasih telah menggunakan layanan kami.",
        icon: "success",
        confirmButtonColor: "#8b5cf6",
        confirmButtonText: "OK",
        customClass: {
          popup: "rounded-xl",
          confirmButton: "font-bold",
        },
      }).then(() => {
        if (onLogout) onLogout();
      });
    }
  }, [onLogout]);

  return null;
}