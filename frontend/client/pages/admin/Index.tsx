"use client";

import { useEffect, useMemo, useState, Fragment } from "react";
import axios from "axios";
import { Dialog, Transition } from "@headlessui/react";
import { StatCard } from "@/components/bed/StatCard";
import { BedCard } from "@/components/bed/BedCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Plus, RotateCcw } from "lucide-react";

type Patient = {
  id: string;
  name: string;
};

export type BedInfo = {
  _id: string;
  bedId: string;
  ward: string;
  floor: string;
  room: string;
  doctor?: string;
  condition?: string;
  status: "occupied" | "available" | "maintenance" | string;
  patient?: Patient;
  admitDate?: string;
  dischargeDate?: string;
};

type FormState = {
  ward: string;
  floor: string;
  room: string;
  doctor: string;
  condition: string;
  patientName?: string;
  patientId?: string;
};

export default function BedDashboard() {
  const [beds, setBeds] = useState<BedInfo[]>([]);
  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState("");
  const [type, setType] = useState("all"); // ward filter
  const [dept, setDept] = useState("all"); // floor filter

  const [isModalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<
    "add" | "edit" | "delete" | "assign" | "discharge"
  >("add");
  const [currentBed, setCurrentBed] = useState<BedInfo | null>(null);

  const emptyForm: FormState = {
    ward: "",
    floor: "",
    room: "",
    doctor: "",
    condition: "",
    patientName: "",
    patientId: "",
  };

  const [form, setForm] = useState<FormState>(emptyForm);

  const fetchBeds = async () => {
    try {
      setLoading(true);
      const res = await axios.get<BedInfo[]>(
        "http://localhost:4000/api/admin/beds"
      );
      setBeds(res.data);
    } catch (err) {
      console.error("Error fetching beds:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBeds();
    // const interval = setInterval(fetchBeds, 5000);
    // return () => clearInterval(interval);
  }, []);

  const uniqueWards = useMemo(() => {
    const wards = beds.map((b) => b.ward).filter(Boolean);
    return Array.from(new Set(wards));
  }, [beds]);

  const uniqueFloors = useMemo(() => {
    const floors = beds.map((b) => b.floor).filter(Boolean);
    return Array.from(new Set(floors));
  }, [beds]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return beds.filter((b) => {
      const patientName = b.patient?.name?.toLowerCase() || "";
      const bedId = b.bedId?.toLowerCase() || "";
      const room = b.room?.toLowerCase() || "";
      const doctor = b.doctor?.toLowerCase() || "";

      const matchesQuery =
        !q ||
        bedId.includes(q) ||
        room.includes(q) ||
        patientName.includes(q) ||
        doctor.includes(q);

      const matchesWard = type === "all" || b.ward === type;
      const matchesFloor = dept === "all" || b.floor === dept;

      return matchesQuery && matchesWard && matchesFloor;
    });
  }, [beds, query, type, dept]);

  const totals = useMemo(
    () => ({
      total: beds.length,
      occupied: beds.filter((b) => b.status === "occupied").length,
      available: beds.filter((b) => b.status === "available").length,
      maintenance: beds.filter((b) => b.status === "maintenance").length,
    }),
    [beds]
  );

  useEffect(() => {
    if (!isModalOpen) {
      setForm(emptyForm);
      setCurrentBed(null);
    }
  }, [isModalOpen]);

  useEffect(() => {
    if (!isModalOpen) return;
    if ((modalMode === "edit" || modalMode === "assign") && currentBed) {
      setForm({
        ward: currentBed.ward || "",
        floor: currentBed.floor || "",
        room: currentBed.room || "",
        doctor: currentBed.doctor || "",
        condition: currentBed.condition || "",
        patientName: currentBed.patient?.name || "",
        patientId: currentBed.patient?.id || "",
      });
    }
    if (modalMode === "add") {
      setForm(emptyForm);
    }
  }, [modalMode, currentBed, isModalOpen]);

  const submitModal = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (modalMode === "add") {
        await axios.post("https://medicure-57ts.onrender.com/api/admin/beds", form);
      } else if (modalMode === "edit" && currentBed) {
        await axios.put(
          `http://localhost:4000/api/admin/beds/${currentBed._id}`,
          form
        );
      } else if (modalMode === "delete" && currentBed) {
        await axios.delete(
          `https://medicure-57ts.onrender.com/api/admin/beds/${currentBed._id}`
        );
      } else if (modalMode === "assign" && currentBed) {
        if (!form.patientName || !form.patientId) {
          alert("Please provide both Patient Name and Patient ID.");
          return;
        }
        await axios.put(
          `https://medicure-57ts.onrender.com/api/admin/beds/${currentBed._id}`,
          {
            patient: { name: form.patientName, id: form.patientId },
            status: "occupied",
            admitDate: new Date().toISOString(),
            dischargeDate: null,
            doctor: form.doctor,
            condition: form.condition,
            ward: form.ward,
            floor: form.floor,
            room: form.room,
          }
        );
      } else if (modalMode === "discharge" && currentBed) {
        // Try discharge endpoint first
        try {
          await axios.put(
            `https://medicure-57ts.onrender.com/api/admin/beds/${currentBed._id}/discharge`
          );
        } catch {
          // Fallback if no discharge endpoint
          await axios.put(
            `https://medicure-57ts.onrender.com/api/admin/beds/${currentBed._id}`,
            {
              status: "available",
              dischargeDate: new Date().toISOString(),
              patient: {},
            }
          );
        }
      }
      setModalOpen(false);
      fetchBeds();
    } catch (err) {
      console.error("Error submitting modal:", err);
      alert("An error occurred. Please try again.");
    }
  };

  if (loading)
    return (
      <div className="text-center py-10 text-lg font-semibold">
        Loading beds...
      </div>
    );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
        Bed Management Dashboard
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Beds" value={totals.total} />
        <StatCard label="Occupied Beds" value={totals.occupied} />
        <StatCard label="Available Beds" value={totals.available} />
        <StatCard label="Cleaning/Maintenance" value={totals.maintenance} />
      </div>

      <div className="flex flex-col md:flex-row gap-3 items-center">
        <Input
          placeholder="Search by Bed ID / Patient / Doctor / Room"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-grow md:flex-grow-0 md:w-64"
          aria-label="Search beds"
        />

        <Select value={type} onValueChange={setType} className="md:w-48">
          <SelectTrigger>
            <SelectValue>{type === "all" ? "All Wards" : type}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Wards</SelectItem>
            {uniqueWards.map((ward) => (
              <SelectItem key={ward} value={ward}>
                {ward}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={dept} onValueChange={setDept} className="md:w-48">
          <SelectTrigger>
            <SelectValue>{dept === "all" ? "All Floors" : dept}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Floors</SelectItem>
            {uniqueFloors.map((floor) => (
              <SelectItem key={floor} value={floor}>
                {floor}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          onClick={() => {
            setQuery("");
            setType("all");
            setDept("all");
          }}
          aria-label="Reset Filters"
          type="button"
        >
          <RotateCcw />
          Reset
        </Button>

        <div className="flex-grow" />

        <Button
          onClick={() => {
            setModalMode("add");
            setCurrentBed(null);
            setForm(emptyForm);
            setModalOpen(true);
          }}
          aria-label="Add New Bed"
          type="button"
        >
          <Plus />
          Add Bed
        </Button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((b) => (
          <BedCard
            key={b._id}
            info={b}
            onEdit={() => {
              setModalMode("edit");
              setCurrentBed(b);
              setModalOpen(true);
            }}
            onDelete={() => {
              setModalMode("delete");
              setCurrentBed(b);
              setModalOpen(true);
            }}
            onAssign={() => {
              setModalMode("assign");
              setCurrentBed(b);
              setModalOpen(true);
            }}
            onDischarge={() => {
              setModalMode("discharge");
              setCurrentBed(b);
              setModalOpen(true);
            }}
          />
        ))}
      </div>

      {/* Modal */}
      <Transition show={isModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setModalOpen(false)}
          open={isModalOpen}
        >
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
                <Dialog.Panel className="w-full max-w-md overflow-hidden rounded-lg bg-white p-6 text-left shadow-xl">
                  <Dialog.Title className="text-lg font-medium">
                    {modalMode === "add" && "Add New Bed"}
                    {modalMode === "edit" && `Edit Bed ${currentBed?.bedId}`}
                    {modalMode === "delete" && `Delete Bed ${currentBed?.bedId}`}
                    {modalMode === "assign" && `Assign Bed ${currentBed?.bedId}`}
                    {modalMode === "discharge" && `Discharge Bed ${currentBed?.bedId}`}
                  </Dialog.Title>

                  <form onSubmit={submitModal} className="mt-4 space-y-3">
                    {(modalMode === "add" || modalMode === "edit") && (
                      <>
                        <Input
                          placeholder="Ward"
                          value={form.ward}
                          onChange={(e) =>
                            setForm({ ...form, ward: e.target.value })
                          }
                          required
                          aria-label="Ward"
                        />
                        <Input
                          placeholder="Floor"
                          value={form.floor}
                          onChange={(e) =>
                            setForm({ ...form, floor: e.target.value })
                          }
                          required
                          aria-label="Floor"
                        />
                        <Input
                          placeholder="Room"
                          value={form.room}
                          onChange={(e) =>
                            setForm({ ...form, room: e.target.value })
                          }
                          required
                          aria-label="Room"
                        />
                        <Input
                          placeholder="Doctor"
                          value={form.doctor}
                          onChange={(e) =>
                            setForm({ ...form, doctor: e.target.value })
                          }
                          aria-label="Doctor"
                        />
                        <Input
                          placeholder="Condition"
                          value={form.condition}
                          onChange={(e) =>
                            setForm({ ...form, condition: e.target.value })
                          }
                          aria-label="Condition"
                        />
                      </>
                    )}

                    {modalMode === "assign" && (
                      <>
                        <Input
                          placeholder="Patient Name"
                          value={form.patientName || ""}
                          onChange={(e) =>
                            setForm({ ...form, patientName: e.target.value })
                          }
                          required
                          aria-label="Patient Name"
                        />
                        <Input
                          placeholder="Patient ID"
                          value={form.patientId || ""}
                          onChange={(e) =>
                            setForm({ ...form, patientId: e.target.value })
                          }
                          required
                          aria-label="Patient ID"
                        />
                      </>
                    )}

                    {modalMode === "delete" && (
                      <p>
                        Are you sure you want to delete bed {currentBed?.bedId}?
                      </p>
                    )}

                    {modalMode === "discharge" && (
                      <p>
                        Are you sure you want to discharge patient from bed{" "}
                        {currentBed?.bedId}?
                      </p>
                    )}

                    <div className="mt-4 flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        type="button"
                        onClick={() => setModalOpen(false)}
                        aria-label="Cancel"
                      >
                        Cancel
                      </Button>
                      <Button type="submit" aria-label="Submit">
                        {modalMode === "add" && "Add Bed"}
                        {modalMode === "edit" && "Update"}
                        {modalMode === "delete" && "Delete"}
                        {modalMode === "assign" && "Assign"}
                        {modalMode === "discharge" && "Discharge"}
                      </Button>
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
