/**
 * Rate Calculator dataset & calculation helpers.
 *
 * Lifted as-is from `ui-source/screens/info-center v1.html`. All rates
 * are GST-inclusive (PDF source: "XB NEW RATE CARD"). Zones map to the
 * Information Center zone vocabulary:
 *   z1 = Within City (A)
 *   z2 = Regional (B)
 *   z3 = Metro to Metro (C)
 *   z4 = Rest of India (D)
 *   z5 = Special destination (E)
 */

import type {
  CalcOutput,
  PinDetails,
  PlanKey,
  PlanRates,
  ShippingMode,
  Zone,
  ZoneInfo,
} from '../types';

export const RATES: Record<PlanKey, PlanRates> = {
  bronze: {
    sfc: {
      slabs: [
        { wt: '0.5 kg', min: 0,    max: 0.5, z1: 33,  z2: 36,  z3: 50,  z4: 58,  z5: 70 },
        { wt: '+0.5 kg', min: 0.5, max: 1,   z1: 31,  z2: 33,  z3: 44,  z4: 50,  z5: 59,  addl: true },
        { wt: '1 kg',   min: 1,   max: 1,   z1: 60,  z2: 65,  z3: 90,  z4: 100, z5: 120 },
        { wt: '+1 kg',  min: 1,   max: 2,   z1: 54,  z2: 57,  z3: 80,  z4: 87,  z5: 100, addl: true },
        { wt: '2 kg',   min: 2,   max: 2,   z1: 101, z2: 118, z3: 165, z4: 182, z5: 215 },
        { wt: '+1 kg',  min: 2,   max: 5,   z1: 28,  z2: 31,  z3: 40,  z4: 45,  z5: 53,  addl: true },
        { wt: '5 kg',   min: 5,   max: 5,   z1: 150, z2: 180, z3: 230, z4: 250, z5: 285 },
        { wt: '+1 kg',  min: 5,   max: 10,  z1: 21,  z2: 24,  z3: 28,  z4: 31,  z5: 35,  addl: true },
        { wt: '10 kg',  min: 10,  max: 10,  z1: 220, z2: 280, z3: 350, z4: 380, z5: 425 },
        { wt: '+1 kg',  min: 10,  max: 999, z1: 18,  z2: 20,  z3: 22,  z4: 26,  z5: 28,  addl: true },
      ],
      cod_fixed: 34,
      cod_pct: 1.8,
    },
    air: {
      slabs: [
        { wt: '0.5 kg',     min: 0,   max: 0.5, z1: 33, z2: 36, z3: 75,  z4: 94, z5: 105 },
        { wt: '+0.5 kg',    min: 0.5, max: 1,   z1: 31, z2: 33, z3: 65,  z4: 81, z5: 95, addl: true },
        { wt: '+1 kg (Air)', min: 1,  max: 999, z1: 31, z2: 33, z3: 65,  z4: 81, z5: 95, addl: true },
      ],
      cod_fixed: 34,
      cod_pct: 1.8,
    },
  },
  silver: {
    sfc: {
      slabs: [
        { wt: '0.5 kg', min: 0,    max: 0.5, z1: 32,  z2: 34,  z3: 47,  z4: 54,  z5: 65 },
        { wt: '+0.5 kg', min: 0.5, max: 1,   z1: 30,  z2: 32,  z3: 42,  z4: 47,  z5: 57,  addl: true },
        { wt: '1 kg',   min: 1,   max: 1,   z1: 58,  z2: 63,  z3: 84,  z4: 94,  z5: 110 },
        { wt: '+1 kg',  min: 1,   max: 2,   z1: 48,  z2: 50,  z3: 76,  z4: 85,  z5: 92,  addl: true },
        { wt: '2 kg',   min: 2,   max: 2,   z1: 106, z2: 112, z3: 157, z4: 174, z5: 202 },
        { wt: '+1 kg',  min: 2,   max: 5,   z1: 27,  z2: 30,  z3: 39,  z4: 44,  z5: 51,  addl: true },
        { wt: '5 kg',   min: 5,   max: 5,   z1: 138, z2: 165, z3: 210, z4: 230, z5: 260 },
        { wt: '+1 kg',  min: 5,   max: 10,  z1: 21,  z2: 22,  z3: 27,  z4: 30,  z5: 34,  addl: true },
        { wt: '10 kg',  min: 10,  max: 10,  z1: 205, z2: 260, z3: 325, z4: 350, z5: 400 },
        { wt: '+1 kg',  min: 10,  max: 999, z1: 18,  z2: 20,  z3: 22,  z4: 25,  z5: 27,  addl: true },
      ],
      cod_fixed: 32,
      cod_pct: 1.75,
    },
    air: {
      slabs: [
        { wt: '0.5 kg',  min: 0,   max: 0.5, z1: 32, z2: 34, z3: 72, z4: 88, z5: 100 },
        { wt: '+0.5 kg', min: 0.5, max: 1,   z1: 30, z2: 32, z3: 62, z4: 77, z5: 91, addl: true },
        { wt: '+1 kg',   min: 1,   max: 999, z1: 30, z2: 32, z3: 62, z4: 77, z5: 91, addl: true },
      ],
      cod_fixed: 32,
      cod_pct: 1.75,
    },
  },
  gold: {
    sfc: {
      slabs: [
        { wt: '0.5 kg', min: 0,    max: 0.5, z1: 31,  z2: 32,  z3: 42,  z4: 50,  z5: 59 },
        { wt: '+0.5 kg', min: 0.5, max: 1,   z1: 30,  z2: 31,  z3: 40,  z4: 45,  z5: 53,  addl: true },
        { wt: '1 kg',   min: 1,   max: 1,   z1: 55,  z2: 56,  z3: 77,  z4: 88,  z5: 100 },
        { wt: '+1 kg',  min: 1,   max: 2,   z1: 48,  z2: 50,  z3: 73,  z4: 84,  z5: 92,  addl: true },
        { wt: '2 kg',   min: 2,   max: 2,   z1: 96,  z2: 101, z3: 144, z4: 159, z5: 186 },
        { wt: '+1 kg',  min: 2,   max: 5,   z1: 26,  z2: 28,  z3: 37,  z4: 41,  z5: 48,  addl: true },
        { wt: '5 kg',   min: 5,   max: 5,   z1: 126, z2: 151, z3: 195, z4: 212, z5: 238 },
        { wt: '+1 kg',  min: 5,   max: 10,  z1: 20,  z2: 21,  z3: 26,  z4: 28,  z5: 32,  addl: true },
        { wt: '10 kg',  min: 10,  max: 10,  z1: 189, z2: 238, z3: 301, z4: 326, z5: 363 },
        { wt: '+1 kg',  min: 10,  max: 999, z1: 17,  z2: 19,  z3: 21,  z4: 24,  z5: 26,  addl: true },
      ],
      cod_fixed: 29,
      cod_pct: 1.6,
    },
    air: {
      slabs: [
        { wt: '0.5 kg',  min: 0,   max: 0.5, z1: 31, z2: 32, z3: 65, z4: 82, z5: 95 },
        { wt: '+0.5 kg', min: 0.5, max: 1,   z1: 30, z2: 31, z3: 61, z4: 75, z5: 88, addl: true },
        { wt: '+1 kg',   min: 1,   max: 999, z1: 30, z2: 31, z3: 61, z4: 75, z5: 88, addl: true },
      ],
      cod_fixed: 29,
      cod_pct: 1.6,
    },
  },
  platinum: {
    sfc: {
      slabs: [
        { wt: '0.5 kg', min: 0,    max: 0.5, z1: 30,  z2: 31,  z3: 40,  z4: 47,  z5: 55 },
        { wt: '+0.5 kg', min: 0.5, max: 1,   z1: 28,  z2: 30,  z3: 38,  z4: 42,  z5: 51,  addl: true },
        { wt: '1 kg',   min: 1,   max: 1,   z1: 54,  z2: 55,  z3: 73,  z4: 84,  z5: 98 },
        { wt: '+1 kg',  min: 1,   max: 2,   z1: 41,  z2: 47,  z3: 69,  z4: 76,  z5: 85,  addl: true },
        { wt: '2 kg',   min: 2,   max: 2,   z1: 91,  z2: 96,  z3: 136, z4: 151, z5: 176 },
        { wt: '+1 kg',  min: 2,   max: 5,   z1: 25,  z2: 27,  z3: 34,  z4: 39,  z5: 46,  addl: true },
        { wt: '5 kg',   min: 5,   max: 5,   z1: 118, z2: 142, z3: 183, z4: 201, z5: 224 },
        { wt: '+1 kg',  min: 5,   max: 10,  z1: 18,  z2: 20,  z3: 24,  z4: 26,  z5: 30,  addl: true },
        { wt: '10 kg',  min: 10,  max: 10,  z1: 177, z2: 224, z3: 283, z4: 307, z5: 342 },
        { wt: '+1 kg',  min: 10,  max: 999, z1: 14,  z2: 17,  z3: 19,  z4: 21,  z5: 24,  addl: true },
      ],
      cod_fixed: 28,
      cod_pct: 1.5,
    },
    air: {
      slabs: [
        { wt: '0.5 kg',  min: 0,   max: 0.5, z1: 30, z2: 31, z3: 61, z4: 76, z5: 87 },
        { wt: '+0.5 kg', min: 0.5, max: 1,   z1: 28, z2: 30, z3: 56, z4: 69, z5: 81, addl: true },
        { wt: '+1 kg',   min: 1,   max: 999, z1: 28, z2: 30, z3: 56, z4: 69, z5: 81, addl: true },
      ],
      cod_fixed: 28,
      cod_pct: 1.5,
    },
  },
};

