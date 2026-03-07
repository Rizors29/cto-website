import { Link } from 'react-router-dom';

function ForgotPasswordForm() {
  return (
    <div className="flex h-screen w-full bg-white">
      <div className="hidden md:flex md:w-1/2 bg-gray-100 justify-center items-center">
        <img src="/images/login.jpg" alt="Reset Password" className="object-cover h-full w-full" />
      </div>

      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-10">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold mb-4 text-blue-950">Reset Password</h2>
          <p className="text-gray-500 mb-6">Enter your email and we'll send you a link to reset your password.</p>
          
          <form>
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Email</label>
              <input type="email" className="w-full py-2 px-3 border border-gray-300 rounded" placeholder="Enter email" />
            </div>
            
            <button className="w-full bg-blue-950/90 text-white py-2 rounded font-semibold hover:bg-blue-950 transition cursor-pointer">
              Send Link
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/login" className="text-sm text-blue-900 hover:text-blue-950 font-semibold underline">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;