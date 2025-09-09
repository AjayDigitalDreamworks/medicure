import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export type DoctorStatus =
  | "available"
  | "on-duty"
  | "in-consultation"
  | "in-surgery"
  | "on-leave";

export interface DoctorInfo {
  id: string;
  name: string;
  specialization: string;
  department: string;
  room: string;
  nextSlot: string;
  status: DoctorStatus;
}

function statusBadge(status: DoctorStatus) {
  switch (status) {
    case "available":
      return {
        label: "Available",
        className: "bg-emerald-50 text-emerald-700 border border-emerald-200",
      };
    case "on-duty":
      return {
        label: "On Duty",
        className: "bg-sky-50 text-sky-700 border border-sky-200",
      };
    case "in-consultation":
      return {
        label: "In Consultation",
        className: "bg-amber-50 text-amber-700 border border-amber-200",
      };
    case "in-surgery":
      return {
        label: "In Surgery",
        className: "bg-purple-50 text-purple-700 border border-purple-200",
      };
    case "on-leave":
      return {
        label: "On Leave",
        className: "bg-rose-50 text-rose-700 border border-rose-200",
      };
    default:
      return {
        label: "Unknown",
        className: "bg-muted text-muted-foreground border",
      };
  }
}

export function DoctorCard({ info }: { info: DoctorInfo }) {
  const b = statusBadge(info.status);

  const initials = info.name
    ?.split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <Card className="rounded-xl">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Avatar className="size-10">
            <AvatarFallback>{initials || "DR"}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold leading-none">{info.name}</p>
                <p className="text-xs text-muted-foreground">{info.doctorProfile.specialization}</p>
              </div>
              <Badge className={cn(b.className)}>{b.label}</Badge>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
              <div>
                <span className="text-foreground">Room: </span>
                {info.room}
              </div>
              <div>
                <span className="text-foreground">Next Slot: </span>
                {info.nextSlot}
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <Button size="sm" variant="outline">
                View Profile
              </Button>
              <Button size="sm">Book</Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