/** Tiny in-memory pincode lookup. Real product would call an API. */
export const PIN_DB: Record<string, PinDetails> = {
  '411006': ['Pune',       'Maharashtra',   'MH'],
  '411001': ['Pune',       'Maharashtra',   'MH'],
  '560025': ['Bangalore',  'Karnataka',     'KA'],
  '560001': ['Bangalore',  'Karnataka',     'KA'],
  '400001': ['Mumbai',     'Maharashtra',   'MH'],
  '400093': ['Mumbai',     'Maharashtra',   'MH'],
  '110001': ['New Delhi',  'Delhi',         'DL'],
  '110085': ['New Delhi',  'Delhi',         'DL'],
  '600001': ['Chennai',    'Tamil Nadu',    'TN'],
  '600020': ['Chennai',    'Tamil Nadu',    'TN'],
  '700001': ['Kolkata',    'West Bengal',   'WB'],
  '500001': ['Hyderabad',  'Telangana',     'TS'],
  '302001': ['Jaipur',     'Rajasthan',     'RJ'],
  '380001': ['Ahmedabad',  'Gujarat',       'GJ'],
  '226001': ['Lucknow',    'Uttar Pradesh', 'UP'],
  '800001': ['Patna',      'Bihar',         'BR'],
};

export function pinInfo(pin: string): PinDetails | null {
  return PIN_DB[pin] ?? null;
}

