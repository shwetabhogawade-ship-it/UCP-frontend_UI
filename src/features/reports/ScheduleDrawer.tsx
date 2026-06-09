import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useReportsStore } from '../../store/useReportsStore';
import ReportDetailsForm from './ReportDetailsForm';
import OrderContentForm from './OrderContentForm';
import PerformanceMetricsForm from './PerformanceMetricsForm';
import FrequencyForm from './FrequencyForm';
import { PERF_OPTIONS } from './perfConstants';
import type { PerformanceReportType } from '../../types/reports';

interface FormValues {
  rType: 'order' | 'ndr' | 'productwise' | 'performance' | '';
  rName: string;
  rEmail: string;
  orderTypes: string[];
  orderStatuses: string[];
  orderSubStatuses: string[];
  perfTypes: string[];
  additionalMetrics: Record<string, string[]>;
  freq: 'month' | 'week' | 'day';
  rDate: string;
  rDayOfWeek: string;
  rTime: string;
  dataLastNum: number;
  dataLastUnit: 'Days' | 'Weeks' | 'Months';
}

export const ScheduleDrawer: React.FC = () => {
  const reports = useReportsStore((state) => state.reports);
  const drawer = useReportsStore((state) => state.drawer);
  const closeDrawer = useReportsStore((state) => state.closeDrawer);
  const addReport = useReportsStore((state) => state.addReport);
  const updateReport = useReportsStore((state) => state.updateReport);
  const openSuccess = useReportsStore((state) => state.openSuccess);
  const showToast = useReportsStore((state) => state.showToast);

  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      rType: '',
      rName: '',
      rEmail: '',
      orderTypes: ['COD', 'Prepaid', 'Pick Up'],
      orderStatuses: ['Pending', 'Ready to Ship', 'In Transit', 'Delivered', 'RTO', 'Pick Up in Reattempt', 'Awaiting Pickup', 'Out for Delivery'],
      orderSubStatuses: ['Returned', 'Undelivered', 'Delivered', 'Lost'],
      perfTypes: [],
      additionalMetrics: {},
      freq: 'month',
      rDate: '2026-05-19',
      rDayOfWeek: 'Wednesday',
      rTime: '06:12',
      dataLastNum: 1,
      dataLastUnit: 'Days',
    }
  });

  const editingReport = drawer.editingId ? reports.find(r => r.id === drawer.editingId) : null;

  // Sync edit values
  useEffect(() => {
    if (drawer.open) {
      if (editingReport) {
        const typeMap: Record<string, 'order' | 'ndr' | 'productwise' | 'performance'> = {
          'Order Report': 'order',
          'NDR Report': 'ndr',
          'Product Wise Summary': 'productwise',
          'Performance Report': 'performance',
        };
        const rTypeVal = typeMap[editingReport.rtype] || 'order';

        reset({
          rType: rTypeVal,
          rName: editingReport.title,
          rEmail: editingReport.recipients[0] || '',
          orderTypes: rTypeVal === 'order' ? editingReport.sub : [],
          orderStatuses: rTypeVal === 'order' ? editingReport.status : [],
          orderSubStatuses: rTypeVal === 'order' ? editingReport.sub : [], // sub-status
          perfTypes: rTypeVal === 'performance' ? editingReport.status : [],
          additionalMetrics: editingReport.additionalMetrics || {},
          freq: editingReport.freq,
          rDate: editingReport.date || '2026-05-19',
          rDayOfWeek: editingReport.dayOfWeek || 'Wednesday',
          rTime: editingReport.time || '06:12',
          dataLastNum: editingReport.dataLastNum || 1,
          dataLastUnit: editingReport.dataLastUnit || 'Days',
        });
      } else {
        reset({
          rType: '',
          rName: '',
          rEmail: '',
          orderTypes: ['COD', 'Prepaid', 'Pick Up'],
          orderStatuses: ['Pending', 'Ready to Ship', 'In Transit', 'Delivered', 'RTO', 'Pick Up in Reattempt', 'Awaiting Pickup', 'Out for Delivery'],
          orderSubStatuses: ['Returned', 'Undelivered', 'Delivered', 'Lost'],
          perfTypes: [],
          additionalMetrics: {},
          freq: 'month',
          rDate: '2026-05-19',
          rDayOfWeek: 'Wednesday',
          rTime: '06:12',
          dataLastNum: 1,
          dataLastUnit: 'Days',
        });
      }
    }
  }, [drawer.open, editingReport, reset]);

  const onSubmit = (data: FormValues) => {
    if (!data.rType) {
      showToast('Please select a report type');
      return;
    }

    let name = '';
    let recipientsList = [data.rEmail];
    let statusValues: string[] = [];
    let subValues: string[] = [];

    if (data.rType === 'order') {
      name = data.rName.trim();
      statusValues = data.orderStatuses;
      subValues = data.orderTypes;
    } else if (data.rType === 'ndr') {
      name = data.rName.trim();
      statusValues = ['Undelivered', 'NDR Raised'];
      subValues = ['COD', 'Prepaid'];
    } else if (data.rType === 'productwise') {
      name = data.rName.trim();
      statusValues = ['All Products'];
      subValues = ['-'];
    } else if (data.rType === 'performance') {
      if (data.perfTypes.length === 0) {
        showToast('Select at least one report type');
        return;
      }
      const isConsolidated = data.perfTypes.includes('consolidated');
      name = isConsolidated
        ? 'Consolidated Performance Report'
        : (data.perfTypes.length === 1
            ? PERF_OPTIONS[data.perfTypes[0] as PerformanceReportType].label
            : `Performance Report (${data.perfTypes.length} types)`);
      recipientsList = ['reports@store.com'];
      statusValues = data.perfTypes;
      subValues = isConsolidated ? ['All types'] : data.perfTypes;
    }

    const typeLabel: 'Order Report' | 'NDR Report' | 'Product Wise Summary' | 'Performance Report' =
      data.rType === 'order'
        ? 'Order Report'
        : data.rType === 'ndr'
        ? 'NDR Report'
        : data.rType === 'productwise'
        ? 'Product Wise Summary'
        : 'Performance Report';

    const freqLabel =
      data.freq === 'month' ? 'monthly' : data.freq === 'week' ? 'weekly' : 'daily';

    const commonData = {
      title: name,
      enabled: editingReport ? editingReport.enabled : true,
      recipients: recipientsList,
      rtype: typeLabel,
      status: statusValues,
      sub: subValues,
      freq: data.freq,
      time: data.rTime,
      dataLastNum: data.dataLastNum,
      dataLastUnit: data.dataLastUnit,
      date: data.freq === 'month' ? data.rDate : undefined,
      dayOfWeek: data.freq === 'week' ? data.rDayOfWeek : undefined,
      additionalMetrics: data.rType === 'performance' ? data.additionalMetrics : undefined,
    };

    if (editingReport) {
      updateReport(editingReport.id, commonData);
      showToast('Report updated');
      closeDrawer();
    } else {
      addReport(commonData);
      closeDrawer();
      openSuccess(name, typeLabel, freqLabel);
    }
  };

  if (!drawer.open) return null;

  return (
    <div
      className={`drw-ov ${drawer.open ? 'sh' : ''}`}
      onClick={(e) => e.target === e.currentTarget && closeDrawer()}
    >
      <form className="drw" onSubmit={handleSubmit(onSubmit)}>
        <div className="drw-hdr">
          <div className="drw-back" onClick={closeDrawer}>
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" width="13" height="13">
              <path d="M10 3L5 8l5 5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>{' '}
            Back
          </div>
          <div className="drw-title">
            {editingReport ? 'Edit Report' : 'Schedule Report'}
          </div>
        </div>

        <div className="drw-body">
          {/* LEFT PANEL */}
          <div>
            <ReportDetailsForm
              register={register}
              errors={errors}
              watch={watch}
              setValue={setValue}
            />
            <OrderContentForm watch={watch} setValue={setValue} />
            <PerformanceMetricsForm watch={watch} setValue={setValue} />
          </div>

          {/* RIGHT PANEL — always visible per v2 spec */}
          <FrequencyForm watch={watch} setValue={setValue} register={register} />
        </div>

        <div className="drw-ft">
          <button type="button" className="btn btn-s" onClick={closeDrawer}>
            Cancel
          </button>
          <button type="submit" className="btn btn-p">
            {editingReport ? 'Save Changes' : 'Schedule Report'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ScheduleDrawer;
