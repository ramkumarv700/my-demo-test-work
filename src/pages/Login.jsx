import { useState } from "react"

import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"

import { login } from "../redux/slices/authSlice"

function Login() {

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const [error, setError] = useState("")


  const handleSubmit = (e) => {

    e.preventDefault()

    setError("")


    // Demo credentials

    if (
      email === "admin@gmail.com" &&
      password === "123456"
    ) {

      // Redux me login state save

      dispatch(
        login({
          name: "Admin",
          email: email,
          role: "Administrator"
        })
      )


      // Dashboard par bhejo

      navigate("/dashboard")

    } else {

      setError(
        "Invalid email or password"
      )

    }

  }


  return (

    <div className="min-h-screen bg-gray-50">

      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[40%_60%]">

        {/* LEFT — LOGIN */}

        <div className="flex items-center justify-center px-6 py-10 sm:px-10">

          <div className="w-full max-w-md">

            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back
            </h1>

            <p className="mt-2 text-gray-500">
              Login to your account
            </p>


            <form
              onSubmit={handleSubmit}
              className="mt-8 space-y-5"
            >

              {/* Email */}

              <div>

                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Email
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  placeholder="Enter your email"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

              </div>


              {/* Password */}

              <div>

                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Password
                </label>

                <input
                  type="password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  placeholder="Enter your password"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

              </div>


              {/* Error */}

              {error && (

                <p className="text-sm font-medium text-red-600">
                  {error}
                </p>

              )}


              {/* Login */}

              <button
                type="submit"
                className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700"
              >
                Login
              </button>

            </form>


            {/* Demo credentials */}

            <div className="mt-6 rounded-lg bg-blue-50 p-4">

              <p className="text-sm font-semibold text-blue-900">
                Demo Login
              </p>

              <p className="mt-1 text-sm text-blue-700">
                Email: admin@gmail.com
              </p>

              <p className="text-sm text-blue-700">
                Password: 123456
              </p>

            </div>

          </div>

        </div>


        {/* RIGHT — IMAGE / CONTENT */}

        <div className="hidden items-center justify-center bg-gray-100 p-8 lg:flex">

          <div className="max-w-2xl">

            <h2 className="text-4xl font-bold text-gray-900">
              Manage everything
              <br />
              from one place.
            </h2>

            <p className="mt-4 text-lg text-gray-500">
              A simple and powerful dashboard
              for managing your business.
            </p>

            <img
              src="/src/assets/login-image.png"
              alt="Login"
              className="mt-8 w-full rounded-2xl object-cover"
            />

          </div>

        </div>

      </div>

    </div>

  )
}

export default Login