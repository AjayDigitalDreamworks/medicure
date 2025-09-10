// src/pages/admin/Doctors.tsx

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { StatCard } from "@/components/bed/StatCard";
import { DoctorCard, DoctorInfo } from "@/components/doctor/DoctorCard";
import { Input } from "@/components/ui/input";
import {
  Select, SelectTrigger, SelectValue,
  SelectContent, SelectItem
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, CheckCircle2, Activity, CalendarX } from "lucide-react";

export default function Doctors() {
  const [q, setQ] = useState("");
  const [dept, setDept] = useState("all");
  const [spec, setSpec] = useState("all");
  const [status, setStatus] = useState("all");

  const [doctors, setDoctors] = useState<DoctorInfo[]>([]);
  const [kpis, setKpis] = useState({
    onDuty: 0, available: 0, surgery: 0, leave: 0
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const config = {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    };

    const fetchData = async () => {
      try {
        const [docsRes, kpisRes] = await Promise.all([
          axios.get("https://medicure-57ts.onrender.com/api/admin/doctors", config),
          axios.get("https://medicure-57ts.onrender.com/api/admin/doctors/kpis", config)
        ]);
        setDoctors(docsRes.data);
        setKpis(kpisRes.data);
      } catch (err) {
        console.error("Error fetching doctors data:", err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  const filtered = useMemo(() => {
  const lq = q.toLowerCase();
  return doctors.filter((d) =>
    (!lq ||
      [d.name, d.specialization, d.department, d.room].some(
        (v) => (v || "").toLowerCase().includes(lq)
      )) &&
    (dept === "all" || d.department?.toLowerCase() === dept) &&
    (spec === "all" || d.specialization?.toLowerCase().includes(spec)) &&
    (status === "all" || d.status === status)
  );
}, [q, dept, spec, status, doctors]);


  return (
    <div className="space-y-6">
      <h2 className="text-2xl md:text-3xl font-bold">Doctor Availability</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="On Duty" value={kpis.onDuty} icon={<Users className="h-4 w-4" />} />
        <StatCard label="Available Now" value={kpis.available} icon={<CheckCircle2 className="h-4 w-4" />} />
        <StatCard label="In Surgery" value={kpis.surgery} icon={<Activity className="h-4 w-4" />} />
        <StatCard label="On Leave" value={kpis.leave} icon={<CalendarX className="h-4 w-4" />} />
      </div>

      <Card className="rounded-xl">
        <CardHeader>
          <CardTitle className="text-base md:text-lg">Filter Doctors</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row gap-3 flex-wrap">
          <Input
            placeholder="Search…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="md:max-w-xs"
          />
          <Select value={dept} onValueChange={setDept}>
            <SelectTrigger className="md:w-[200px]">
              <SelectValue placeholder="All Departments" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              <SelectItem value="Cardiology">Cardiology</SelectItem>
              <SelectItem value="Neurology">Neurology</SelectItem>
              <SelectItem value="orthopedics">Orthopedics</SelectItem>
              <SelectItem value="general">General</SelectItem>
              <SelectItem value="surgery">Surgery</SelectItem>
              <SelectItem value="pediatrics">Pediatrics</SelectItem>
              <SelectItem value="ent">ENT</SelectItem>
              <SelectItem value="dermatology">Dermatology</SelectItem>
            </SelectContent>
          </Select>
          <Select value={spec} onValueChange={setSpec}>
            <SelectTrigger className="md:w-[200px]">
              <SelectValue placeholder="All Specializations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Specializations</SelectItem>
              <SelectItem value="cardiologist">Cardiologist</SelectItem>
              <SelectItem value="neurologist">Neurologist</SelectItem>
              <SelectItem value="orthopedic">Orthopedic</SelectItem>
              <SelectItem value="general physician">General Physician</SelectItem>
              <SelectItem value="surgeon">Surgeon</SelectItem>
              <SelectItem value="pediatrician">Pediatrician</SelectItem>
              <SelectItem value="ent">ENT</SelectItem>
              <SelectItem value="dermatologist">Dermatologist</SelectItem>
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="md:w-[200px]">
              <SelectValue placeholder="Any Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any Status</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="on-duty">On Duty</SelectItem>
              <SelectItem value="in-consultation">In Consultation</SelectItem>
              <SelectItem value="in-surgery">In Surgery</SelectItem>
              <SelectItem value="on-leave">On Leave</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={() => {
              setQ("");
              setDept("all");
              setSpec("all");
              setStatus("all");
            }}
          >
            Reset
          </Button>
        </CardContent>
      </Card>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((d, idx) => (
          <DoctorCard key={d?.id ?? `doctor-${idx}`} info={d} />
        ))}
      </div>
    </div>
  );
}
