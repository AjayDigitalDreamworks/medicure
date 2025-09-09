// import  AppLayout  from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function Upload() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [report, setReport] = useState<File | null>(null);
  const [prescription, setPrescription] = useState<File | null>(null);

  function reset() {
    setFullName("");
    setEmail("");
    setPhone("");
    setReport(null);
    setPrescription(null);
    const form = document.getElementById("upload-form") as HTMLFormElement | null;
    form?.reset();
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Here you can integrate with your API or MCP later
    alert("Report submitted successfully.");
    reset();
  }

  return (
    // <AppLayout headerTitle="Upload Medical Record">
      <form id="upload-form" onSubmit={onSubmit} className="space-y-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Upload Patient Reports</h2>
          <p className="text-muted-foreground mt-1">Securely upload medical test reports and doctor's prescriptions for patient records.</p>
        </div>

        <Card className="rounded-xl">
          <CardHeader>
            <CardTitle className="text-base md:text-lg">Patient Information</CardTitle>
            <p className="text-sm text-muted-foreground">Enter the patient's details to associate with the reports.</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="John Doe" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email Address</label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john.doe@example.com" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone Number</label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 (555) 987-6543" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl">
          <CardHeader>
            <CardTitle className="text-base md:text-lg">Document Uploads</CardTitle>
            <p className="text-sm text-muted-foreground">Upload the required medical documents for the patient.</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Medical Test Reports</label>
              <div className="flex items-center gap-3 rounded-md border p-2">
                <label className="inline-flex items-center gap-2 px-3 py-2 rounded-md border bg-secondary text-foreground cursor-pointer">
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => setReport(e.target.files?.[0] ?? null)}
                  />
                  Browse
                </label>
                <div className="text-sm text-muted-foreground flex-1 truncate">
                  {report ? report.name : "No file chosen"}
                </div>
              </div>
              <p className="text-xs text-muted-foreground">Max file size 10MB per file. Accepted formats: PDF, JPG, PNG.</p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Doctor's Prescription</label>
              <div className="flex items-center gap-3 rounded-md border p-2">
                <label className="inline-flex items-center gap-2 px-3 py-2 rounded-md border bg-secondary text-foreground cursor-pointer">
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => setPrescription(e.target.files?.[0] ?? null)}
                  />
                  Browse
                </label>
                <div className="text-sm text-muted-foreground flex-1 truncate">
                  {prescription ? prescription.name : "No file chosen"}
                </div>
              </div>
              <p className="text-xs text-muted-foreground">Max file size 10MB per file. Accepted formats: PDF, JPG, PNG.</p>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-end gap-3">
          <Button type="button" variant="outline" onClick={reset}>Cancel</Button>
          <Button type="submit">Submit Report</Button>
        </div>
      </form>
    // </AppLayout>
  );
}
