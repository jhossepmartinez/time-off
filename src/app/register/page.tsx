"use client";
import { Role } from "@prisma/client";
import React, { useState } from "react";
import { createUser } from "../api/users/route";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    password: "",
    role: Role.REQUESTER,
  });
  const [error, setError] = useState("");

  const roles = Object.values(Role);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUser(formData);
      // Reset form or show success message
      setFormData({
        name: "",
        password: "",
        role: Role.REQUESTER,
      });
      router.push("/login");
    } catch (error) {
      console.error("Error creating user:", error);
      if (error instanceof Error) {
        setError(error.message);
      }
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="card bg-base-200 w-96 shadow-sm">
      <div className="card-body">
        <h2 className="card-title">Registro usuario</h2>
        <form onSubmit={handleSubmit}>
          <fieldset>
            <legend className="legend">Nombre usuario</legend>
            <input
              type="text"
              name="name"
              placeholder="Jhossep"
              className="input input-bordered w-full"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </fieldset>
          <fieldset>
            <legend className="legend">Contraseña</legend>
            <input
              type="password"
              name="password"
              placeholder="123456"
              className="input input-bordered w-full"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </fieldset>
          <fieldset>
            <legend className="legend">Rol</legend>
            <select
              name="role"
              className="select select-bordered w-full"
              value={formData.role}
              onChange={handleChange}
            >
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </fieldset>
          {error && (
            <div role="alert" className="alert alert-error mt-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="h-6 w-6 shrink-0 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <span>{error}</span>
            </div>
          )}
          <div className="card-actions justify-end mt-4">
            <button type="submit" className="btn btn-primary">
              Registrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Page;
