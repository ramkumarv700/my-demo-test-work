
import { useState } from "react"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { login } from "../redux/slices/authSlice"
import Button from "../components/ui/Button"
import TextField from "../components/ui/TextField"
import loginImage from "../assets/image 1.png"
import brandLogo from "../assets/brandLogo.png"


function Login() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [email, setEmail] = useState("admin@example.com")
  const [password, setPassword] = useState("Admin123!")
  const [error, setError] = useState("")

  function handleSubmit(event) {
    event.preventDefault()
    setError("")

    if (
      email.trim().toLowerCase() === "admin@example.com" &&
      password === "Admin123!"
    ) {
      dispatch(
        login({
          email: email.trim(),
          name: "Admin",
          role: "Administrator",
        })
      )

      navigate("/dashboard", { replace: true })
    } else {
      setError("Invalid email or password.")
    }
  }

  return (
    <main className="grid min-h-screen grid-cols-1 bg-white lg:grid-cols-[40%_60%]">

      {/* Left: Login Form — 40% */}
      <section className="flex min-h-screen items-center justify-center px-6 py-10 sm:px-10 lg:min-h-screen lg:px-12 xl:px-16">
        <div className="w-full max-w-md">

          {/* Brand */}
          <div className="mb-10">
            <img
              src={brandLogo}
              alt="Workinfo login illustration"
              className="h-[200px] w-[200px] object-contain object-left"

            />
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              Welcome back
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              Sign in to your account to continue.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            <TextField
              label="Email address"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="admin@example.com"
              required
              autoComplete="username"
            />

            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              required
              autoComplete="current-password"
            />

            {error && (
              <p
                role="alert"
                className="text-sm text-red-600"
              >
                {error}
              </p>
            )}

            <Button
              type="submit"
              className="w-full rounded-full"
            >
              Login
            </Button>

          </form>

          <p className="mt-6 text-center text-xs text-slate-500">
            Sign in to access your Workinfo dashboard.
          </p>
        </div>
      </section>


      {/* Right: Image Area — 60% */}
      <section className="relative hidden min-h-screen items-center justify-center overflow-hidden bg-[#F5F6FF] p-8 lg:flex xl:p-12">
        <div className="flex h-full w-full items-center justify-center">
          <img
            src={loginImage}
            alt="Workinfo login illustration"
            className="h-[500px] w-[500px] object-contain"

          />
        </div>
      </section>


    </main>
  )
}

export default Login
