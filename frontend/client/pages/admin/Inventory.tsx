"use client";

import { useEffect, useMemo, useState, Fragment } from "react";
import axios from "axios";
import { Dialog, Transition } from "@headlessui/react";
import { StatCard } from "@/components/bed/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Boxes, AlertTriangle, PackageX, CalendarClock, Plus } from "lucide-react";

type Item = {
  _id: string;
  name: string;
  category: string;
  unit: string;
  stock: number;
  capacity: number;
  reorderLevel: number;
  expiryDays?: number;
};

function getStatus(item: Item) {
  if (item.stock === 0) return { label: "Out of Stock", cls: "bg-rose-50 text-rose-700 border-rose-200" };
  if (item.expiryDays !== undefined && item.expiryDays <= 7)
    return { label: "Expiring Soon", cls: "bg-violet-50 text-violet-700 border-violet-200" };
  if (item.stock <= item.reorderLevel) return { label: "Low Stock", cls: "bg-amber-50 text-amber-700 border-amber-200" };
  return { label: "In Stock", cls: "bg-emerald-50 text-emerald-700 border-emerald-200" };
}

export default function Inventory() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const [status, setStatus] = useState("all");

  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [currentEdit, setCurrentEdit] = useState<Item | null>(null);

  const [form, setForm] = useState({
    name: "", category: "", unit: "", stock: "", capacity: "", reorderLevel: ""
  });

  const [adjustValue, setAdjustValue] = useState(0);

  const fetchInventory = async () => {
    try {
      const res = await axios.get("https://medicure-57ts.onrender.com/api/admin/inventory");
      setItems(res.data);
    } catch (err) {
      console.error("Error fetching inventory:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
    const interval = setInterval(fetchInventory, 5000);
    return () => clearInterval(interval);
  }, []);

  const filtered = useMemo(() => {
    const lq = q.toLowerCase();
    return items.filter((it) =>
      (!lq || [it.name, it.category].some((v) => v.toLowerCase().includes(lq))) &&
      (cat === "all" || it.category.toLowerCase() === cat) &&
      (status === "all" || getStatus(it).label.toLowerCase().replace(/ /g, "-") === status)
    );
  }, [q, cat, status, items]);

  const kpis = useMemo(() => {
    const total = items.length;
    const low = items.filter((i) => getStatus(i).label === "Low Stock").length;
    const oos = items.filter((i) => getStatus(i).label === "Out of Stock").length;
    const exp = items.filter((i) => getStatus(i).label === "Expiring Soon").length;
    return { total, low, oos, exp };
  }, [items]);

  // Add item
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name: form.name,
        category: form.category,
        unit: form.unit,
        stock: Number(form.stock),
        capacity: Number(form.capacity),
        reorderLevel: Number(form.reorderLevel),
      };
      const res = await axios.post("https://medicure-57ts.onrender.com/api/admin/inventory", payload);
      setItems((prev) => [res.data, ...prev]);
      setAddModalOpen(false);
      setForm({ name: "", category: "", unit: "", stock: "", capacity: "", reorderLevel: "" });
    } catch (err) {
      console.error("Error adding item:", err);
    }
  };

  // Adjust stock
  const handleAdjustSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentEdit) return;
    try {
      const newStock = currentEdit.stock + adjustValue;
      const res = await axios.put(`https://medicure-57ts.onrender.com/api/admin/inventory/${currentEdit._id}`, { stock: newStock });
      setItems((prev) => prev.map(i => i._id === res.data._id ? res.data : i));
      setAdjustValue(0);
      setCurrentEdit(null);
      setEditModalOpen(false);
    } catch (err) {
      console.error("Error adjusting stock:", err);
    }
  };

  if (loading) return <div className="text-center py-10">Loading inventory...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl md:text-3xl font-bold">Inventory Dashboard</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Items" value={kpis.total} icon={<Boxes className="h-4 w-4" />} />
        <StatCard label="Low Stock" value={kpis.low} icon={<AlertTriangle className="h-4 w-4" />} />
        <StatCard label="Out of Stock" value={kpis.oos} icon={<PackageX className="h-4 w-4" />} />
        <StatCard label="Expiring Soon" value={kpis.exp} icon={<CalendarClock className="h-4 w-4" />} />
      </div>

      <Card className="rounded-xl">
        <CardHeader><CardTitle>Inventory Items</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            <Input placeholder="Search..." value={q} onChange={e => setQ(e.target.value)} />
            <Select value={cat} onValueChange={setCat}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="consumables">Consumables</SelectItem>
              <SelectItem value="supplies">Supplies</SelectItem>
              <SelectItem value="medicines">Medicines</SelectItem>
            </SelectContent></Select>
            <Select value={status} onValueChange={setStatus}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>
              <SelectItem value="all">Any Status</SelectItem>
              <SelectItem value="in-stock">In Stock</SelectItem>
              <SelectItem value="low-stock">Low Stock</SelectItem>
              <SelectItem value="out-of-stock">Out of Stock</SelectItem>
              <SelectItem value="expiring-soon">Expiring Soon</SelectItem>
            </SelectContent></Select>
            <div className="flex-1" />
            <Button onClick={() => setAddModalOpen(true)}><Plus className="mr-2 h-4 w-4" />Add Item</Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Reorder Level</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(it => {
                const s = getStatus(it);
                const pct = Math.round((it.stock / it.capacity) * 100);
                return (
                  <TableRow key={it._id}>
                    <TableCell>{it.name}</TableCell>
                    <TableCell>{it.category}</TableCell>
                    <TableCell><Progress value={pct} /> {it.stock}/{it.capacity} {it.unit}</TableCell>
                    <TableCell>{it.reorderLevel} {it.unit}</TableCell>
                    <TableCell><Badge className={s.cls}>{s.label}</Badge></TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="outline" size="sm" onClick={() => { setCurrentEdit(it); setAdjustValue(0); setEditModalOpen(true); }}>
                        Adjust
                      </Button>
                      <Button size="sm" onClick={() => { setCurrentEdit(it); setAdjustValue(it.capacity - it.stock); setEditModalOpen(true); }}>
                        Restock
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Item Modal */}
      <Transition show={isAddModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setAddModalOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                    Add New Item
                  </Dialog.Title>

                  <form onSubmit={handleAddSubmit} className="mt-4 space-y-3">
                    <Input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                    <Input placeholder="Category" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} required />
                    <Input placeholder="Unit" value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })} required />
                    <Input placeholder="Stock" type="number" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} required />
                    <Input placeholder="Capacity" type="number" value={form.capacity} onChange={e => setForm({ ...form, capacity: e.target.value })} required />
                    <Input placeholder="Reorder Level" type="number" value={form.reorderLevel} onChange={e => setForm({ ...form, reorderLevel: e.target.value })} required />

                    <div className="mt-4 flex justify-end space-x-2">
                      <Button variant="outline" type="button" onClick={() => setAddModalOpen(false)}>Cancel</Button>
                      <Button type="submit">Save</Button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>


      {/* Adjust/Restock Modal */}
      <Transition show={isEditModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setEditModalOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title className="text-lg font-medium leading-6 text-gray-900">
                    {currentEdit && (adjustValue === (currentEdit.capacity - currentEdit.stock) ? "Restock Item" : "Adjust Stock")}
                  </Dialog.Title>
                  <form onSubmit={handleAdjustSubmit} className="space-y-4 mt-4">
                    <p>Current stock: {currentEdit?.stock} {currentEdit?.unit}</p>
                    <Input
                      placeholder="Adjust Amount"
                      type="number"
                      value={isNaN(adjustValue) ? '' : adjustValue}
                      onChange={e => {
                        const val = e.target.value;
                        setAdjustValue(val === '' ? 0 : Number(val));
                      }}
                      required
                    />

                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" type="button" onClick={() => setEditModalOpen(false)}>Cancel</Button>
                      <Button type="submit">Save</Button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>


    </div>
  );
}
