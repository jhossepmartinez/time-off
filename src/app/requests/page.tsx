"use client";
import React, { useEffect, useState } from "react";
import { getRequests, updateRequestStatus } from "../api/requests/route";
import { useRouter } from "next/navigation";
import { RequestStatus } from "@prisma/client";
import LogoutButton from "../../../components/LogOutButton/LogOutButton";

interface Request {
  id: number;
  days: number;
  userId: number;
  createdAt: Date;
  status: RequestStatus;
  user: {
    name: string;
    role: string;
  };
}

const SupervisorPage = () => {
  const router = useRouter();
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const checkAuth = () => {
      const userData = localStorage.getItem("user");
      if (!userData) {
        router.push("/login");
        return false;
      }

      try {
        const user = JSON.parse(userData);
        if (user.role !== "SUPERVISOR") {
          router.push("/unauthorized");
          return false;
        }
        return true;
      } catch (error) {
        router.push("/login");
        return false;
      }
    };

    const fetchRequests = async () => {
      if (!checkAuth()) return;

      try {
        const data = await getRequests();
        console.log("Data:", data);
        setRequests(data);
      } catch (error) {
        console.error("Error fetching requests:", error);
        setError("Error al cargar las solicitudes");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [router]);

  const handleApprove = async (id: number) => {
    try {
      await updateRequestStatus(id, RequestStatus.APPROVED);
      setRequests((prev) =>
        prev.map((request) =>
          request.id === id
            ? { ...request, status: RequestStatus.APPROVED }
            : request,
        ),
      );
    } catch (error) {
      console.error("Error updating request status:", error);
    }
  };

  const handleReject = async (id: number) => {
    try {
      await updateRequestStatus(id, RequestStatus.REJECTED);
      setRequests((prev) =>
        prev.map((request) =>
          request.id === id
            ? { ...request, status: RequestStatus.REJECTED }
            : request,
        ),
      );
    } catch (error) {
      console.error("Error updating request status:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <>
        <LogoutButton />
        <div className="alert alert-error max-w-md mx-auto mt-8">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{error}</span>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Panel de Supervisor</h1>
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>ID</th>
                <th>Solicitante</th>
                <th>Días</th>
                <th>Fecha</th>
                <th>Rol</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request.id}>
                  <td>{request.id}</td>
                  <td>{request.user.name}</td>
                  <td>{request.days}</td>
                  <td>{new Date(request.createdAt).toLocaleDateString()}</td>
                  <td>{request.user.role}</td>
                  <td>{request.status}</td>
                  <td>
                    <button
                      className="btn btn-primary mr-2"
                      onClick={() => handleApprove(request.id)}
                    >
                      Aprobar
                    </button>
                    <button
                      className="btn btn-error"
                      onClick={() => handleReject(request.id)}
                    >
                      Rechazar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {requests.length === 0 && (
            <div className="text-center py-8">
              <p>No hay solicitudes pendientes</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SupervisorPage;
