"use client";

import Image from "next/image";
import { useEffect, useState, FormEvent } from "react";
import { TextField } from "@/components/ui/textfield";
import { User } from "@/lib/models";

export default function Home() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [users, setUsers] = useState<User[]>([]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("/api/create-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email }),
      });

      if (!response.ok) {
        throw new Error("Failed to create user");
      }

      setUsername("");
      setEmail("");
    } catch (err) {
      setError("Failed to submit form. Please try again.");
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/get-all-users");
      if (!response.ok) throw new Error("Failed to fetch users");
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError("Failed to fetch users");
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Sports Trivia</h1>
      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <TextField
          label="Username"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          label="Email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {error && <p className="text-red-500">{error}</p>}
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Submit
        </button>
      </form>

      <div className="space-y-4">
        <button
          onClick={fetchUsers}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          Show All Users
        </button>

        {users.length > 0 && (
          <div className="border rounded-md p-4">
            <h2 className="text-xl font-semibold mb-2">Users</h2>
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">ID</th>
                  <th className="text-left p-2">Username</th>
                  <th className="text-left p-2">Email</th>
                  <th className="text-left p-2">Registration Date</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.UserID} className="border-b">
                    <td className="p-2">{user.UserID}</td>
                    <td className="p-2">{user.Username}</td>
                    <td className="p-2">{user.Email}</td>
                    <td className="p-2">
                      {user.RegistrationDate.toISOString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
