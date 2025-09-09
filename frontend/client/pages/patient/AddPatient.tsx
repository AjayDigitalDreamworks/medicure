import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const countries = ["United States", "Canada", "India", "United Kingdom", "Australia"];
const hospitals = ["City General Hospital", "Green Valley Clinic", "Medicure Central", "Sunrise Health"];

export default function AddPatient() {
  const formRef = useRef<HTMLFormElement>(null);
  const [country, setCountry] = useState<string>("");
  const [hospital, setHospital] = useState<string>("");

  const onReset = () => {
    formRef.current?.reset();
    setCountry("");
    setHospital("");
  };



  const onSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const form = formRef.current;
  if (!form) return;

  const formData = new FormData(form);
  const data = {
    fullName: formData.get("fullName"),
    fatherName: formData.get("fatherName"),
    contact: formData.get("contact"),
    street: formData.get("street"),
    district: formData.get("district"),
    state: formData.get("state"),
    country,
    allergies: formData.get("allergies"),
    hospital,
  };

  try {
    const res = await fetch("https://medicure-57ts.onrender.com/api/patient/admitpatient", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (res.ok) {
      alert("Patient admitted successfully");
      onReset();
    } else {
      alert("Error: " + result.message);
    }
  } catch (err) {
    console.error(err);
    alert("Failed to submit. Please try again.");
  }
};


  return (
    <form ref={formRef} className="space-y-6" onSubmit={onSubmit}>

      <h1 className="text-2xl font-semibold">Patient Admission</h1>

      <Section title="Personal Details">
        <div className="grid gap-4 md:grid-cols-3">
          <Input name="fullName" placeholder="e.g., John Doe" aria-label="Full Name" />
          <Input name="fatherName" placeholder="e.g., Richard Doe" aria-label="Father's Name" />
          <Input name="contact" placeholder="e.g., +1 (555) 123-4567" aria-label="Contact Number" />
        </div>
      </Section>

      <Section title="Contact Address">
        <div className="grid gap-4 md:grid-cols-3">
          <Input name="street" placeholder="e.g., 123 Oak Avenue" aria-label="Street Address" />
          <Input name="district" placeholder="e.g., Central District" aria-label="District" />
          <Input name="state" placeholder="e.g., California" aria-label="State/Province" />
          <div className="md:col-span-1">
            <Select value={country} onValueChange={setCountry}>
              <SelectTrigger>
                <SelectValue placeholder="Select a country" />
              </SelectTrigger>
              <SelectContent>
                {countries.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Section>

      <Section title="Medical History">
        <Textarea name="allergies" placeholder="List any known allergies or medical conditions (e.g., Penicillin, Peanuts)" />
      </Section>

      <Section title="Administrative Information">
        <div className="grid gap-4 md:grid-cols-2">
          <Select value={hospital} onValueChange={setHospital}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a hospital" />
            </SelectTrigger>
            <SelectContent>
              {hospitals.map((h) => (
                <SelectItem key={h} value={h}>{h}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <label className="flex h-24 w-full cursor-pointer items-center justify-center rounded-md border border-dashed bg-muted/30 text-sm text-muted-foreground">
            <input type="file" name="idProof" className="hidden" />
            Drag & drop file or click to upload
          </label>
        </div>
      </Section>

      <div className="flex items-center justify-end gap-3">
        <Button type="button" variant="outline" onClick={onReset}>Reset Form</Button>
        <Button type="submit">Submit Admission</Button>
      </div>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border bg-white shadow-sm">
      <div className="border-b px-5 py-3 font-medium">{title}</div>
      <div className="p-5">{children}</div>
    </section>
  );
}
