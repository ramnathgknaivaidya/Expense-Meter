const Svg = ({ children, size = 18, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    {children}
  </svg>
);

export const IconFood = (p) => <Svg {...p}><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></Svg>;
export const IconTransport = (p) => <Svg {...p}><path d="M5 17a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2"/><circle cx="7" cy="15" r="2"/><circle cx="17" cy="15" r="2"/><path d="M5 7 7 3h10l2 4"/></Svg>;
export const IconHousing = (p) => <Svg {...p}><path d="M3 9.5 12 3l9 6.5V21a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Z"/><path d="M9 21V12h6v9"/></Svg>;
export const IconBills = (p) => <Svg {...p}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5Z"/><path d="M14 2v6h6"/><path d="M9 13h6"/><path d="M9 17h6"/></Svg>;
export const IconShopping = (p) => <Svg {...p}><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></Svg>;
export const IconHealthcare = (p) => <Svg {...p}><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></Svg>;
export const IconEducation = (p) => <Svg {...p}><path d="M22 10v6M2 10l10-5 10 5-10 5Z"/><path d="M6 12v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5"/></Svg>;
export const IconEntertainment = (p) => <Svg {...p}><polygon points="5 3 19 12 5 21 5 3"/></Svg>;
export const IconTravel = (p) => <Svg {...p}><path d="M17.8 19.2 16 11l3.5-3.5a2 2 0 0 0-2-2L14 9l-8.2-1.8a.5.5 0 0 0-.6.6L7 14l-4 4 4 4 4-4 5.2 1.6a.5.5 0 0 0 .6-.4Z"/></Svg>;
export const IconFallback = (p) => <Svg {...p}><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></Svg>;
export const IconSalary = (p) => <Svg {...p}><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></Svg>;
export const IconFreelance = (p) => <Svg {...p}><path d="M20 14.7V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h6"/><path d="M8 10h8"/><path d="M8 14h5"/><path d="M18 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 0v2"/></Svg>;
export const IconBusiness = (p) => <Svg {...p}><rect x="2" y="3" width="20" height="7" rx="1"/><path d="M6 10v11"/><path d="M10 10v11"/><path d="M14 10v4"/><path d="M18 10v7"/></Svg>;
export const IconInvestment = (p) => <Svg {...p}><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></Svg>;
export const IconBonus = (p) => <Svg {...p}><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/></Svg>;
export const IconRental = (p) => <Svg {...p}><path d="M3 9.5 12 3l9 6.5V21a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Z"/><circle cx="12" cy="13" r="2"/></Svg>;
export const IconOther = (p) => <Svg {...p}><circle cx="12" cy="12" r="10"/><path d="M12 8v8"/><path d="M8 12h8"/></Svg>;

export const IconCash = (p) => <Svg {...p}><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/><circle cx="12" cy="13" r="2"/></Svg>;
export const IconUpi = (p) => <Svg {...p}><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12" y2="18.01"/></Svg>;
export const IconCard = (p) => <Svg {...p}><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></Svg>;
export const IconBank = (p) => <Svg {...p}><rect x="2" y="8" width="20" height="14" rx="2"/><path d="M12 2 2 8h20Z"/><path d="M8 14h8"/><path d="M8 18h5"/></Svg>;

export const IconWallet = (p) => <Svg {...p}><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></Svg>;
export const IconChartUp = (p) => <Svg {...p}><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></Svg>;
export const IconChartDown = (p) => <Svg {...p}><path d="M3 3v18h18"/><path d="m19 16-5-5-4 4-3-3"/></Svg>;
export const IconPiggy = (p) => <Svg {...p}><path d="M19 5c-1.5 0-2.8.5-4 1.3-.8-.2-1.7-.3-2.5-.3-4 0-7.5 2.5-9 6-1.5 3.5-1 7 0 9H7l1 3h6l1-3c1.5-.5 3-1.5 4-3 1.3 0 2.5-.5 3.5-1.5"/><circle cx="16" cy="12" r="1"/></Svg>;
export const IconTarget = (p) => <Svg {...p}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></Svg>;
export const IconGrowth = (p) => <Svg {...p}><path d="M22 7h-5"/><path d="M17 7v5"/><path d="M3 17.5 8 12l4 4 5-5"/><path d="M14 17h5"/></Svg>;
export const IconCalendar = (p) => <Svg {...p}><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></Svg>;
export const IconPin = (p) => <Svg {...p}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></Svg>;
export const IconCrown = (p) => <Svg {...p}><path d="M2 20h20M4 10l3-7 5 5 5-7 3 7"/><path d="M4 20V10"/><path d="M20 20V10"/></Svg>;
export const IconAdd = (p) => <Svg {...p}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></Svg>;
export const IconEdit = (p) => <Svg {...p}><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></Svg>;
export const IconDelete = (p) => <Svg {...p}><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></Svg>;
export const IconExport = (p) => <Svg {...p}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></Svg>;
export const IconBackup = (p) => <Svg {...p}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></Svg>;
export const IconReset = (p) => <Svg {...p}><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></Svg>;
export const IconTrash = (p) => <Svg {...p}><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></Svg>;
export const IconSun = (p) => <Svg {...p}><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></Svg>;
export const IconMoon = (p) => <Svg {...p}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></Svg>;
export const IconBell = (p) => <Svg {...p}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></Svg>;
export const IconBarChart = (p) => <Svg {...p}><path d="M3 3v18h18"/><path d="M7 16v-3"/><path d="M12 16v-7"/><path d="M17 16V8"/></Svg>;
export const IconIncome = (p) => <Svg {...p}><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></Svg>;
export const IconExpense = (p) => <Svg {...p}><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></Svg>;
export const IconGrid = (p) => <Svg {...p}><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></Svg>;
export const IconRefresh = (p) => <Svg {...p}><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></Svg>;
export const IconProfile = (p) => <Svg {...p}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></Svg>;
export const IconAnalytics = (p) => <Svg {...p}><path d="M3 3v18h18"/><path d="m18.7 8-5.1 5.2-2.8-2.7L7 14.3"/></Svg>;
export const IconBudget = (p) => <Svg {...p}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></Svg>;
export const IconCamera = (p) => <Svg {...p}><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2Z"/><circle cx="12" cy="13" r="4"/></Svg>;
export const IconFile = (p) => <Svg {...p}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5Z"/><polyline points="14 2 14 8 20 8"/></Svg>;
export const IconDraft = (p) => <Svg {...p}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5Z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="8" y1="16" x2="14" y2="16"/></Svg>;
export const IconClose = (p) => <Svg {...p}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></Svg>;
export const IconHamburger = (p) => <Svg {...p}><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></Svg>;
export const IconArrowRight = (p) => <Svg {...p}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></Svg>;
export const IconLoading = (p) => <Svg {...p}><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></Svg>;
export const IconBolt = (p) => <Svg {...p}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></Svg>;
export const IconCheck = (p) => <Svg {...p}><polyline points="20 6 9 17 4 12"/></Svg>;
export const IconHistory = (p) => <Svg {...p}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></Svg>;
