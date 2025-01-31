import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

export default async function Dashboard() {
  const { userId } = await auth()
  
  if (!userId) {
    redirect("/")
  }


  return (
    <div className="container mx-auto px-4 py-24">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      {/* Add your dashboard content here */}
    </div>
  )
} 