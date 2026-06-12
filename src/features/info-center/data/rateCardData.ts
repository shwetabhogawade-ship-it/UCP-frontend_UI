/**
 * Rate Card dataset & helpers.
 *
 * Mirrors the `PDF_DATA`, `DTO_NOQC`, `DTO_QC`, `ZONE_COL_LABELS`
 * and `renderRateCard()` service-builder logic from
 * `ui-source/screens/info-center v1.html`.
 *
 * All prices stored as GST-inclusive integers. The Rate Card screen
 * toggles between GST-inclusive (`× 1`) and ex-GST (`÷ 1.18`) display
 * modes via {@link formatPrice}.
 */

import type {
  AirRateBlock,
  PlanKey,
  PlanRateData,
  RateCardMode,
  RateCardService,
  SfcRateBlock,
  ZoneTuple,
} from '../types';

/**
 * Express Reverse (DTO) — fixed across all plans, no QC.
 * Lifted as-is from the HTML prototype's `DTO_NOQC` constant.
 */
export const DTO_NOQC: { base: ZoneTuple; addl: ZoneTuple } = {
  base: [41, 44, 61, 71, 84],
  addl: [40, 43, 57, 64, 77],
};

/**
 * Express Reverse (DTO) with QC — fixed across all plans.
 * Lifted as-is from the HTML prototype's `DTO_QC` constant.
 */
export const DTO_QC: { base: ZoneTuple; addl: ZoneTuple } = {
  base: [91, 94, 111, 121, 134],
  addl: [40, 43, 57, 64, 77],
};

/** Zone column labels used by the rate card table header. */
export const ZONE_COL_LABELS = ['Zone 1', 'Zone 2', 'Zone 3', 'Zone 4', 'Zone 5'] as const;

const BRONZE_SFC: SfcRateBlock = {
  s05:  [32, 34, 47, 54, 65],   s05a: [31, 33, 44, 50, 59],
  s2:   [106, 112, 159, 177, 207], s2a: [28, 31, 40, 45, 53],
  s5:   [139, 168, 216, 236, 264], s5a: [21, 24, 28, 31, 35],
  s10:  [209, 264, 334, 361, 404], s10a:[18, 20, 22, 26, 28],
};
const BRONZE_AIR: AirRateBlock = {
  s05:  [32, 34, 71, 88, 102],  s05a: [31, 33, 65, 81, 95],
};

const SILVER_SFC: SfcRateBlock = {
  s05:  [31, 33, 45, 52, 63],   s05a: [30, 32, 42, 47, 57],
  s2:   [101, 107, 152, 169, 197], s2a: [27, 30, 39, 44, 51],
  s5:   [133, 159, 205, 224, 251], s5a: [21, 22, 27, 30, 34],
  s10:  [199, 251, 317, 343, 384], s10a:[18, 20, 22, 25, 27],
};
const SILVER_AIR: AirRateBlock = {
  s05:  [31, 33, 68, 84, 98],   s05a: [30, 32, 62, 77, 91],
};

const GOLD_SFC: SfcRateBlock = {
  s05:  [31, 32, 42, 50, 59],   s05a: [30, 31, 40, 45, 53],
  s2:   [96, 101, 144, 159, 186], s2a: [26, 28, 37, 41, 48],
  s5:   [126, 151, 195, 212, 238], s5a: [20, 21, 26, 28, 32],
  s10:  [189, 238, 301, 326, 363], s10a:[17, 19, 21, 24, 26],
};
const GOLD_AIR: AirRateBlock = {
  s05:  [31, 32, 65, 82, 95],   s05a: [30, 31, 61, 75, 88],
};

const PLATINUM_SFC: SfcRateBlock = {
  s05:  [30, 31, 40, 47, 55],   s05a: [28, 30, 38, 42, 51],
  s2:   [91, 96, 136, 151, 176], s2a: [25, 27, 34, 39, 46],
  s5:   [118, 142, 183, 201, 224], s5a: [18, 20, 24, 26, 30],
  s10:  [177, 224, 283, 307, 342], s10a:[14, 17, 19, 21, 24],
};
const PLATINUM_AIR: AirRateBlock = {
  s05:  [30, 31, 61, 76, 87],   s05a: [28, 30, 56, 69, 81],
};

/**
 * Per-plan rate card payload — exact values from the
 * Xpressbees Wallet Commercials PDF (GST inclusive).
 */
