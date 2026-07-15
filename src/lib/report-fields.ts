// Master schema for every non-photo field in the report template.
// Token names here must exactly match the {{TOKEN}} placeholders inserted
// into templates/report-template.docx (see the Phase 0 template audit).

export type FieldType = "text" | "date" | "number" | "textarea";

export interface ReportField {
  token: string;
  label: string;
  type: FieldType;
}

export interface FieldGroup {
  id: string;
  title: string;
  fields: ReportField[];
}

export const HEADER_GROUP: FieldGroup = {
  id: "header",
  title: "Report Header",
  fields: [
    { token: "CLIENT", label: "Client", type: "text" },
    { token: "VESSEL_NAME", label: "Vessel Name", type: "text" },
    { token: "OPERATION", label: "Operation", type: "text" },
    { token: "LOCATION_PORT", label: "Location / Port", type: "text" },
    { token: "DATE", label: "Date", type: "date" },
    { token: "REPORT_NO", label: "Report No.", type: "text" },
  ],
};

export const GENERAL_DETAILS_GROUP: FieldGroup = {
  id: "general-details",
  title: "General Details",
  fields: [
    { token: "OWNERS_VESSEL_CO", label: "Owners / Vessel Co.", type: "text" },
    { token: "TIME_OF_ARRIVAL", label: "Time of Arrival (Vessel)", type: "text" },
    { token: "WORK_START_FINISH", label: "Start & Finish Work", type: "text" },
    { token: "IMO_NO", label: "IMO No.", type: "text" },
    { token: "TOTAL_WORKING_HOURS", label: "Total Working Hours", type: "text" },
    { token: "DEADWEIGHT", label: "Deadweight (t)", type: "text" },
    { token: "WEATHER_CONDITION", label: "Weather Condition", type: "text" },
    { token: "LOA", label: "L.O.A (m)", type: "text" },
    { token: "VISIBILITY", label: "Visibility / Condition (m)", type: "text" },
    { token: "CONDITION", label: "Condition", type: "text" },
    { token: "DIVE_FOREMAN_SUPERVISOR", label: "Dive Foreman / Supervisor", type: "text" },
    { token: "CLASS_FLAG", label: "Class – Flag", type: "text" },
    { token: "DIVERS", label: "Divers", type: "textarea" },
  ],
};

export const ASSIGNMENT_GROUP: FieldGroup = {
  id: "assignment",
  title: "Underwater Assignment (quantities)",
  fields: [
    { token: "QTY_INSPECTION_PHOTOS", label: "Inspection with Photos", type: "number" },
    { token: "QTY_VIDEO_INSPECTION", label: "Video Inspection", type: "number" },
    { token: "QTY_WELDING_REPAIR", label: "Welding Repair", type: "number" },
    { token: "QTY_PROPELLER_POLISHING", label: "Propeller Polishing", type: "number" },
    { token: "QTY_CCTV_INSPECTION", label: "Class CCTV Inspection", type: "number" },
    { token: "QTY_SEA_CHESTS_CLEANING", label: "Sea Chests Cleaning", type: "number" },
    { token: "QTY_HULL_CLEANING", label: "Hull Cleaning", type: "number" },
    { token: "QTY_OTHERS_REPAIR", label: "Others Repair", type: "number" },
    { token: "QTY_PROPELLER_REPAIR", label: "Propeller Repair", type: "number" },
  ],
};

export const TEXT_FIELD_GROUPS: FieldGroup[] = [
  HEADER_GROUP,
  GENERAL_DETAILS_GROUP,
  ASSIGNMENT_GROUP,
];

// -- Parts condition table --------------------------------------------------

export interface PartRow {
  key: string;
  label: string;
}

export const PARTS: PartRow[] = [
  { key: "BOTTOM_PLATING", label: "Bottom Plating" },
  { key: "STBD_SIDE", label: "Stbd Side" },
  { key: "PORT_SIDE", label: "Port Side" },
  { key: "WELDING_SEAMS", label: "Welding Seams" },
  { key: "BILGE_KEEL_STBD", label: "Bilge Keel STBD" },
  { key: "BILGE_KEEL_PORT", label: "Bilge Keel PORT" },
  { key: "BOW_THRUST", label: "Bow Thrust" },
  { key: "SEA_CHESTS", label: "Sea Chests" },
  { key: "MAIN_PROPELLER", label: "Main Propeller" },
  { key: "RUDDER", label: "Rudder" },
  { key: "ICCP_ANODES", label: "ICCP / Typical Anodes" },
  { key: "PAINT_COATING", label: "Paint Coating" },
  { key: "ROPE_GUARD_TAIL_SHAFT", label: "Rope Guard & Tail Shaft" },
];

export type PartCondition = "" | "good" | "poor";

export interface PartFieldValue {
  barnacles: string;
  grass: string;
  other: string;
  condition: PartCondition;
}

export function emptyPartValue(): PartFieldValue {
  return { barnacles: "", grass: "", other: "", condition: "" };
}

export function partTokens(key: string) {
  return {
    barnacles: `PART_${key}_BARNACLES`,
    grass: `PART_${key}_GRASS`,
    other: `PART_${key}_OTHER`,
    good: `PART_${key}_GOOD`,
    poor: `PART_${key}_POOR`,
  };
}

const CHECK_MARK = "✔";

export function partValueToTokenData(
  key: string,
  value: PartFieldValue,
): Record<string, string> {
  const t = partTokens(key);
  return {
    [t.barnacles]: value.barnacles,
    [t.grass]: value.grass,
    [t.other]: value.other,
    [t.good]: value.condition === "good" ? CHECK_MARK : "",
    [t.poor]: value.condition === "poor" ? CHECK_MARK : "",
  };
}

// -- Full form state ----------------------------------------------------

export type TextFieldValues = Record<string, string>;
export type PartFieldValues = Record<string, PartFieldValue>;

export function emptyTextFieldValues(): TextFieldValues {
  const values: TextFieldValues = {};
  for (const group of TEXT_FIELD_GROUPS) {
    for (const field of group.fields) {
      values[field.token] = "";
    }
  }
  return values;
}

export function emptyPartFieldValues(): PartFieldValues {
  const values: PartFieldValues = {};
  for (const part of PARTS) {
    values[part.key] = emptyPartValue();
  }
  return values;
}

/** Flattens text fields + parts into the full token -> string map the docx template expects (excluding IMG_* tokens). */
export function buildTextTokenData(
  textValues: TextFieldValues,
  partValues: PartFieldValues,
): Record<string, string> {
  const data: Record<string, string> = { ...textValues };
  for (const part of PARTS) {
    Object.assign(data, partValueToTokenData(part.key, partValues[part.key] ?? emptyPartValue()));
  }
  return data;
}
