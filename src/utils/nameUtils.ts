export function getRenewType(n?: number) {
  switch(n) {
    case 1: return "续费"
    case 2: return "自动续费"
    default: return "开通"
  }
}

export function getAdminType(n?: number) {
  switch(n) {
    case 1: return "主播"
    case 2: return "房管"
  }
}