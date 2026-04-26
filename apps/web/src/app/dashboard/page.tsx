'use client';

import { useEffect, useState } from 'react';
import { apiRequest } from '@/services/api';
import Link from 'next/link';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, FileText, Mail, TrendingUp, ShieldCheck } from 'lucide-react';
import { Can } from '@/components/auth/can';

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const stats = await apiRequest<any>('/analytics/dashboard');
        setData(stats);
      } catch (error) {
        console.error('Failed to fetch stats', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div className="p-8">Loading dashboard...</div>;

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Can I={['OWNER', 'ADMIN']}>
          <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold border border-primary/20">
            <ShieldCheck className="w-4 h-4" />
            Admin Privileges
          </div>
        </Can>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 border rounded-xl bg-card shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <Users className="w-6 h-6 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">Total Members</span>
          </div>
          <div className="text-2xl font-bold">{data?.overview?.membersCount}</div>
        </div>
        <div className="p-6 border rounded-xl bg-card shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <FileText className="w-6 h-6 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">AI Documents</span>
          </div>
          <div className="text-2xl font-bold">{data?.overview?.documentsCount}</div>
        </div>
        <div className="p-6 border rounded-xl bg-card shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <Mail className="w-6 h-6 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">Active Invites</span>
          </div>
          <div className="text-2xl font-bold">{data?.overview?.activeInvites}</div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="p-8 border rounded-xl bg-card shadow-sm">
        <div className="flex items-center gap-2 mb-8">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-bold">Member Growth</h2>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data?.growthData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <Can I="ADMIN">
        <div className="mt-8 p-6 border border-dashed rounded-xl bg-muted/30">
          <h3 className="text-lg font-bold mb-2">Admin Control Panel</h3>
          <p className="text-sm text-muted-foreground mb-4">This section is only visible to users with the ADMIN role.</p>
          <Link href="/dashboard/organization">
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm hover:bg-primary/90 transition-colors">
              Manage Organization Settings
            </button>
          </Link>
        </div>
      </Can>
    </div>
  );
}
