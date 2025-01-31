import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { IconUsers, IconArrowUpRight, IconChartBar, IconClock } from "@tabler/icons-react"

const stats = [
  {
    title: "Total Users",
    value: "2,340",
    change: "+12%",
    icon: IconUsers,
  },
  {
    title: "Active Projects",
    value: "45",
    change: "+8%",
    icon: IconChartBar,
  },
  {
    title: "Hours Saved",
    value: "1,200",
    change: "+24%",
    icon: IconClock,
  },
]

export default async function Dashboard() {
  const { userId } = await auth()
  
  if (!userId) {
    redirect("/")
  }

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-zinc-400">Welcome back to your workspace</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div 
            key={stat.title}
            className="p-6 rounded-2xl bg-black/50 backdrop-blur-sm border border-white/[0.08] hover:border-indigo-500/50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-400">{stat.title}</p>
                <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-4 text-sm text-emerald-500">
              <IconArrowUpRight className="h-4 w-4" />
              {stat.change} from last month
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="rounded-2xl bg-black/50 backdrop-blur-sm border border-white/[0.08] overflow-hidden">
        <div className="p-6 border-b border-white/[0.08]">
          <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
        </div>
        <div className="p-6">
          {/* Add your activity content here */}
        </div>
      </div>
    </div>
  )
} 