export const PDF_DATA: Record<PlanKey, PlanRateData> = {
  bronze: {
    label: 'XB Bronze', cls: 'bronze',
    commitment: 'No Monthly Commitment',
    cod_fixed: 32, cod_pct: 1.8,
    sfc: BRONZE_SFC, air: BRONZE_AIR,
  },
  silver: {
    label: 'XB Silver', cls: 'silver',
    commitment: 'Min 1,000 Shipments/Month',
    cod_fixed: 30, cod_pct: 1.75,
    sfc: SILVER_SFC, air: SILVER_AIR,
  },
  gold: {
    label: 'XB Gold', cls: 'gold',
    commitment: 'Min 4,000 Shipments/Month',
    cod_fixed: 29, cod_pct: 1.6,
    sfc: GOLD_SFC, air: GOLD_AIR,
  },
  platinum: {
    label: 'XB Platinum', cls: 'platinum',
    commitment: 'Min 7,000 Shipments/Month',
    cod_fixed: 28, cod_pct: 1.5,
    sfc: PLATINUM_SFC, air: PLATINUM_AIR,
  },
};

interface SlabDef {
  suffix:       '0.5 KG' | '2 KG' | '5 KG' | '10 KG';
  base:         keyof SfcRateBlock;
  addl:         keyof SfcRateBlock;
  baseFareDesc: string;
  addlDesc:     string;
}

const SFC_SLABS: SlabDef[] = [
  { suffix: '0.5 KG', base: 's05', addl: 's05a',
    baseFareDesc: 'Base Fare (upto 0.5 kg)',
    addlDesc:     'Every Additional 500 gms (upto 1.5 kg)' },
  { suffix: '2 KG',   base: 's2',  addl: 's2a',
    baseFareDesc: 'Base Fare (upto 2 kg)',
    addlDesc:     'Every Additional 1 kg (upto 5 kg)' },
  { suffix: '5 KG',   base: 's5',  addl: 's5a',
    baseFareDesc: 'Base Fare (upto 5 kg)',
    addlDesc:     'Every Additional 1 kg (upto 10 kg)' },
  { suffix: '10 KG',  base: 's10', addl: 's10a',
    baseFareDesc: 'Base Fare (upto 10 kg)',
    addlDesc:     'Every Additional 1 kg' },
];

const AIR_SLABS = [
  { suffix: '0.5 KG',
    base: 's05'  as keyof AirRateBlock,
    addl: 's05a' as keyof AirRateBlock,
    baseFareDesc: 'Base Fare (upto 0.5 kg)',
    addlDesc:     'Every Additional 500 gms (upto 1.5 kg)' },
];

/**
 * Build the list of {@link RateCardService} rows for the v3 rate-card
 * table given a plan and the active mode tab.
 *
 * Express Reverse (DTO + DTO with QC) is always appended last,
 * regardless of mode, matching the HTML prototype.
 */
export function buildRateCardServices(
  plan: PlanRateData,
  mode: RateCardMode,
): RateCardService[] {
  const services: RateCardService[] = [];

  if (mode === 'all' || mode === 'air') {
    AIR_SLABS.forEach((sl) => {
      services.push({
        name:         `Air Xpressbees ${sl.suffix}`,
        modeTag:      'AIR',
        base:         plan.air[sl.base],
        addl:         plan.air[sl.addl],
        baseFareDesc: sl.baseFareDesc,
        addlDesc:     sl.addlDesc,
        isReverse:    false,
      });
    });
  }
  if (mode === 'all' || mode === 'sfc') {
    SFC_SLABS.forEach((sl) => {
      services.push({
        name:         `Surface Xpressbees ${sl.suffix}`,
        modeTag:      'SFC',
        base:         plan.sfc[sl.base],
        addl:         plan.sfc[sl.addl],
        baseFareDesc: sl.baseFareDesc,
        addlDesc:     sl.addlDesc,
        isReverse:    false,
      });
    });
  }

  services.push({
    name:         'Express Reverse (DTO)',
    modeTag:      'REVERSE',
    base:         DTO_NOQC.base,
    addl:         DTO_NOQC.addl,
    baseFareDesc: 'Base Fare (upto 0.5 kg)',
    addlDesc:     'Every Additional 500 gms (upto 1.5 kg)',
    isReverse:    true,
  });
  services.push({
    name:         'Express Reverse (DTO) with QC',
    modeTag:      'REVERSE',
    base:         DTO_QC.base,
    addl:         DTO_QC.addl,
    baseFareDesc: 'Base Fare (upto 0.5 kg)',
    addlDesc:     'Every Additional 500 gms (upto 1.5 kg)',
    isReverse:    true,
  });

  return services;
}

/**
 * Round-format a GST-inclusive price for display. Pass `gstIncluded=false`
 * to back-compute the ex-GST value (÷ 1.18).
 */
export function formatPrice(value: number, gstIncluded: boolean): number {
  return gstIncluded ? Math.round(value) : Math.round(value / 1.18);
}

/** Human-readable label for the dark plan bar mode chip. */
export function modeDisplayLabel(mode: RateCardMode): string {
  if (mode === 'all') return 'AIR + SFC + REVERSE';
  if (mode === 'air') return 'AIR';
  return 'SFC';
}
