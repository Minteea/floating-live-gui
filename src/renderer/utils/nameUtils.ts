export function getAdminType(n?: string) {
  switch (n) {
    case "anchor":
      return '主播';
    case "admin":
      return '房管';
  }
}
