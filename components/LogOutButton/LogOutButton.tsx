"use client";
import { useRouter } from "next/navigation";

const LogoutButton = () => {
  const router = useRouter();

  const handleLogout = () => {
    // Remove user from localStorage
    localStorage.removeItem("user");
    // Redirect to login page
    router.push("/login");
    // Optional: refresh the page to clear any state
    router.refresh();
  };

  return (
    <button onClick={handleLogout} className="btn btn-error btn-sm">
      Cerrar sesión
    </button>
  );
};

export default LogoutButton;
