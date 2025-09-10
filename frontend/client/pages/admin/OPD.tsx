import { useEffect, useState } from "react";
import axios from "axios";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/bed/StatCard";
import { Calendar, Clock, Stethoscope, Users } from "lucide-react";

// Status components
function StatusBadge({ status }: { status: "Pending" | "Approved" | "Rejected" }) {
  if (status === "Approved") return <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">Approved</Badge>;
  if (status === "Rejected") return <Badge className="bg-rose-50 text-rose-700 border-rose-200">Rejected</Badge>;
  return <Badge className="bg-amber-50 text-amber-700 border-amber-200">Pending</Badge>;
}

function QueueStatus({ status }: { status: "Waiting" | "In Consultation" | "Completed" | "Cancelled" }) {
  if (status === "Completed") return <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">Completed</Badge>;
  if (status === "Cancelled") return <Badge className="bg-rose-50 text-rose-700 border-rose-200">Cancelled</Badge>;
  if (status === "In Consultation") return <Badge className="bg-sky-50 text-sky-700 border-sky-200">In Consultation</Badge>;
  return <Badge className="bg-amber-50 text-amber-700 border-amber-200">Waiting</Badge>;
}

export default function OPD() {
const [admin, setAdmin] = useState({ name: "", specialization: "" });
  const [metrics, setMetrics] = useState({
    patientsInQueue: 0,
    availableDoctors: 0,
    averageWaitTime: "",
    upcomingAppointments: 0,
  });
  const [requests, setRequests] = useState([]);
  const [queue, setQueue] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const config = {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        };

        // Assuming backend returns admin details + metrics in dashboard API
        const [dashboardRes, requestsRes, queueRes] = await Promise.all([
          axios.get("http://localhost:4000/api/admin/dashboard", config),
          axios.get("http://localhost:4000/api/admin/appointments", config),
          axios.get("http://localhost:4000/api/admin/queue", config),
        ]);

        const dashboardData = dashboardRes.data;

        console.log("Name : ", dashboardData);

        setAdmin({
          name: dashboardData.adminDetails.name,
          specialization: dashboardData.adminDetails.specialization,
        });

        setMetrics({
          patientsInQueue: dashboardData.patientsInQueue,
          availableDoctors: dashboardData.availableDoctors,
          averageWaitTime: dashboardData.averageWaitTime,
          upcomingAppointments: dashboardData.upcomingAppointments,
        });

        setRequests(requestsRes.data);
        setQueue(queueRes.data);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl md:text-3xl font-bold tracking-tight">OPD Management Dashboard</h2>

      {/* Admin Card */}
      <Card className="rounded-xl">
        <CardContent className="p-5 flex items-center gap-4">
          <Avatar className="size-14">
            <AvatarFallback>PD</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="font-semibold">{admin.name}</div>
            <div className="text-sm text-muted-foreground">Chief Medical Officer</div>
            <div className="text-xs text-muted-foreground">{admin.specialization}</div>
          </div>
          <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">Online</Badge>
        </CardContent>
      </Card>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Patients in Queue" value={metrics.patientsInQueue} icon={<Users className="h-4 w-4" />} />
        <StatCard label="Available Doctors" value={metrics.availableDoctors} icon={<Stethoscope className="h-4 w-4" />} />
        <StatCard label="Average Wait Time" value={`${Math.round(metrics.averageWaitTime)} min`} icon={<Clock className="h-4 w-4" />} />
        <StatCard label="Upcoming Appointments" value={metrics.upcomingAppointments} icon={<Calendar className="h-4 w-4" />} />
      </div>

      {/* Appointment Requests */}
      <Card className="rounded-xl">
        <CardHeader>
          <CardTitle className="text-base md:text-lg">Appointment Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient Name</TableHead>
                <TableHead>Appointment Time</TableHead>
                <TableHead>Doctor Assigned</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((r) => (
                <TableRow key={r._id}>
                  <TableCell className="font-medium">{r.name}</TableCell>
                  <TableCell>{`${r.date} - ${r.time}`}</TableCell>
                  <TableCell>{r.doctorName || r.doctor}</TableCell>
                  <TableCell><StatusBadge status={r.status} /></TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm">Delay by 5m</Button>
                    {r.status === "Pending" ? (
                      <Button size="sm">Approve</Button>
                    ) : (
                      <Button variant="outline" size="sm">Manage</Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* OPD Queue */}
      <Card className="rounded-xl">
        <CardHeader>
          <CardTitle className="text-base md:text-lg">OPD Queue Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Token</TableHead>
                <TableHead>Patient Name</TableHead>
                <TableHead>Wait Time</TableHead>
                <TableHead>Doctor</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {queue.map((q) => (
                <TableRow key={q._id}>
                  <TableCell className="font-medium">{q.token || `OPD-${q._id.slice(-4)}`}</TableCell>
                  <TableCell>{q.name}</TableCell>
                  <TableCell>{q.waitTimeMinutes || "0"} min</TableCell>
                  <TableCell>{q.doctorName || q.doctor}</TableCell>
                  <TableCell><QueueStatus status={q.status} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Quick Actions & Schedule */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="rounded-xl">
          <CardHeader><CardTitle className="text-base md:text-lg">Quick Actions</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">Schedule New Appointment</Button>
            <Button variant="outline" className="w-full justify-start">Admit Patient</Button>
            <Button variant="outline" className="w-full justify-start">Dispense Medication</Button>
          </CardContent>
        </Card>
        <Card className="rounded-xl">
          <CardHeader><CardTitle className="text-base md:text-lg">Upcoming Schedule</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm">
              <li><div className="font-medium">Staff Meeting - Conf Room 3</div><div className="text-muted-foreground">10:00 AM</div></li>
              <li><div className="font-medium">Dr. Smith - Patient Rounds</div><div className="text-muted-foreground">02:30 PM</div></li>
              <li><div className="font-medium">Inventory Check - Pharmacy</div><div className="text-muted-foreground">04:00 PM</div></li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
