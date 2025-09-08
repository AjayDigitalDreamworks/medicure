import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Reports() {
  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Medical Reports</h1>
          <p className="text-sm text-muted-foreground">Comprehensive snapshot of labs and imaging.</p>
        </div>
      </header>

      <section className="rounded-xl border bg-white shadow-sm">
        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <h3 className="font-medium">Patient Overview</h3>
            <div className="grid gap-2 text-sm text-muted-foreground">
              <p>
                <span className="font-medium text-foreground">Date of Birth:</span> July 20, 1985
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-medium text-foreground">Allergies:</span>
                <Badge variant="secondary" className="bg-rose-100 text-rose-700 border-rose-200">Penicillin</Badge>
                <Badge variant="secondary" className="bg-rose-100 text-rose-700 border-rose-200">Dust Mites</Badge>
              </div>
            </div>
          </div>

          <div className="space-y-2 text-right">
            <p className="text-sm text-muted-foreground">Alice Johnson (P1001)</p>
            <div className="grid gap-2 text-left sm:text-right">
              <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                <span className="text-sm text-muted-foreground">Diagnoses:</span>
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 border-emerald-200">Hypertension (ICD-10 I10)</Badge>
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 border-emerald-200">Type 2 Diabetes (ICD-10 E11)</Badge>
              </div>
              <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                <span className="text-sm text-muted-foreground">Active Medications:</span>
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 border-emerald-200">Lisinopril 10mg (daily)</Badge>
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 border-emerald-200">Metformin 500mg (BID)</Badge>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-xl border bg-white shadow-sm">
        <div className="border-b px-5 py-3 font-medium">Latest Laboratory Results</div>
        <div className="p-2 sm:p-5">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Test Name</TableHead>
                <TableHead>Result</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Reference Range</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {labRows.map((r) => (
                <TableRow key={r.name}>
                  <TableCell className="font-medium">{r.name}</TableCell>
                  <TableCell>{r.result}</TableCell>
                  <TableCell>{r.unit}</TableCell>
                  <TableCell>{r.range}</TableCell>
                  <TableCell>
                    {r.status === "Abnormal" ? (
                      <Badge className="bg-rose-100 text-rose-700 border-rose-200">Abnormal</Badge>
                    ) : (
                      <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">Normal</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      <section className="rounded-xl border bg-white shadow-sm">
        <div className="border-b px-5 py-3 font-medium">Recent Imaging Reports</div>
        <div className="p-2 sm:p-5">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Summary</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {imagingRows.map((r) => (
                <TableRow key={r.date + r.type}>
                  <TableCell className="whitespace-nowrap">{r.date}</TableCell>
                  <TableCell className="whitespace-nowrap">{r.type}</TableCell>
                  <TableCell className="max-w-3xl text-muted-foreground">{r.summary}</TableCell>
                  <TableCell>
                    <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">Completed</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-6 flex justify-end">
            <Button>Export Report</Button>
          </div>
        </div>
      </section>
    </div>
  );
}

const labRows = [
  { name: "Glucose (Fasting)", result: 135, unit: "mg/dL", range: "70-99", status: "Abnormal" as const },
  { name: "HbA1c", result: 7.2, unit: "%", range: "<5.7", status: "Abnormal" as const },
  { name: "Total Cholesterol", result: 180, unit: "mg/dL", range: "<200", status: "Normal" as const },
  { name: "HDL Cholesterol", result: 45, unit: "mg/dL", range: ">40", status: "Normal" as const },
  { name: "LDL Cholesterol", result: 105, unit: "mg/dL", range: "<100", status: "Abnormal" as const },
];

const imagingRows = [
  { date: "2023-06-15", type: "Chest X-Ray", summary: "No acute cardiopulmonary abnormality." },
  { date: "2023-05-20", type: "Abdominal CT", summary: "Mild fatty liver infiltration." },
  { date: "2023-04-10", type: "Knee MRI", summary: "Degenerative changes, medial meniscus tear." },
  { date: "2023-03-01", type: "Brain MRI", summary: "No acute intracranial pathology." },
  { date: "2023-02-15", type: "Echocardiogram", summary: "Normal left ventricular function." },
];
