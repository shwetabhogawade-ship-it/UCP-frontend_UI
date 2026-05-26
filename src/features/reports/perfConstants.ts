import type { PerformanceSubReport, PerformanceReportType } from '../../types/reports';

export const PERF_OPTIONS: Record<PerformanceReportType, PerformanceSubReport> = {
  overall: {
    label: 'Overall Delivery Performance',
    purpose: 'High-level shipment outcome monitoring',
    defaults: ['Delivered', 'LOST', 'RTO', 'Shipped', 'STD', 'Grand Total', 'Delivered %', 'LOST %', 'RTO %'],
    additional: {
      'Avg Delivery TAT': 'Adds delivery speed visibility',
      'In Transit Count': 'Shows pending shipment exposure',
      'NDR Count': 'Adds failed delivery visibility',
      'SLA Breach %': 'Highlights delayed shipment exposure',
      'First Attempt Delivery %': 'Measures delivery efficiency'
    }
  },
  codprepaid: {
    label: 'Prepaid / COD Delivery Performance',
    purpose: 'Payment-mode operational comparison',
    defaults: ['Payment Mode', 'Delivered', 'LOST', 'RTO', 'Grand Total', 'Delivered %', 'RTO %'],
    additional: {
      'COD Success %': 'Measures COD delivery reliability',
      'COD Conversion %': 'Shows COD conversion quality',
      'Avg COD Delivery TAT': 'Tracks COD delivery speed',
      'COD NDR %': 'Highlights COD failure risk'
    }
  },
  sla: {
    label: 'SLA Performance',
    purpose: 'Delivery timeliness and SLA compliance',
    defaults: ['Ontime', 'Beyond SLA', 'RTO/UD', 'Grand Total', 'Ontime %', 'Beyond SLA %'],
    additional: {
      'Pickup SLA %': 'Tracks pickup SLA compliance',
      'Delivery SLA %': 'Measures delivery SLA adherence',
      'Avg Delivery Delay Days': 'Quantifies delays',
      'Aging Buckets': 'Segments delayed shipments'
    }
  },
  attempt: {
    label: 'Attemptwise Delivery Performance',
    purpose: 'Delivery attempt efficiency analysis',
    defaults: ['1st Attempt', '2nd Attempt', '3rd Attempt', '>3 Attempts', 'RTO/UD', 'Grand Total'],
    additional: {
      'First Attempt Delivery %': 'Measures first-attempt efficiency',
      'Reattempt Success %': 'Tracks retry effectiveness',
      'Avg Attempts per Shipment': 'Shows delivery effort',
      'Fake Attempt %': 'Highlights fake attempt risk'
    }
  },
  statewise: {
    label: 'Statewise Delivery Performance',
    purpose: 'Geography-wise delivery analysis',
    defaults: ['State', 'Delivered', 'LOST', 'RTO', 'Grand Total', 'Delivered %', 'S2A', 'S2D', 'FAD'],
    additional: {
      'Avg State TAT': 'Shows state-level delivery speed',
      'Zone': 'Enables regional grouping',
      'Hub': 'Adds operational hub visibility',
      'State SLA %': 'Measures SLA by geography'
    }
  },
  rto: {
    label: 'RTO Reasons',
    purpose: 'Root-cause analysis of failed deliveries',
    defaults: ['NDR Reason', 'Attempt Buckets (0,1,2,3,4,>5)', 'Grand Total', 'Contribution %'],
    additional: {
      'OTP Failure %': 'Tracks OTP-related failures',
      'Customer Refusal %': 'Measures refusal-driven RTO',
      'Retry Trend %': 'Analyzes retry effectiveness',
      'Repeat NDR %': 'Identifies repeated failures'
    }
  }
};
