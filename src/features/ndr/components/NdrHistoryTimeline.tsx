import React from 'react';
import type { NdrRecord } from '../types';

interface NdrHistoryTimelineProps {
  record: NdrRecord;
}

type DotKind = 'done' | 'warn' | 'info' | 'pend';

interface TimelineRow {
  dot: DotKind;
  event: string;
  /** Day offset relative to the record's attempt date (-3, -1, 0…). */
  dayOffset: number;
  /** Display time (e.g. "10:30 AM"). Empty ⇒ render "Pending". */
  time: string;
  actionBy: string;
  /** May contain HTML formatting (only <b>) — sanitised by us. */
  detailHtml: string;
}

const MONTHS: Record<string, number> = {
  Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
  Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
};
const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** "9 Apr 2026" → Date instance (local midnight). */
function parseAttemptDate(s: string): Date {
  const [day, mon, yr] = s.split(' ');
  return new Date(parseInt(yr, 10), MONTHS[mon] ?? 0, parseInt(day, 10));
}

/** Format with the same ordinal-suffix style as the HTML prototype. */
function formatDate(d: Date): string {
  const day = d.getDate();
  const mon = MONTH_SHORT[d.getMonth()];
  const yr = d.getFullYear();
  const last = day % 10;
  const teen = day % 100;
  let ord = 'th';
  if (last === 1 && teen !== 11) ord = 'st';
  else if (last === 2 && teen !== 12) ord = 'nd';
  else if (last === 3 && teen !== 13) ord = 'rd';
  return `${day}${ord} ${mon} ${yr}`;
}

/**
 * Builds the synthetic event timeline used by the in-row expand panel.
 *
 * Mirrors `bExp()` in `ui-source/screens/ndr-v1.html`: starts with two
 * carrier events (pickup → in transit), then a stack of NDR raise +
 * seller-notified pairs scaled by the current attempt count, optional
 * SLA breach + seller-action rows, and a final outcome row that depends
 * on the record's priority bucket.
 */
function buildTimelineRows(r: NdrRecord): TimelineRow[] {
  const attempts = r.attemptCount;
  const overdue = r.sla === 'overdue';
  const isNone = r.priority === 'none';
  const transport = r.transportMode === 'air' ? 'Air' : 'Surface';

  const rows: TimelineRow[] = [];

  rows.push({
    dot: 'done',
    event: 'Order Picked Up',
    dayOffset: -(attempts + 2),
    time: '09:15 AM',
    actionBy: 'XpressBees',
    detailHtml: `Shipment AWB ${r.orderId} inducted at XpressBees origin hub.`,
  });
  rows.push({
    dot: 'done',
    event: 'In Transit',
    dayOffset: -(attempts + 1),
    time: '11:40 AM',
    actionBy: 'XpressBees',
    detailHtml: `Shipment moving to delivery hub via XpressBees ${transport} network.`,
  });

  if (attempts >= 1) {
    rows.push({
      dot: 'warn',
      event: 'NDR 1 Raised',
      dayOffset: -2,
      time: '02:10 PM',
      actionBy: 'XpressBees',
      detailHtml: `Reason: <b>${r.reason}</b>`,
    });
    if (!isNone) {
      rows.push({
        dot: 'info',
        event: 'Seller Notified',
        dayOffset: -2,
        time: '02:30 PM',
        actionBy: 'XpressBees',
        detailHtml: 'Reason: NDR alert sent via dashboard and SMS.',
      });
    }
  }

  if (attempts >= 1 && r.priority === 'seller') {
    rows.push({
      dot: 'done',
      event: 'Seller Action Taken',
      dayOffset: -1,
      time: '10:00 AM',
      actionBy: 'Seller',
      detailHtml:
        'Reason: Re-attempt instruction submitted with updated delivery details.',
    });
  }

  if (attempts >= 2) {
    rows.push({
      dot: 'warn',
      event: 'NDR 2 Raised',
      dayOffset: -1,
      time: '01:45 PM',
      actionBy: 'XpressBees',
      detailHtml: `Reason: <b>${r.reason}</b>`,
    });
    if (!isNone) {
      rows.push({
        dot: 'info',
        event: 'Seller Notified',
        dayOffset: -1,
        time: '02:05 PM',
        actionBy: 'XpressBees',
        detailHtml:
          'Reason: Second NDR alert sent. Action required within 12 hours.',
      });
    }
  }

  if (attempts >= 2 && overdue) {
    rows.push({
      dot: 'warn',
      event: 'SLA Breach',
      dayOffset: -1,
      time: '06:00 PM',
      actionBy: 'XpressBees',
      detailHtml:
        'Reason: Seller did not respond within the 24-hour window. RTO risk escalated.',
    });
  }

  if (attempts >= 3) {
    rows.push({
      dot: 'warn',
      event: 'NDR 3 Raised',
      dayOffset: 0,
      time: '10:30 AM',
      actionBy: 'XpressBees',
      detailHtml: `Reason: <b>${r.reason}</b>`,
    });
  }

  if (isNone) {
    if (r.reason.includes('IVR')) {
      rows.push({
        dot: 'done',
        event: 'Customer Confirmed — IVR',
        dayOffset: 0,
        time: '03:00 PM',
        actionBy: 'XpressBees',
        detailHtml:
          'Reason: Customer confirmed delivery via XpressBees IVR. Auto re-attempt scheduled.',
      });
    } else {
      rows.push({
        dot: 'done',
        event: 'Auto Re-attempt Scheduled',
        dayOffset: 0,
        time: '03:00 PM',
        actionBy: 'XpressBees',
        detailHtml:
          'Reason: XpressBees system scheduled next delivery. No seller action required.',
      });
    }
  } else {
    rows.push({
      dot: 'pend',
      event: 'Awaiting Seller Instruction',
      dayOffset: 0,
      time: '',
      actionBy: 'XpressBees',
      detailHtml: 'Reason: No action from Seller',
    });
  }

  return rows;
}