export function pinState(pin: string): string {
  return pinInfo(pin)?.[2] ?? '';
}

/** Static metadata describing each zone — drives the badge tooltip. */
export const ZONE_TABLE: ZoneInfo[] = [
  { dot: '#48BB78', name: 'Zone A', desc: 'Within-city',                                         label: 'Zone A · Within City' },
  { dot: '#63B3ED', name: 'Zone B', desc: 'Regional (Single Connection And Less than 500 Kms)', label: 'Zone B · Regional' },
  { dot: '#ED8936', name: 'Zone C', desc: 'Metro-Metro',                                        label: 'Zone C · Metro-Metro' },
  { dot: '#ECC94B', name: 'Zone D', desc: 'Rest of India',                                      label: 'Zone D · Rest of India' },
  { dot: '#FC8181', name: 'Zone E', desc: 'Jammu, HP, North East Excluding Manipur',            label: 'Zone E · Special Destination' },
  { dot: '#F56565', name: 'Zone F', desc: 'Kashmir, Manipur, Ladakh, Andman & Nicobar',         label: 'Zone F · Restricted' },
];

/** Index in `ZONE_TABLE` for a given zone key (used to highlight a row). */
export const ZONE_INDEX: Record<Zone, number> = { z1: 0, z2: 1, z3: 2, z4: 3, z5: 4 };

const METRO_CODES = ['400', '110', '560', '600', '700', '500'];

/** Heuristic zone detection — mirrors the prototype logic exactly. */
export function detectZone(pickup: string, drop: string): Zone {
  if (!pickup || !drop || pickup.length < 3 || drop.length < 3) return 'z3';
  const p3 = pickup.substring(0, 3);
  const d3 = drop.substring(0, 3);
  if (p3 === d3) return 'z1';
  const pState = pinState(pickup);
  const dState = pinState(drop);
  if (pState && pState === dState) return 'z2';
  const pMetro = METRO_CODES.indexOf(p3) > -1;
  const dMetro = METRO_CODES.indexOf(d3) > -1;
  if (pMetro && dMetro) return 'z3';
  return 'z4';
}

/* ── Rate lookup ─────────────────────────────────────────────────── */

/**
 * Returns the GST-inclusive base freight (in rupees) for a given plan / mode
 * / chargeable weight / zone. Slab math mirrors the HTML prototype.
 */
