import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import {
  Bell, CalendarDays, CheckCircle2, Hourglass, LogOut, Stethoscope, UserRound
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PatientRow {
  name: string;
  age: string;
  time: string;
  reason: string;
}

type Availability = "full" | "am" | "pm" | "none";

function StatCard({ icon: Icon, title, value, delta, deltaTone = "neutral" }: {
  icon: any;
  title: string;
  value: string | number;
  delta?: string;
  deltaTone?: "positive" | "negative" | "neutral";
}) {
  return (
    <Card className="shadow-sm">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center gap-4">
          <div className="grid h-12 w-12 place-items-center rounded-lg bg-accent text-primary">
            <Icon className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">{title}</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-semibold">{value}</span>
              {delta && (
                <span className={cn(
                  "text-xs",
                  deltaTone === "positive" && "text-green-600",
                  deltaTone === "negative" && "text-red-600",
                  deltaTone === "neutral" && "text-muted-foreground"
                )}>{delta}</span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Index({
  isAuthenticated,
  setIsAuthenticated,
  setUserRole,
}: {
  isAuthenticated: boolean;
  setIsAuthenticated: (val: boolean) => void;
  setUserRole: (val: string | null) => void;
}) {
  const navigate = useNavigate();
  // const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  // const [availability, setAvailability] = useState<Availability>("full");

  const [patients, setPatients] = useState<PatientRow[]>([]);
  const [loadingPatients, setLoadingPatients] = useState(false);

  const [stats, setStats] = useState({
    appointmentsToday: 0,
    consultedToday: 0,
    pendingPatients: 0,
  });

  
  const [doctor, setDoctor] = useState({
  name: "",
  specialization: "",
  experience: "",
  email: "",
});


  useEffect(() => {
  const fetchDashboard = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return;

    const res = await axios.get("https://medicure-57ts.onrender.com/api/dashboard", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });

    const { doctor, patients, stats } = res.data;

    setDoctor(doctor);
    setPatients(patients ?? []);
    setStats(stats ?? { appointmentsToday: 0, consultedToday: 0, pendingPatients: 0 });
  } catch (err) {
    console.error("Failed to fetch dashboard data", err);
  }
};


  fetchDashboard();
}, []);



// const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-slate-50">
      <Header doctor={doctor} setIsAuthenticated={setIsAuthenticated} setUserRole={setUserRole} />
      <main className="mx-auto max-w-7xl px-4 pb-8 pt-6 sm:px-6 lg:px-8">
        {/* Stat cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard icon={CalendarDays} title="Appointments Today" value={stats.appointmentsToday} deltaTone="neutral" />
          <StatCard icon={Stethoscope} title="Consulted Today" value={stats.consultedToday} deltaTone="neutral" />
          <StatCard icon={Hourglass} title="Pending Patients" value={stats.pendingPatients} deltaTone="neutral" />
        </div>

        {/* Main grid */}
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Upcoming Patients</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingPatients ? (
                <div className="p-4 text-center text-sm text-muted-foreground">Loading patients...</div>
              ) : Array.isArray(patients) && patients.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Reason</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {patients.map((p) => (
                      <TableRow key={`${p.name}-${p.time}`}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="grid h-9 w-9 place-items-center rounded-full bg-accent text-primary">
                              <UserRound className="h-4 w-4" />
                            </div>
                            <div>
                              <div className="font-medium">{p.name}</div>
                              <div className="text-xs text-muted-foreground">{p.age}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="whitespace-nowrap">{p.time}</TableCell>
                        <TableCell>{p.reason}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="p-4 text-center text-sm text-muted-foreground">No patients for today.</div>
              )}
            </CardContent>
          </Card>

          {/* Current Patient card can remain static or be enhanced similarly */}
          {/* <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Current Patient Details</CardTitle>
              <CardDescription>Live session</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Detail label="Name" value="Alice Smith" />
              <Detail label="Age" value="34" />
              <Detail label="Gender" value="Female" />
              <Detail label="Reason" value="Follow-up" />
              <Detail
                label="History"
                value="Diagnosed with hypertension 2 years ago. Stable. Annual check-up scheduled for next month. No new medications." />
              <div className="flex gap-2 pt-2">
                <Button variant="outline">View Medical Records</Button>
                <Button variant="destructive">End Session</Button>
              </div>
            </CardContent>
          </Card> */}
        </div>

        {/* Availability section remains same */}
      </main>
    </div>
  );
}

function Header({
  doctor,
  setIsAuthenticated,
  setUserRole,
}: {
  doctor: { name: string; specialization: string };
  setIsAuthenticated: (val: boolean) => void;
  setUserRole: (val: string | null) => void;
}) {
  const navigate = useNavigate();
  
const handleLogout = async () => {
  try {
    // Remove token from localStorage (if stored there)
    localStorage.removeItem('token');

    // Send request to backend to clear cookie
    await axios.post('https://medicure-57ts.onrender.com/api/auth/logout', {}, { withCredentials: true });

    // Optional: clear other localStorage items
    localStorage.removeItem('userRole');
    localStorage.removeItem('userData');

    // Navigate to login page
    navigate('/login');
  } catch (error) {
    console.error('Logout failed:', error);
    navigate('/login'); // Fallback redirect
  }
};
  return (
    <header className="border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
       <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded bg-primary/10 text-primary grid place-items-center font-extrabold">M</div>
          <div className="font-semibold tracking-tight">MEDICURE</div>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Button variant="ghost" size="icon" aria-label="Notifications">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleLogout} aria-label="Logout">
            <LogOut className="h-5 w-5" />
          </Button>
          <div className="ml-2 flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary/15 grid place-items-center text-primary">
              <UserRound className="h-4 w-4" />
            </div>
           <div className="leading-tight">
  <div className="text-sm font-medium">{doctor.name || "Doctor"}</div>
  <div className="text-xs text-muted-foreground">{doctor.specialization || "Specialist"}</div>
</div>

          </div>
        </div>
      </div>
    </header>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-3 items-start gap-2 text-sm">
      <div className="col-span-1 text-muted-foreground">{label}</div>
      <div className="col-span-2 font-medium leading-relaxed">{value}</div>
    </div>
  );
}
