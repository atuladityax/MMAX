function normalizedRole(user) {
  return user?.role?.trim().toLowerCase().replace(/[\s_-]+/g, "") ?? "";
}

export function isLead(user) {
  const role = normalizedRole(user);
  return role === "lead" || role === "teamleader";
}

export function isEmployee(user) {
  return normalizedRole(user) === "employee";
}

export function same(first, second) {
  return first != null && second != null && String(first) === String(second);
}
