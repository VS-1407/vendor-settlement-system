import { useState } from "react";
import { Eye, EyeOff, Lock, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { Navigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await api.post(
        `/login?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
      );

      localStorage.setItem(
        "token",
        response.data.access_token
      );

      localStorage.setItem(
        "role",
        response.data.role
      );

      navigate("/");

    } catch (error) {

      alert(
        error.response?.data?.detail || "Login Failed"
      );

    } finally {

      setLoading(false);

    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-indigo-600 to-slate-900">

      <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-md">

        <div className="text-center mb-8">

          <h1 className="text-4xl font-bold text-slate-800">
            VendorPay
          </h1>

          <p className="text-gray-500 mt-2">
            Login to continue
          </p>

        </div>

        <form
          onSubmit={handleLogin}
          className="space-y-6"
        >

          <div>

            <label className="text-sm font-medium">
              Username
            </label>

            <div className="flex items-center border rounded-xl mt-2 px-4">

              <User size={20} className="text-gray-400"/>

              <input
                className="w-full p-3 outline-none"
                placeholder="Username"
                value={username}
                onChange={(e)=>setUsername(e.target.value)}
              />

            </div>

          </div>

          <div>

            <label className="text-sm font-medium">
              Password
            </label>

            <div className="flex items-center border rounded-xl mt-2 px-4">

              <Lock size={20} className="text-gray-400"/>

              <input
                className="w-full p-3 outline-none"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
              >
                {showPassword ? <EyeOff/> : <Eye/>}
              </button>

            </div>

          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

      </div>

    </div>
  );
  const token = localStorage.getItem("token");

if (token) {
  return <Navigate to="/" replace />;
}
}