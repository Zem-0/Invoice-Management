"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";
import { 
  IconPackage, 
  IconCurrencyDollar, 
  IconUsers,
  IconChartBar,
  IconClock,
  IconPlus,
  IconUser,
  IconDownload,
  IconAlertTriangle
} from "@tabler/icons-react";
import { Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import Link from "next/link";
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface Product {
  id: string;
  uuid: string;
  name: string;
  price: number;
  stock: number;
  growth?: number;
}

interface Metric {
  label: string;
  value: number;
}

interface DashboardStats {
  totalProducts: number;
  totalValue: number;
  averagePrice: number;
  lowStock: number;
}

interface InvoiceStats {
  pending: number;
  done: number;
  cancelled: number;
}

interface DashboardMetrics {
  totalCustomers: number;
  monthlyRevenue: number;
  totalSales: number;
  averageOrderValue: number;
}

export default function Dashboard() {
  const { user } = useUser();
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalValue: 0,
    averagePrice: 0,
    lowStock: 0
  });
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
  const [topProducts, setTopProducts] = useState<Product[]>([]);
  const [inventoryMetrics, setInventoryMetrics] = useState<Metric[]>([]);
  const [invoiceStats, setInvoiceStats] = useState<InvoiceStats>({
    pending: 0,
    done: 0,
    cancelled: 0
  });
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalCustomers: 0,
    monthlyRevenue: 0,
    totalSales: 0,
    averageOrderValue: 0
  });

  useEffect(() => {
    if (user) {
      fetchStats();
      fetchLowStockProducts();
      fetchTopProducts();
      fetchInventoryMetrics();
      fetchInvoiceStats();
      fetchDashboardMetrics();
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

  const fetchLowStockProducts = async () => {
    try {
      const { data: products, error } = await supabase
        .from('products')
        .select('*')
        .eq('user_id', user?.id)
        .filter('stock', 'lt', 10);

      if (error) throw error;

      const lowStockProducts = products?.map(product => ({
        id: product.uuid,
        uuid: product.uuid,
        name: product.name,
        price: product.price,
        stock: product.stock
      }));

      setLowStockProducts(lowStockProducts || []);
    } catch (error) {
      console.error('Error fetching low stock products:', error);
    }
  };

  const fetchTopProducts = async () => {
    try {
      const { data: products, error } = await supabase
        .from('products')
        .select('*')
        .eq('user_id', user?.id)
        .order('stock', { ascending: false })
        .limit(5);

      if (error) throw error;

      const topProducts = products?.map(product => ({
        id: product.uuid,
        uuid: product.uuid,
        name: product.name,
        price: product.price,
        stock: product.stock,
        growth: Math.floor(Math.random() * 20) + 1 // Placeholder for growth calculation
      }));

      setTopProducts(topProducts || []);
    } catch (error) {
      console.error('Error fetching top products:', error);
    }
  };

  const fetchInventoryMetrics = async () => {
    try {
      const { data: products, error } = await supabase
        .from('products')
        .select('*')
        .eq('user_id', user?.id);

      if (error) throw error;

      const totalStock = products?.reduce((sum, product) => sum + product.stock, 0) || 0;
      const metrics: Metric[] = [
        {
          label: 'Stock Utilization',
          value: Math.min(Math.round((totalStock / (totalStock + 100)) * 100), 100)
        },
        {
          label: 'Inventory Turnover',
          value: Math.min(Math.round((products?.length || 0) / 10 * 100), 100)
        },
        {
          label: 'Stock Health',
          value: Math.min(Math.round(((products?.filter(p => p.stock > 10).length || 0) / (products?.length || 1)) * 100), 100)
        }
      ];

      setInventoryMetrics(metrics);
    } catch (error) {
      console.error('Error fetching inventory metrics:', error);
    }
  };

  const fetchInvoiceStats = async () => {
    try {
      const { data: invoices, error } = await supabase
        .from('invoices')
        .select('status')
        .eq('user_id', user?.id);

      if (error) throw error;

      const stats = invoices?.reduce((acc, invoice) => {
        const status = invoice.status.toLowerCase() as 'pending' | 'done' | 'cancelled';
        acc[status]++;
        return acc;
      }, { pending: 0, done: 0, cancelled: 0 });

      setInvoiceStats(stats);
    } catch (error) {
      console.error('Error fetching invoice stats:', error);
    }
  };

  const fetchDashboardMetrics = async () => {
    try {
      // Get all invoices
      const { data: invoices, error: invoicesError } = await supabase
        .from('invoices')
        .select('*')
        .eq('user_id', user?.id);

      if (invoicesError) throw invoicesError;

      // Get current month's invoices
      const currentMonth = new Date().getMonth();
      const monthlyInvoices = invoices?.filter(invoice => 
        new Date(invoice.Timestamp).getMonth() === currentMonth
      );

      // Calculate metrics
      const totalCustomers = new Set(invoices?.map(invoice => invoice.client_email)).size;
      const monthlyRevenue = monthlyInvoices?.reduce((sum, invoice) => sum + (invoice.total || 0), 0) || 0;
      const totalSales = invoices?.length || 0;
      const averageOrderValue = totalSales > 0 
        ? (invoices?.reduce((sum, invoice) => sum + (invoice.total || 0), 0) || 0) / totalSales 
        : 0;

      setMetrics({
        totalCustomers,
        monthlyRevenue,
        totalSales,
        averageOrderValue
      });

    } catch (error) {
      console.error('Error fetching dashboard metrics:', error);
    }
  };

  const handleExport = async () => {
    try {
      // Fetch all products
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('*')
        .eq('user_id', user?.id);

      // Fetch all invoices
      const { data: invoices, error: invoicesError } = await supabase
        .from('invoices')
        .select('*')
        .eq('user_id', user?.id);

      if (productsError || invoicesError) throw new Error('Failed to fetch data');

      // Create workbook
      const wb = XLSX.utils.book_new();

      // Format products data
      const productsData = products?.map(product => ({
        Name: product.name,
        Price: product.price,
        Stock: product.stock,
        'Created At': new Date(product.created_at).toLocaleDateString()
      })) || [];

      // Format invoices data
      const invoicesData = invoices?.map(invoice => ({
        Name: invoice.name,
        Total: invoice.total,
        Status: invoice.status,
        'Created At': new Date(invoice.Timestamp).toLocaleDateString()
      })) || [];

      // Create worksheets
      const productsWs = XLSX.utils.json_to_sheet(productsData);
      const invoicesWs = XLSX.utils.json_to_sheet(invoicesData);

      // Add worksheets to workbook
      XLSX.utils.book_append_sheet(wb, productsWs, "Products");
      XLSX.utils.book_append_sheet(wb, invoicesWs, "Invoices");

      // Generate Excel file
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      
      // Download file
      saveAs(data, `inventory-data-${new Date().toISOString().split('T')[0]}.xlsx`);
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export data');
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-zinc-400">Overview of your inventory system</p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-white transition-colors"
        >
          <IconDownload className="w-5 h-5" />
          Export Data
        </button>
      </div>

      {/* All Metrics Cards Combined */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Product Stats */}
        <motion.div className="bg-black/50 backdrop-blur-sm border border-white/[0.08] p-4 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/10 rounded-lg">
              <IconPackage className="h-6 w-6 text-indigo-500" />
            </div>
            <div>
              <p className="text-sm text-zinc-400">Total Products</p>
              <p className="text-xl font-semibold text-white">{stats.totalProducts}</p>
            </div>
          </div>
        </motion.div>

        <motion.div className="bg-black/50 backdrop-blur-sm border border-white/[0.08] p-4 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 rounded-lg">
              <IconCurrencyDollar className="h-6 w-6 text-emerald-500" />
            </div>
            <div>
              <p className="text-sm text-zinc-400">Total Value</p>
              <p className="text-xl font-semibold text-white">${stats.totalValue.toFixed(2)}</p>
            </div>
          </div>
        </motion.div>

        <motion.div className="bg-black/50 backdrop-blur-sm border border-white/[0.08] p-4 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <IconCurrencyDollar className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-zinc-400">Average Price</p>
              <p className="text-xl font-semibold text-white">${stats.averagePrice.toFixed(2)}</p>
            </div>
          </div>
        </motion.div>

        <motion.div className="bg-black/50 backdrop-blur-sm border border-white/[0.08] p-4 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500/10 rounded-lg">
              <IconAlertTriangle className="h-6 w-6 text-red-500" />
            </div>
            <div>
              <p className="text-sm text-zinc-400">Low Stock Items</p>
              <p className="text-xl font-semibold text-white">{stats.lowStock}</p>
            </div>
          </div>
        </motion.div>

        {/* Sales Stats */}
        <motion.div className="bg-black/50 backdrop-blur-sm border border-white/[0.08] p-4 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-violet-500/10 rounded-lg">
              <IconUsers className="h-6 w-6 text-violet-500" />
            </div>
            <div>
              <p className="text-sm text-zinc-400">Total Customers</p>
              <p className="text-xl font-semibold text-white">{metrics.totalCustomers}</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div className="bg-black/50 backdrop-blur-sm border border-white/[0.08] p-4 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <IconCurrencyDollar className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-zinc-400">Monthly Revenue</p>
              <p className="text-xl font-semibold text-white">${metrics.monthlyRevenue.toFixed(2)}</p>
            </div>
          </div>
        </motion.div>

        <motion.div className="bg-black/50 backdrop-blur-sm border border-white/[0.08] p-4 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <IconChartBar className="h-6 w-6 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-zinc-400">Total Sales</p>
              <p className="text-xl font-semibold text-white">{metrics.totalSales}</p>
            </div>
          </div>
        </motion.div>

        <motion.div className="bg-black/50 backdrop-blur-sm border border-white/[0.08] p-4 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500/10 rounded-lg">
              <IconCurrencyDollar className="h-6 w-6 text-orange-500" />
            </div>
            <div>
              <p className="text-sm text-zinc-400">Avg. Order Value</p>
              <p className="text-xl font-semibold text-white">${metrics.averageOrderValue.toFixed(2)}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Line Chart */}
        <motion.div 
          className="rounded-2xl bg-black/50 backdrop-blur-sm border border-white/[0.08] p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-lg font-semibold text-white mb-4">Stock Trends</h2>
          <div className="h-[300px]">
            <Line
              data={{
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                  label: 'Inventory Value',
                  data: [65, 59, 80, 81, 56, 55],
                  borderColor: 'rgb(99, 102, 241)',
                  tension: 0.4,
                  pointBackgroundColor: 'rgb(99, 102, 241)',
                  backgroundColor: 'rgba(99, 102, 241, 0.1)',
                  fill: true
                }]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: {
                      color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: { 
                      color: 'rgba(255, 255, 255, 0.5)',
                      font: {
                        size: 12
                      }
                    }
                  },
                  x: {
                    grid: {
                      display: false
                    },
                    ticks: { 
                      color: 'rgba(255, 255, 255, 0.5)',
                      font: {
                        size: 12
                      }
                    }
                  }
                }
              }}
            />
          </div>
        </motion.div>

        {/* Pie Chart */}
        <motion.div 
          className="rounded-2xl bg-black/50 backdrop-blur-sm border border-white/[0.08] p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-lg font-semibold text-white mb-4">Invoice Status</h2>
          <div className="h-[300px] flex items-center justify-center">
            <Pie
              data={{
                labels: ['Pending', 'Done', 'Cancelled'],
                datasets: [{
                  data: [
                    invoiceStats.pending,
                    invoiceStats.done,
                    invoiceStats.cancelled
                  ],
                  backgroundColor: [
                    'rgba(234, 179, 8, 0.8)',    // Yellow for pending
                    'rgba(34, 197, 94, 0.8)',    // Green for done
                    'rgba(239, 68, 68, 0.8)',    // Red for cancelled
                  ],
                  borderColor: [
                    'rgba(234, 179, 8, 1)',
                    'rgba(34, 197, 94, 1)',
                    'rgba(239, 68, 68, 1)',
                  ],
                  borderWidth: 1
                }]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom' as const,
                    labels: {
                      color: 'rgba(255, 255, 255, 0.7)',
                      padding: 20,
                      font: {
                        size: 12
                      }
                    }
                  }
                }
              }}
            />
          </div>
        </motion.div>
      </div>

      {/* Add new chart component */}
      <motion.div className="rounded-2xl bg-black/50 backdrop-blur-sm border border-white/[0.08] p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Sales Analytics</h2>
        <div className="h-[300px]">
          <Line
            data={{
              labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
              datasets: [{
                label: 'Monthly Sales',
                data: [30, 45, 57, 48, 69, 85],
                borderColor: 'rgba(99, 102, 241, 1)',
                tension: 0.4,
                fill: true,
                backgroundColor: 'rgba(99, 102, 241, 0.1)'
              }]
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                  grid: { color: 'rgba(255, 255, 255, 0.1)' },
                  ticks: { color: 'rgba(255, 255, 255, 0.5)' }
                },
                x: {
                  grid: { display: false },
                  ticks: { color: 'rgba(255, 255, 255, 0.5)' }
                }
              }
            }}
          />
        </div>
      </motion.div>

      {/* Low Stock Alerts */}
      <motion.div 
        className="rounded-2xl bg-black/50 backdrop-blur-sm border border-white/[0.08] p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-lg font-semibold text-white mb-4">Low Stock Alerts</h2>
        <div className="space-y-3">
          {lowStockProducts.map(product => (
            <div 
              key={product.id}
              className="flex items-center justify-between p-3 bg-red-500/10 border border-red-500/20 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <IconAlertTriangle className="h-5 w-5 text-red-400" />
                <div>
                  <p className="text-white">{product.name}</p>
                  <p className="text-sm text-red-400">Only {product.stock} units left</p>
                </div>
              </div>
              <Link 
                href={`/dashboard/products?edit=${product.id}`}
                className="text-sm text-red-400 hover:text-red-300"
              >
                Update Stock
              </Link>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Top Products */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div 
          className="rounded-2xl bg-black/50 backdrop-blur-sm border border-white/[0.08] p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-lg font-semibold text-white mb-4">Top Products</h2>
          <div className="space-y-4">
            {topProducts.map(product => (
              <div key={product.id} className="flex items-center justify-between">
                <div>
                  <p className="text-white">{product.name}</p>
                  <p className="text-sm text-zinc-400">${product.price}</p>
                </div>
                <div className="text-right">
                  <p className="text-white">{product.stock} units</p>
                  <p className="text-sm text-emerald-400">+{product.growth}%</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div 
          className="rounded-2xl bg-black/50 backdrop-blur-sm border border-white/[0.08] p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-lg font-semibold text-white mb-4">Inventory Health</h2>
          <div className="space-y-4">
            {inventoryMetrics.map(metric => (
              <div key={metric.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-zinc-400">{metric.label}</span>
                  <span className="text-white">{metric.value}%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-500 rounded-full"
                    style={{ width: `${metric.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div className="rounded-2xl bg-black/50 backdrop-blur-sm border border-white/[0.08] p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Recent Notifications</h2>
        <div className="space-y-4">
          {[
            { title: 'New Order', message: 'Order #1234 received', time: '2 mins ago' },
            { title: 'Low Stock', message: 'Product X is running low', time: '1 hour ago' },
          ].map((notification, index) => (
            <div key={index} className="flex items-start gap-4 p-3 bg-white/5 rounded-lg">
              <div className="flex-1">
                <p className="text-white font-medium">{notification.title}</p>
                <p className="text-sm text-zinc-400">{notification.message}</p>
              </div>
              <span className="text-xs text-zinc-500">{notification.time}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}