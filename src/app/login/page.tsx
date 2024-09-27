"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserLogin } from "../lib/action";

import Loading from "../components/Loading";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [signUp, setSignUp] = useState(true);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      const formData = {
        email: email,
        password: password,
      };

      const response = await UserLogin(formData);
      console.log(response);
      document.cookie = `token=${response.token}; path=/`;

      if (response) {
        router.push("/dashboard/home");
      }
    } catch (error) {
      setError("Incorrect email or password");
    } finally {
      setLoading(false);
    }
  };

  const toggleClick = () => {
    if (signUp === false) {
      setSignUp(true);
    } else if (signUp === true) {
      setSignUp(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      {loading && <Loading />}
      {signUp ? (
        <form
          onSubmit={handleLogin}
          className={`${loading? `hidden` : `block`} bg-white p-8 rounded shadow-md w-full max-w-sm h-auto max-h-[400px] font-poppins`}
        >
          <h1 className="text-2xl mb-6">Login</h1>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-main-green text-white py-2 rounded"
          >
            Login
          </button>
          <p className="text-center font-poppins mt-3 text-sm">
            Dont have an account?{" "}
            <span
              className="text-main-green underline cursor-pointer "
              onClick={toggleClick}
            >
              Signup
            </span>
          </p>
        </form>
      ) : (
        <form
          // onSubmit={handleLogin}
          className="bg-white p-8 rounded shadow-md w-full max-w-sm h-[430px] font-poppins "
        >
          <h1 className="text-2xl mb-6">Signup</h1>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <div className="flex gap-3">
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700">
                First Name
              </label>
              <input
                id="fname"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700">
                Last Name
              </label>
              <input
                id="lname"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded"
                required
              />
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-main-green text-white py-2 rounded"
          >
            Signup
          </button>
          <p className="text-center font-poppins mt-3 text-sm">
            Already have an account?
            <span
              className="text-main-green underline cursor-pointer"
              onClick={toggleClick}
            >
              Login
            </span>
          </p>
        </form>
      )}
    </div>
  );
}
