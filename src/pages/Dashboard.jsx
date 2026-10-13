function Dashboard() {

  const stats = [
    {
      title: "Total Users",
      value: "12,540",
      change: "+12%"
    },
    {
      title: "Revenue",
      value: "$45,230",
      change: "+8%"
    },
    {
      title: "Orders",
      value: "1,240",
      change: "+15%"
    },
    {
      title: "Conversion",
      value: "8.4%",
      change: "+2.4%"
    }
  ]

  return (

    <div className="space-y-6">

      {/* Heading */}

      <div>

        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
          Dashboard
        </h1>

        <p className="mt-1 text-sm text-gray-500 sm:text-base">
          Welcome back to your dashboard.
        </p>

      </div>


      {/* Cards */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {stats.map((item) => (

          <div
            key={item.title}
            className="rounded-xl border bg-white p-5 shadow-sm sm:p-6"
          >

            <p className="text-sm text-gray-500">
              {item.title}
            </p>

            <h2 className="mt-3 text-2xl font-bold text-gray-900 sm:text-3xl">
              {item.value}
            </h2>

            <p className="mt-3 text-sm font-medium text-green-600">
              {item.change}
            </p>

          </div>

        ))}

      </div>

    </div>

  )
}

export default Dashboard