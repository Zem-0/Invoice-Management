"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";
import { 
  IconPackage, 
  IconCurrencyDollar, 
  IconArrowUpRight,
  IconUsers,
  IconChartBar,
  IconClock
} from "@tabler/icons-react";

interface DashboardStats {
  totalProducts: number;
  totalValue: number;
  averagePrice: number;
  lowStock: number;
}

interface Activity {
  id: string;
  type: 'product_added' | 'product_updated' | 'profile_updated';
  description: string;
  created_at: string;
}

export default function Dashboard() {
  const { user } = useUser();
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalValue: 0,
    averagePrice: 0,
    lowStock: 0
  });
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    if (user) {
      fetchStats();
      fetchActivities();
    }
  }, [user]);

  const fetchStats = async () => {
    try {
      const { data: products, error } = await supabase
        .from('products')
        .select('*')
        .eq('user_id', user?.id);

      if (error) throw error;

      const totalProducts = products?.length || 0;
      const totalValue = products?.reduce((sum, product) => sum + (product.price * product.stock), 0) || 0;
      const averagePrice = totalProducts > 0 ? products?.reduce((sum, product) => sum + product.price, 0) / totalProducts : 0;
      const lowStock = products?.filter(product => product.stock < 10).length || 0;

      setStats({
        totalProducts,
        totalValue,
        averagePrice,
        lowStock
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };
  const fetchActivities = async () => {
    try {
      const { data: products, error } = await supabase
        .from('products')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(5);
  
      if (error) throw error;
  
      const activities = products?.map(product => ({
        id: product.uuid,
        type: 'product_added' as const, // Type assertion here
        description: `Added product: ${product.name}`,
        created_at: product.created_at
      }));
  
      setActivities(activities || []);
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  };

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-200">
          Dashboard
        </h1>
        <p className="text-zinc-400">Welcome back to your workspace</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: "Total Products",
            value: stats.totalProducts,
            change: "+12%",
            icon: IconPackage,
            color: "from-blue-500 to-blue-600"
          },
          {
            title: "Total Value",
            value: `$${stats.totalValue.toFixed(2)}`,
            change: "+8%",
            icon: IconCurrencyDollar,
            color: "from-green-500 to-green-600"
          },
          {
            title: "Average Price",
            value: `$${stats.averagePrice.toFixed(2)}`,
            change: "+15%",
            icon: IconChartBar,
            color: "from-purple-500 to-purple-600"
          },
          {
            title: "Low Stock Items",
            value: stats.lowStock,
            change: "-2%",
            icon: IconClock,
            color: "from-yellow-500 to-yellow-600"
          }
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-6 rounded-2xl bg-black/50 backdrop-blur-sm border border-white/[0.08] hover:border-indigo-500/50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-400">{stat.title}</p>
                <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
              </div>
              <div className={`h-12 w-12 rounded-full bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-4 text-sm text-emerald-500">
              <IconArrowUpRight className="h-4 w-4" />
              {stat.change} from last month
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-black/50 backdrop-blur-sm border border-white/[0.08] overflow-hidden"
      >
        <div className="p-6 border-b border-white/[0.08]">
          <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {activities.map((activity) => (
              <div 
                key={activity.id}
                className="flex items-center gap-4 p-4 rounded-lg bg-white/5 border border-white/10"
              >
                <div className="h-10 w-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                  <IconPackage className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-white">{activity.description}</p>
                  <p className="text-sm text-zinc-400">
                    {new Date(activity.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}