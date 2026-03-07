import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../utils/api";
import ENDPOINTS from "../../utils/endpoint";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await api.post(ENDPOINTS.LOGIN, {
        email,
        password,
      });

      const user = response.data.user;

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", user.role);
      localStorage.setItem("email", user.email);
      localStorage.setItem("name", user.name);

      navigate("/");
    } catch (err) {
      setError("Email atau password salah");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-white">
      <div className="hidden lg:block w-1/2 bg-gray-100 relative">
        <div
          className="h-full bg-cover bg-center"
          style={{ backgroundImage: "url(/images/login.jpg)" }}
        ></div>
      </div>
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 md:p-16">
        <div className="w-full max-w-sm">
          <img
            src="/images/weblogo.png"
            alt="Web Logo"
            className="h-auto w-auto mx-auto mb-10 px-10"
          />

          {error && (
            <p className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm border border-red-200">
              {error}
            </p>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>

              <div className="relative mt-1">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                  disabled={isLoading}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="text-sm text-right">
              <a href="/reset-password" onClick={(e) => isLoading && e.preventDefault()} className="font-semibold text-blue-900 hover:text-blue-950">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md text-sm font-medium text-white bg-blue-950/90 hover:bg-blue-950 disabled:opacity-70 cursor-pointer disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex flex-row items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm font-medium text-white">Processing...</span>
                </div>
              ) : (
                "Login"
              )}
            </button>
            <p className="mt-6 text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <Link to="/register" className="font-medium text-blue-900 hover:text-blue-950 underline">
                Register here
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;