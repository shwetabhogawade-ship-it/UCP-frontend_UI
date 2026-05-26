export interface ScheduledReport {
  id: number;
  title: string;
  enabled: boolean;
  recipients: string[];
  rtype: 'Order Report' | 'NDR Report' | 'Performance Report';
  status: string[]; // Selected Order Statuses or Performance Sub-Reports
  sub: string[];    // Selected Order Types (COD, Prepaid, Pick Up) or other options
  freq: 'month' | 'week' | 'day';
  time: string;
  dataLastNum: number;
  dataLastUnit: 'Days' | 'Weeks' | 'Months';
  date?: string;       // Selected send date (YYYY-MM-DD) for monthly frequency
  dayOfWeek?: string;  // Selected send day (Monday - Sunday) for weekly frequency
  additionalMetrics?: Record<string, string[]>; // e.g. { overall: ['Avg Delivery TAT'], codprepaid: [] }
  isNew?: boolean;
}

export type DateFilterType = 'last7' | 'last30' | 'thismonth' | 'lastmonth' | 'custom';

export interface DateFilterState {
  type: DateFilterType;
  label: string;
  startDate?: string;
  endDate?: string;
}

export interface PerformanceSubReport {
  label: string;
  purpose: string;
  defaults: string[];
  additional: Record<string, string>;
}

export type PerformanceReportType = 'overall' | 'codprepaid' | 'sla' | 'attempt' | 'statewise' | 'rto';
