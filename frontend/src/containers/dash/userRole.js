export const roles = [
  { role: 'BSSuperAdmin', url: 'BSSuperAdmin' },
  { role: 'BSAdmin', url: 'BSAdmin' },
  { role: 'BSUser', url: 'BSUser' },
  { role: 'BSUserReport', url: 'BSUserReport' },
  { role: 'HRMS', url: 'HRMS' },
  { role: 'Employee', url: 'Employee' },
  { role: 'ValueEnable', url: 'BimaRakshak' },
  { role: 'BSOps', url: 'BSOps' },
  { role:'BSDops', url: 'BSDops'},
  { role: 'UW', url: 'UW' },
  { role: 'BSCallCenter', url: 'BSCallCenter' },
  { role: 'BSRenewals', url: 'BSRenewals' },
  { role: 'BSSalesSupport', url: 'BSSalesSupport' },
  { role: 'ROM', url: 'ROM' },
  { role: 'GENAI', url: 'GenAI' },
  { role: 'BTSPOC', url: 'BTSPOC' },
  { role: "SpeedBizTicket", url: "SpeedBizTicket"},
  { role: "SashaktUser", url: "SashaktUser"},
];

// Extract `roleList` dynamically from `roles` to avoid redundancy
export const roleList = roles.map((item) => item.role);
