// pages/Appointments.tsx
import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { startOfToday, format } from "date-fns";
import { CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";

// Optional types
interface Department {
  _id: string;
  name: string;
}

interface Doctor {
  _id: string;
  name: string;
}

export default function Appointments() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [slots, setSlots] = useState<string[]>([]);

  const [department, setDepartment] = useState<string>("");
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [date, setDate] = useState<Date>(new Date());
  const [slot, setSlot] = useState<string>("");

  // Fetch departments
  useEffect(() => {
    axios.get("http://localhost:4000/api/patient/departments").then((res) => {
      setDepartments(res.data);
      if (res.data.length > 0) {
        setDepartment(res.data[0].name);
      }
    });
  }, []);

  // Fetch doctors when department changes
useEffect(() => {
  if (!department) {
    setDoctors([]);
    setDoctor(null);
    return;
  }

  axios
    .get("http://localhost:4000/api/patient/doctors", {
      params: { department },
    })
    .then((res) => {
      const fetchedDoctors = res.data || [];
      setDoctors(fetchedDoctors);
      setDoctor(null); // Let user select manually
    })
    .catch((err) => {
      console.error("Error fetching doctors:", err);
      setDoctors([]);
      setDoctor(null);
    });
}, [department]);



  // Fetch slots when doctor or date changes
  useEffect(() => {
  if (!doctor || !date) return;

  const formattedDate = date.toISOString().split("T")[0];
  axios
    .get("http://localhost:4000/api/patient/slots", {
      params: { doctor: doctor._id, date: formattedDate },
    })
    .then((res) => {
      setSlots(res.data);
      setSlot(res.data[0] || "");
    });
}, [doctor, date]);


  // Form submit handler
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);

    formData.append("department", department);
    formData.append("doctor", doctor?.name || "");
    formData.append("doctorId", doctor?._id || "");
    formData.append("date", date.toISOString());
    formData.append("slot", slot);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to book an appointment.");
        return;
      }

      await axios.post("http://localhost:4000/api/patient/appointments", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      alert("Appointment successfully booked!");
      form.reset();
    } catch (err) {
      console.error(err);
      alert("There was an error booking your appointment.");
    }
  };

  return (
    <form onSubmit={submit} className="space-y-6">
      <h1 className="text-2xl font-semibold">Book Your Appointment</h1>

      {/* Department & Doctor */}
      <section className="rounded-xl border bg-white shadow-sm">
        <div className="border-b px-5 py-3 font-medium">Appointment Type</div>
        <div className="grid gap-4 p-5 sm:grid-cols-2">
         <Select value={department} onValueChange={(value) => {
  setDepartment(value);
  setDoctor(null); // Clear selected doctor when changing department
}}>
  <SelectTrigger>
    <SelectValue placeholder="Select a department" />
  </SelectTrigger>
  <SelectContent>
    {departments.map((d) => (
      <SelectItem key={d.name} value={d.name}>
        {d.name}
      </SelectItem>
    ))}
  </SelectContent>
</Select>


          {department && (
  doctors.length > 0 ? (
    <Select
      value={doctor?._id}
      onValueChange={(id) => {
        const selectedDoctor = doctors.find((d) => d._id === id);
        if (selectedDoctor) setDoctor(selectedDoctor);
      }}
    >
      <SelectTrigger>
        <SelectValue placeholder="Select a doctor" />
      </SelectTrigger>
      <SelectContent>
        {doctors.map((doc) => (
          <SelectItem key={doc._id} value={doc._id}>
            {doc.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  ) : (
    <div className="text-sm text-muted-foreground mt-2">
      No doctors available in this department.
    </div>
  )
)}

        </div>
      </section>

      {/* Date & Time */}
      <section className="rounded-xl border bg-white shadow-sm">
        <div className="border-b px-5 py-3 font-medium">Date & Time</div>
        <div className="grid gap-5 p-5 lg:grid-cols-2">
          <div className="rounded-lg border overflow-hidden">
            <div className="flex items-center justify-between border-b px-4 py-2 text-sm text-muted-foreground">
              <div className="flex gap-3">
                <span>Select Date</span>
                <span className="rounded-md bg-gray-100 px-3 py-1.5 font-medium">
                  {format(date, "EEE, MMM d, yyyy")}
                </span>
              </div>
              <CalendarDays className="h-4 w-4" />
            </div>
            <div className="p-2">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(d) => d && setDate(d)}
                disabled={(d) => d < startOfToday()}
              />
            </div>
          </div>

          <div className="rounded-lg border p-4">
            <p className="text-sm font-medium">Available Time Slots</p>
            {slots.length > 0 ? (
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {slots.map((s) => (
                  <button
                    type="button"
                    key={s}
                    onClick={() => setSlot(s)}
                    className={cn(
                      "rounded-md border px-3 py-2 text-sm",
                      slot === s
                        ? "border-primary bg-primary/10 text-primary"
                        : "hover:bg-muted"
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground mt-2">
                No slots available.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* User Info */}
      <section className="rounded-xl border bg-white shadow-sm">
        <div className="border-b px-5 py-3 font-medium">Your Details</div>
        <div className="grid gap-4 p-5 sm:grid-cols-2">
          <Input name="name" placeholder="Full Name" required />
          <Input name="address" placeholder="Address" />
          <Input name="contact" placeholder="Phone Number" required />
          <Input name="purpose" placeholder="Reason for visit" />
        </div>
      </section>

      {/* ID Upload */}
      <section className="rounded-xl border bg-white shadow-sm">
        <div className="border-b px-5 py-3 font-medium">Identity Proof</div>
        <div className="p-5">
          <label className="block cursor-pointer rounded-lg border border-dashed bg-muted/30 p-8 text-center">
            <input type="file" name="id_proof" className="hidden" />
            <span className="text-sm text-muted-foreground">
              Upload ID proof (optional)
            </span>
          </label>
        </div>
      </section>

      {/* Submit */}
      <div className="flex justify-center">
        <Button type="submit" className="h-11 px-8">
          Confirm Appointment
        </Button>
      </div>
    </form>
  );
}
