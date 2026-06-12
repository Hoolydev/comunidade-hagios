export type ProfileIntake = {
  name: string;
  company_role: string;
  company_name: string;
  company_sector: string;
  phone: string;
  city_state: string;
  urgent_operation_1: string;
  urgent_operation_2: string;
  urgent_operation_3: string;
};

const profileIntakeKeys = [
  "name",
  "company_role",
  "company_name",
  "company_sector",
  "phone",
  "city_state",
  "urgent_operation_1",
  "urgent_operation_2",
  "urgent_operation_3",
] as const;

function cleanText(value: unknown, maxLength = 700) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

export function normalizeProfileIntake(input: unknown) {
  const source =
    input && typeof input === "object" ? (input as Record<string, unknown>) : {};

  return profileIntakeKeys.reduce<Partial<ProfileIntake>>((acc, key) => {
    const value = cleanText(source[key]);
    if (value) acc[key] = value;
    return acc;
  }, {});
}

export function hasProfileIntake(data: Partial<ProfileIntake>) {
  return Object.keys(data).length > 0;
}

