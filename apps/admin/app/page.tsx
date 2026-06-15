'use client';

import React from 'react';
import { Users, ShoppingBag, DollarSign, Clock, CheckCircle, XCircle, TrendingUp, ChevronRight } from 'lucide-react';

export default function AdminDashboard() {
  const stats = [
    { label: 'Jami foydalanuvchilar', value: '1,240', icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Jami daromad', value: '45,200,000 UZS', icon: DollarSign, color: 'text-success', bg: 'bg-success/10' },
    { label: 'Barcha buyurtmalar', value: '3,842', icon: ShoppingBag, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Kutilayotgan', value: '12', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  ];

  const recentOrders = [
    { id: 'GP-9283', user: 'Azamat', amount: '12,000', game: 'PUBG', status: 'pending' },
    { id: 'GP-9282', user: 'Malika', amount: '48,000', game: 'MLBB', status: 'checking' },
    { id: 'GP-9281', user: 'Sardor', amount: '55,000', game: 'PUBG', status: 'paid' },
  ];

  return (
    <main className="min-h-screen bg-[#020D2B] text-white p-8 space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted text-sm mt-1">Xush kelibsiz, Super Admin</p>
        </div>
        <div className="flex space-x-3">
          <button className="bg-primary text-bg font-bold px-6 py-2 rounded-xl shadow-gold hover:scale-105 transition-transform">
            Hisobot yuklash
          </button>
        </div>
      </header>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-[#1E2746] p-6 rounded-2xl border border-white/5 shadow-xl space-y-4">
            <div className="flex justify-between items-start">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <TrendingUp size={16} className="text-success" />
            </div>
            <div>
              <p className="text-muted text-xs font-bold uppercase tracking-widest">{stat.label}</p>
              <h3 className="text-2xl font-black mt-1">{stat.value}</h3>
            </div>
          </div>
        ))}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders Table */}
        <section className="lg:col-span-2 bg-[#1E2746] rounded-2xl border border-white/5 shadow-xl overflow-hidden">
          <div className="p-6 border-b border-white/5 flex justify-between items-center">
            <h3 className="font-bold text-lg">So'nggi buyurtmalar</h3>
            <button className="text-primary text-xs font-bold">Hammasini ko'rish</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] text-muted font-bold uppercase tracking-widest bg-white/5">
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Foydalanuvchi</th>
                  <th className="px-6 py-4">O'yin</th>
                  <th className="px-6 py-4">Summa</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-sm font-bold">{order.id}</td>
                    <td className="px-6 py-4 text-sm">{order.user}</td>
                    <td className="px-6 py-4 text-sm font-medium text-primary">{order.game}</td>
                    <td className="px-6 py-4 text-sm font-bold">{order.amount} UZS</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-[9px] font-black uppercase ${
                        order.status === 'pending' ? 'bg-amber-500/10 text-amber-500' : 'bg-blue-500/10 text-blue-500'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end space-x-2">
                        <button className="p-1.5 rounded-lg bg-success/10 text-success hover:bg-success hover:text-white transition-all">
                          <CheckCircle size={16} />
                        </button>
                        <button className="p-1.5 rounded-lg bg-danger/10 text-danger hover:bg-danger hover:text-white transition-all">
                          <XCircle size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Quick Links / Actions */}
        <section className="space-y-6">
          <div className="bg-[#1E2746] p-6 rounded-2xl border border-white/5 shadow-xl">
            <h3 className="font-bold text-lg mb-4">Tezkor amallar</h3>
            <div className="space-y-2">
              <button className="w-full p-4 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-between group transition-all">
                <span className="text-sm font-bold">O'yin qo'shish</span>
                <ChevronRight size={18} className="text-muted group-hover:text-primary" />
              </button>
              <button className="w-full p-4 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-between group transition-all">
                <span className="text-sm font-bold">Paket qo'shish</span>
                <ChevronRight size={18} className="text-muted group-hover:text-primary" />
              </button>
              <button className="w-full p-4 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-between group transition-all">
                <span className="text-sm font-bold">Banner sozlamalari</span>
                <ChevronRight size={18} className="text-muted group-hover:text-primary" />
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-br from-primary/20 to-secondary/10 p-6 rounded-2xl border border-primary/20 shadow-premium relative overflow-hidden">
            <div className="relative z-10">
              <h4 className="font-bold text-primary">Tizim holati</h4>
              <p className="text-xs text-muted mt-2">Barcha servislar normal ishlamoqda.</p>
              <div className="mt-4 flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-success animate-ping"></div>
                <span className="text-[10px] font-bold uppercase">Online</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