export function getBaseRate(
  plan: PlanKey,
  mode: ShippingMode,
  weightKg: number,
  zone: Zone,
): number {
  const data = RATES[plan][mode];
  if (!data) return 0;
  const slabs = data.slabs;
  const z = (s: { [k in Zone]: number }) => s[zone];

  if (weightKg <= 0.5) {
    const s = slabs.find((x) => !x.addl && x.max === 0.5);
    return s ? z(s) : 0;
  }

  if (weightKg <= 1) {
    const s1 = slabs.find((x) => !x.addl && x.max === 0.5);
    const a1 = slabs.find((x) => x.addl && x.min === 0.5 && x.max === 1);
    let base = s1 ? z(s1) : 0;
    if (a1) base += z(a1);
    return base;
  }

  if (mode === 'sfc') {
    if (weightKg <= 2) {
      const s2 = slabs.find((x) => !x.addl && x.max === 1);
      const a2 = slabs.find((x) => x.addl && x.min === 1 && x.max === 2);
      let base = s2 ? z(s2) : 0;
      base += Math.ceil(weightKg - 1) * (a2 ? z(a2) : 0);
      return base;
    }
    if (weightKg <= 5) {
      const s3 = slabs.find((x) => !x.addl && x.max === 2);
      const a3 = slabs.find((x) => x.addl && x.min === 2 && x.max === 5);
      let base = s3 ? z(s3) : 0;
      base += Math.ceil(weightKg - 2) * (a3 ? z(a3) : 0);
      return base;
    }
    if (weightKg <= 10) {
      const s4 = slabs.find((x) => !x.addl && x.max === 5);
      const a4 = slabs.find((x) => x.addl && x.min === 5 && x.max === 10);
      let base = s4 ? z(s4) : 0;
      base += Math.ceil(weightKg - 5) * (a4 ? z(a4) : 0);
      return base;
    }
    const s5 = slabs.find((x) => !x.addl && x.max === 10);
    const a5 = slabs.find((x) => x.addl && x.min === 10);
    let base = s5 ? z(s5) : 0;
    base += Math.ceil(weightKg - 10) * (a5 ? z(a5) : 0);
    return base;
  }

  // Air: simple per-kg model after 1 kg
  const airBase = slabs.find((x) => !x.addl && x.max === 0.5);
  const airAdd = slabs.find((x) => x.addl);
  let base = airBase ? z(airBase) : 0;
  base += Math.ceil(weightKg - 0.5) * (airAdd ? z(airAdd) : 0);
  return base;
}

/* ── Full calculation ─────────────────────────────────────────────── */

export interface CalcInput {
  pickup:       string;
  drop:         string;
  actualKg:     number;
  volKg:        number;
  plan:         PlanKey;
  isCod:        boolean;
  shipValue:    number;
}

/** Build the full breakdown shown on the right-hand result panel. */
export function calculateRates(input: CalcInput): CalcOutput {
  const { pickup, drop, actualKg, volKg, plan, isCod, shipValue } = input;
  const zone = detectZone(pickup, drop);
  const appKg = Math.max(actualKg, volKg, 0.5);
  const planData = RATES[plan];

  const buildBreakdown = (gross: number, codCharge: number): CalcOutput['surface'] => {
    const total = gross + codCharge;
    return {
      base: gross / 1.18,
      cod: codCharge,
      fuel: 'Included',
      gst: (gross * 0.18) / 1.18,
      total,
      isCod,
    };
  };

  /* Surface */
  const surfBase = getBaseRate(plan, 'sfc', appKg, zone);
  const surfCod = isCod
    ? Math.max(planData.sfc.cod_fixed, (planData.sfc.cod_pct * shipValue) / 100)
    : 0;
  const surface = buildBreakdown(surfBase, surfCod);

  /* Air Express */
  const airBase = getBaseRate(plan, 'air', appKg, zone);
  const airCod = isCod
    ? Math.max(planData.air.cod_fixed, (planData.air.cod_pct * shipValue) / 100)
    : 0;
  const express = buildBreakdown(airBase, airCod);

  /* RTO ≈ 70% of forward freight (prototype heuristic). */
  const rtoSurfaceGross = surfBase * 0.7;
  const rtoExpressGross = airBase * 0.7;
  const rtoSurface: CalcOutput['rtoSurface'] = {
    base: rtoSurfaceGross / 1.18,
    cod: 0,
    fuel: 'Included',
    gst: (rtoSurfaceGross * 0.18) / 1.18,
    total: rtoSurfaceGross,
    isCod: false,
  };
  const rtoExpress: CalcOutput['rtoExpress'] = {
    base: rtoExpressGross / 1.18,
    cod: 0,
    fuel: 'Included',
    gst: (rtoExpressGross * 0.18) / 1.18,
    total: rtoExpressGross,
    isCod: false,
  };

  return {
    zone,
    appKg,
    volKg,
    surfacePrice: surface.total,
    expressPrice: express.total,
    surface,
    express,
    rtoSurface,
    rtoExpress,
  };
}

/** Format a rupee value the way the prototype displays it. */
export function rupees(n: number): string {
  return `₹${n.toFixed(2)}`;
}