/**
 * Per-row history timeline rendered inside an expanded NDR row.
 *
 * Only `<b>` tags are emitted from the data builder — we set them via
 * `dangerouslySetInnerHTML` after escaping the rest of the string so a
 * future data swap can't smuggle in arbitrary markup.
 */
export const NdrHistoryTimeline: React.FC<NdrHistoryTimelineProps> = ({ record }) => {
  const rows = buildTimelineRows(record);
  const base = parseAttemptDate(record.attemptDate);

  return (
    <div className="ndr-ht-wrap">
      <div className="ndr-ht-hdr">
        <div className="ndr-ht-hdr-cell" />
        <div className="ndr-ht-hdr-cell">Event</div>
        <div className="ndr-ht-hdr-cell">Action By</div>
        <div className="ndr-ht-hdr-cell">Details</div>
      </div>
      {rows.map((row, idx) => {
        const isLast = idx === rows.length - 1;
        const d = new Date(base.getTime() + row.dayOffset * 86_400_000);
        const isPending = row.dayOffset === 0 && !row.time;
        const dateStr = isPending ? 'Pending' : formatDate(d);
        const timeStr = row.time ? ` | ${row.time}` : '';
        return (
          <div className="ndr-ht-row" key={idx}>
            {!isLast && <div className="ndr-ht-line" aria-hidden="true" />}
            <div className="ndr-ht-dot-wrap">
              <div className={`ndr-ht-dot ${row.dot}`} />
            </div>
            <div>
              <div className="ndr-ht-ev">{row.event}</div>
              <div className="ndr-ht-dt">
                {dateStr}
                {timeStr}
              </div>
            </div>
            <div className="ndr-ht-by">{row.actionBy}</div>
            <div
              className="ndr-ht-det"
              dangerouslySetInnerHTML={{ __html: sanitiseDetail(row.detailHtml) }}
            />
          </div>
        );
      })}
    </div>
  );
};

/* Allow only `<b>…</b>` markup; escape everything else. Keeps the data
   builder ergonomic while guaranteeing no other tags or attributes
   slip through to the DOM. */
function sanitiseDetail(s: string): string {
  const escaped = s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  return escaped
    .replace(/&lt;b&gt;/g, '<b>')
    .replace(/&lt;\/b&gt;/g, '</b>');
}

export default NdrHistoryTimeline;
