import React from "react";
import { BedInfo } from "@/pages/admin/Index"; // Adjust import path as needed
import { Button } from "@/components/ui/button";

type BedCardProps = {
  info: BedInfo;
  onEdit: () => void;
  onDelete: () => void;
  onAssign: () => void;
  onDischarge: () => void;
};

export function BedCard({ info, onEdit, onDelete, onAssign, onDischarge }: BedCardProps) {
  return (
    <div className="border rounded p-4 shadow-sm">
      <h3 className="font-semibold text-lg mb-2">Bed ID: {info.bedId}</h3>
      <p>Ward: {info.ward}</p>
      <p>Floor: {info.floor}</p>
      <p>Room: {info.room}</p>
      <p>Doctor: {info.doctor || "N/A"}</p>
      <p>Condition: {info.condition || "N/A"}</p>
      <p>Status: {info.status}</p>
      <p>
        Patient:{" "}
        {info.patient && info.patient.name
          ? info.patient.name
          : "No patient assigned"}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button onClick={onEdit} aria-label={`Edit bed ${info.bedId}`}>
          Edit
        </Button>
        <Button onClick={onDelete} variant="destructive" aria-label={`Delete bed ${info.bedId}`}>
          Delete
        </Button>
        {info.status !== "occupied" && (
          <Button onClick={onAssign} aria-label={`Assign bed ${info.bedId}`}>
            Assign
          </Button>
        )}
        {info.status === "occupied" && (
          <Button onClick={onDischarge} variant="outline" aria-label={`Discharge bed ${info.bedId}`}>
            Discharge
          </Button>
        )}
      </div>
    </div>
  );
}
