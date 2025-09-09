import React, { useState, useEffect } from "react";
import axios from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CalendarDays, HeartPulse, Pill, Stethoscope } from "lucide-react";

// function StatCard({ title, value, sub, icon: Icon, className }: { title: string; value: string; sub: string; icon: any; className?: string }) {
//   return (
//     <div className={cn("rounded-xl border bg-white p-5 shadow-sm", className)}>
//       <div className="flex items-center justify-between">
//         <div>
//           <p className="text-sm text-muted-foreground">{title}</p>
//           <div className="mt-2 flex items-baseline gap-2">
//             <span className="text-2xl font-semibold">{value}</span>
//           </div>
//           <p className="mt-1 text-xs text-muted-foreground">{sub}</p>
//         </div>
//         <div className="h-10 w-10 shrink-0 rounded-lg bg-primary/10 text-primary grid place-items-center">
//           <Icon className="h-5 w-5" />
//         </div>
//       </div>
//     </div>
//   );
// }

export default function Dashboard() {


  const [user, setUser] = useState(null);
const [appointments, setAppointments] = useState([]);

useEffect(() => {
  const fetchDashboard = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.warn("No token found. Redirecting...");
        window.location.href = "/login";
        return;
      }

      const res = await axios.get("https://medicure-57ts.onrender.com/api/dashboard", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          });

      // console.log("Dashboard data:", res.data);
      setUser(res.data.user);
      // console.log("appointment dta", res.data);
      setAppointments(res.data.appointments);
    } catch (err) {
      if (err.response?.status === 401) {
        console.warn("Unauthorized. Token expired?");
        localStorage.removeItem("token");
        // window.location.href = "/login";
      }
      console.error("Failed to fetch dashboard data", err);
    }
  };

  fetchDashboard();
}, []);


const handleAppointmentAction = async (appointmentId, action) => {
  if (action === "Cancel") {
   try {
  const token = localStorage.getItem("token");
  const res = await axios.put(
    `https://medicure-57ts.onrender.com/api/patient/appointments/${appointmentId}/cancel`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    }
  );

  console.log("✅ Cancel response:", res.data);
  alert("Appointment cancelled.");
} catch (err) {
  console.error("❌ Cancel failed:", err.response?.data || err.message);
  alert("Failed to cancel appointment.");
}

  } else if (action === "Reschedule") {
    // open modal or navigate to reschedule page
    alert("Open reschedule modal here!");
  }
};


  return (
    <div className="space-y-6">
      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <Avatar className="h-14 w-14">
              <AvatarImage src="https://i.pravatar.cc/100?img=65" />
              <AvatarFallback>SC</AvatarFallback>
            </Avatar>
            <div>
             
              <h1 className="text-xl font-semibold">
  Welcome, {user?.name || "Patient"}!
</h1>
<div className="mt-1 text-sm text-muted-foreground space-y-0.5">
  <p>Patient ID: {user?.id}</p>
  <p>Contact: {user?.email}</p>
</div>

            </div>
          </div>
          <Button className="h-9">Edit Profile</Button>
        </div>
      </section>

      {/* <section>
        <h2 className="px-1 text-sm font-medium text-muted-foreground">Key Health Metrics</h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Heart Rate" value="72" sub="Average resting rate" icon={HeartPulse} />
          <StatCard title="Blood Pressure" value="120/80 mmHg" sub="Last recorded reading" icon={Stethoscope} />
          <StatCard title="Last Checkup" value="Mar 15, 2024" sub="Annual physical exam" icon={CalendarDays} />
          <StatCard title="Medications" value="5 active" sub="Currently prescribed" icon={Pill} />
        </div>
      </section> */}

      <section className="space-y-4">
        <h2 className="px-1 text-lg font-semibold">My Health Plan</h2>
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-xl border bg-white p-5 shadow-sm lg:col-span-2">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">My Appointments</h3>
              <Button variant="link" className="px-0">View All</Button>
            </div>
            <div className="mt-4 divide-y">
             
     {appointments.length > 0 ? (
  appointments.map((appt) => {
    const allowedStatuses = ["pending", "confirmed", "rescheduled"];
    const status = appt.status?.toLowerCase() || "pending"; // handle undefined/null
    const isActionAllowed = allowedStatuses.includes(status);

    return (
      <AppointmentItem
        key={appt.id}
        date={new Date(appt.date).toLocaleDateString()}
        time={appt.time}
        doctor={appt.doctor || "N/A"}
        specialty={"General"}
        status={status}
        actions={isActionAllowed ? ["Cancel"] : []}
        onAction={(action) => handleAppointmentAction(appt.id, action)}
      />
    );
  })
) : (
  <p className="text-sm text-muted-foreground mt-4">No appointments today.</p>
)}


               </div>
          </div>

          {/* <div className="rounded-xl border bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Active Prescriptions</h3>
              <span className="text-xs text-muted-foreground">Manage</span>
            </div>
            <div className="mt-4 space-y-4">
              <PrescriptionItem name="Lisinopril" dose="10 mg" schedule="daily" nextDose="Tomorrow, 8 AM" state="Active" />
              <PrescriptionItem name="Metformin" dose="500 mg" schedule="twice daily" nextDose="Tonight, 7 PM" state="Active" />
              <PrescriptionItem name="Vitamin D3" dose="2000 IU" schedule="daily" nextDose="Aug 05, 2024" state="Needs refill" />
            </div>
          </div> */}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="px-1 text-lg font-semibold">Health Insights</h2>
        <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
          <div className="divide-y">
            <InsightRow title="Annual Physical Exam" date="Mar 15, 2024" description="Routine check-up with vital metrics. Blood tests ordered for cholesterol and glucose. Recommended to continue weekly exercise and diet." />
            <InsightRow title="Seasonal Allergy Diagnosis" date="May 12, 2024" description="Diagnosed with seasonal allergies during spring months. Prescribed antihistamines as needed. Advised to maintain air purifier during pollen season." />
            <InsightRow title="Blood Pressure Medication Adjustment" date="Sep 03, 2023" description="Dose of Lisinopril increased from 5mg to 10mg based on regularly averaged readings. Follow-up scheduled in 2 months." />
          </div>
        </div>
      </section>
    </div>
  );
}

