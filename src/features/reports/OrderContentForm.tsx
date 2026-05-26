import React from 'react';
import type { UseFormWatch, UseFormSetValue } from 'react-hook-form';
import MultiSelectDropdown from '../../components/ui/MultiSelectDropdown';

interface OrderContentFormProps {
  watch: UseFormWatch<any>;
  setValue: UseFormSetValue<any>;
}

export const OrderContentForm: React.FC<OrderContentFormProps> = ({ watch, setValue }) => {
  const rType = watch('rType');
  const orderTypes = watch('orderTypes') || [];
  const orderStatuses = watch('orderStatuses') || [];
  const orderSubStatuses = watch('orderSubStatuses') || [];

  if (rType !== 'order') return null;

  const orderTypeOptions = [
    { value: 'COD', label: 'COD' },
    { value: 'Prepaid', label: 'Prepaid' },
    { value: 'Pick Up', label: 'Pick Up' },
  ];

  const orderStatusOptions = [
    { value: 'Pending', label: 'Pending' },
    { value: 'Ready to Ship', label: 'Ready to Ship' },
    { value: 'In Transit', label: 'In Transit' },
    { value: 'Delivered', label: 'Delivered' },
    { value: 'RTO', label: 'RTO' },
    { value: 'Pick Up in Reattempt', label: 'Pick Up in Reattempt' },
    { value: 'Awaiting Pickup', label: 'Awaiting Pickup' },
    { value: 'Out for Delivery', label: 'Out for Delivery' },
    { value: 'Reattempted Successfully', label: 'Reattempted Successfully' },
    { value: 'Not Picked Up', label: 'Not Picked Up' },
    { value: 'Lost', label: 'Lost' },
  ];

  const subStatusOptions = [
    { value: 'Returned', label: 'Returned' },
    { value: 'Undelivered', label: 'Undelivered' },
    { value: 'Delivered', label: 'Delivered' },
    { value: 'Lost', label: 'Lost' },
    { value: 'Pick-up Pending', label: 'Pick-up Pending' },
  ];

  return (
    <div className="dc">
      <div className="dc-title">
        <div className="dc-ico">
          <svg viewBox="0 0 16 16" fill="none" stroke="var(--ink2)" strokeWidth="1.5" width="14" height="14">
            <path d="M2 4h12M2 8h8M2 12h5" strokeLinecap="round" />
          </svg>
        </div>
        Report Content
      </div>

      <div className="mf">
        <div className="ml">Order Type</div>
        <MultiSelectDropdown
          options={orderTypeOptions}
          selectedValues={orderTypes}
          onChange={(val) => setValue('orderTypes', val)}
          placeholder="Select order types"
        />
      </div>

      <div className="mf">
        <div className="ml">Order Status</div>
        <MultiSelectDropdown
          options={orderStatusOptions}
          selectedValues={orderStatuses}
          onChange={(val) => setValue('orderStatuses', val)}
          placeholder="Select order statuses"
        />
      </div>

      <div className="mf" style={{ marginBottom: 0 }}>
        <div className="ml">Order Sub-Status</div>
        <MultiSelectDropdown
          options={subStatusOptions}
          selectedValues={orderSubStatuses}
          onChange={(val) => setValue('orderSubStatuses', val)}
          placeholder="Select sub-statuses"
        />
      </div>
    </div>
  );
};

export default OrderContentForm;
