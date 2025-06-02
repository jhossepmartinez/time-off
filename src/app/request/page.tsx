"use client";
import React, { useState, useEffect } from "react";
import { createRequest, getRequestsByUserId } from "../api/requests/route";
import { RequestStatus, Role } from "@prisma/client";
import { useRouter } from "next/navigation";
import LogoutButton from "../../../components/LogOutButton/LogOutButton";

interface User {
  name: string;
  role: Role;
  days: number;
  id: string;
}

const RequestPage = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    days: 0,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<Request[]>([]);

  interface Request {
    id: number;
    days: number;
    userId: number;
    status: RequestStatus;
    createdAt: Date;
    updatedAt: Date;
    user: {
      name: string;
      role: Role;
    };
  }
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(userData) as User;
      setUser(parsedUser);

      const getRequests = async () => {
        const requests = await getRequestsByUserId(parsedUser.id);
        setRequests(requests);
      };
      getRequests();
    } catch (error) {
      console.error("Error parsing user data:", error);
      router.push("/login");
    } finally {
      setLoading(false);
    }
  }, [router]);

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      await createRequest({
        days: formData.days,
        userId: user.id,
      });
      setFormData({ days: 0 });
      setError("");
      setSuccess(true);
    } catch (error) {
      setSuccess(false);
      console.error("Error creating request:", error);
      if (error instanceof Error) {
        setError(error.message);
      }
    }
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!user) {
    return <div>No autorizado</div>;
  }

  return (
    <>
      <LogoutButton />
      <div className="card bg-base-200 w-96 shadow-sm">
        <div className="card-body">
          <h2 className="card-title">Registrar solicitud</h2>
          <form onSubmit={handleRequestSubmit}>
            {error && (
              <div className="alert alert-error mb-4">
                <span>{error}</span>
              </div>
            )}
            {success && (
              <div className="alert alert-success mb-4">
                <span>Solicitud enviada con éxito</span>
              </div>
            )}
            <fieldset>
              <legend className="legend">Número de días</legend>
              <input
                type="number"
                placeholder="12"
                className="input"
                value={formData.days}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    days: parseInt(e.target.value) || 0,
                  })
                }
                min="1"
                required
              />
              <div className="text-sm text-gray-500 mt-1">
                Días disponibles: {user.days}
              </div>
            </fieldset>
            <fieldset className="mt-4">
              <legend className="legend">Nombre solicitante</legend>
              <input
                disabled
                type="text"
                value={user.name}
                className="input"
                readOnly
              />
            </fieldset>
            <div className="card-actions justify-end mt-6">
              <button type="submit" className="btn btn-primary">
                Enviar solicitud
              </button>
            </div>
          </form>
        </div>
        <div className="card bg-base-200 w-full shadow-sm">
          <div className="card-body">
            <h2 className="card-title">Mis solicitudes</h2>
            {requests.length === 0 ? (
              <p>No hay solicitudes registradas</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Días</th>
                      <th>Estado</th>
                      <th>Fecha</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map((request) => (
                      <tr key={request.id}>
                        <td>{request.days}</td>
                        <td>
                          <span
                            className={`badge ${
                              request.status === "APPROVED"
                                ? "badge-success"
                                : request.status === "REJECTED"
                                  ? "badge-error"
                                  : "badge-warning"
                            }`}
                          >
                            {request.status}
                          </span>
                        </td>
                        <td>
                          {new Date(request.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default RequestPage;