function AppointmentItem({
  date,
  time,
  doctor,
  specialty,
  status,
  actions,
  onAction, // ✅ add this
}: {
  date: string;
  time: string;
  doctor: string;
  specialty: string;
  status: "Confirmed" | "Scheduled" | "Pending" | "Rescheduled" | "Cancelled" | string;
  actions: ("Reschedule" | "Cancel" | "Confirm")[];
  onAction?: (action: string) => void; // ✅ optional callback
}) {

  return (
    <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="text-sm text-muted-foreground">{date} · {time}</p>
        <p className="truncate font-medium">{doctor}</p>
        <p className="text-sm text-muted-foreground">{specialty}</p>
      </div>
      <div className="flex items-center gap-2">
        <Badge className={cn(status === "Confirmed" && "bg-emerald-100 text-emerald-700 border-emerald-200", status === "Scheduled" && "bg-blue-100 text-blue-700 border-blue-200", status === "Pending" && "bg-amber-100 text-amber-800 border-amber-200")}>{status}</Badge>
        {actions.length > 0 && actions.map((a) => (
  <Button
    key={a}
    variant={a === "Cancel" ? "destructive" : "outline"}
    size="sm"
    onClick={() => onAction?.(a)} // <- optional: add logic here
  >
    {a}
  </Button>
))}

      </div>
    </div>
  );
}

function PrescriptionItem({ name, dose, schedule, nextDose, state }: { name: string; dose: string; schedule: string; nextDose: string; state: "Active" | "Needs refill" | "Expired" }) {
  const stateClass =
    state === "Active"
      ? "bg-emerald-100 text-emerald-700 border-emerald-200"
      : state === "Needs refill"
        ? "bg-amber-100 text-amber-800 border-amber-200"
        : "bg-rose-100 text-rose-700 border-rose-200";
  return (
    <div className="rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium">{name}</p>
          <p className="text-sm text-muted-foreground">{dose}, {schedule}</p>
          <p className="mt-1 text-xs text-muted-foreground">Next Dose: {nextDose}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <Badge className={cn(stateClass)}>{state}</Badge>
          <Button size="sm" variant="outline">Refill</Button>
        </div>
      </div>
    </div>
  );
}

function InsightRow({ title, date, description }: { title: string; date: string; description: string }) {
  return (
    <div className="grid gap-2 p-5 sm:grid-cols-[1fr_auto] sm:items-center">
      <div>
        <p className="font-medium">{title}</p>
        <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{description}</p>
      </div>
      <div className="text-sm text-muted-foreground sm:text-right">{date}</div>
    </div>
  );
}
