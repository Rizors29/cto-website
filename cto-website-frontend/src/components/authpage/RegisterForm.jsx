import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../utils/api";
import ENDPOINTS from "../../utils/endpoint";

function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      await api.post(ENDPOINTS.REGISTER, {
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });

      alert("Registrasi berhasil. Silakan login.");
      navigate("/login");

    } catch (err) {
      if (err.response && err.response.data.errors) {
        const validationErrors = err.response.data.errors;
        
        let errorMessage = "Terjadi kesalahan validasi:\n";
        for (const key in validationErrors) {
            errorMessage += `- ${validationErrors[key][0]}\n`;
        }
        setError(errorMessage);
        
      } else if (err.response && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Gagal terhubung ke server.");
      }
    }
  };

  return (
    <div className="flex h-screen bg-white">
      <div className="hidden lg:block w-1/2 bg-gray-100 relative">
         <div 
          className="h-full bg-cover bg-center"
          style={{ backgroundImage: 'url(/images/login.jpg)' }} 
        >
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 md:p-16">
        <div className="w-full max-w-sm">
          
          <h1 className="text-2xl font-semibold mb-2 text-gray-900">
            Create your Finnet Account
          </h1>
          <p className="text-gray-500 mb-8 text-sm">
            Only for users who have an email domain <strong className="text-blue-900">@finnet.co.id</strong>.
          </p>
          
          {error && (
            <p className="whitespace-pre-wrap bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm border border-red-200">
              {error}
            </p>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            
            {/* Nama Lengkap */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Fullname
              </label>
              <input
                id="name"
                type="text"
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter fullname"
                required
              />
            </div>
            
            {/* Email Address */}
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
                placeholder="Enter email (@finnet.co.id)"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
              />
            </div>
            
            {/* Konfirmasi Password */}
            <div>
              <label htmlFor="password-confirmation" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                id="password-confirmation"
                type="password"
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                placeholder="Confirm password"
                required
              />
            </div>

            {/* Tombol Register */}
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md text-sm font-medium text-white bg-blue-950/90 hover:bg-blue-950 cursor-pointer"
            >
              Register
            </button>
          </form>
          
          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-blue-900 hover:text-blue-950 underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterForm;