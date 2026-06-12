/**
 * Shared types for the Information Center module.
 * Mirrors the vocabulary used in the original HTML prototype
 * (`ui-source/screens/info-center v1.html`).
 */

export type WeightUnit = 'KG' | 'GM';
export type ShippingMode = 'sfc' | 'air';
export type PaymentType = 'cod' | 'prepaid';
export type YesNo = 'yes' | 'no';
export type ResultTab = 'forward' | 'return';

export type PlanKey = 'bronze' | 'silver' | 'gold' | 'platinum';

/** Zones used to lookup rates and surface in the badge tooltip. */
export type Zone = 'z1' | 'z2' | 'z3' | 'z4' | 'z5';

/** Single slab inside a `RateChunk.slabs[]` list. */
export interface RateSlab {
  wt:    string;
  min:   number;
  max:   number;
  z1:    number;
  z2:    number;
  z3:    number;
  z4:    number;
  z5:    number;
  /** `addl: true` rows describe the per-kg add-on portion. */
  addl?: boolean;
}

export interface RateChunk {
  slabs:     RateSlab[];
  cod_fixed: number;
  cod_pct:   number;
}

export interface PlanRates {
  sfc: RateChunk;
  air: RateChunk;
}

/** Tuple returned by `pinInfo()` — [city, state, stateCode]. */
export type PinDetails = [city: string, state: string, code: string];

export interface ZoneInfo {
  /** Hex used for the dot in the tooltip & the active highlight stripe. */
  dot:   string;
  name:  string;
  desc:  string;
  label: string;
}

export interface CarrierBreakdown {
  base:  number;
  cod:   number;
  fuel:  string;
  gst:   number;
  total: number;
  isCod: boolean;
}

export interface CalcOutput {
  zone:        Zone;
  appKg:       number;
  volKg:       number;
  surfacePrice: number;
  expressPrice: number;
  surface:     CarrierBreakdown;
  express:     CarrierBreakdown;
  rtoSurface:  CarrierBreakdown;
  rtoExpress:  CarrierBreakdown;
}

/* ── Rate Card screen ─────────────────────────────────────────── */

/** 5-element zone array → [z1, z2, z3, z4, z5]. */
export type ZoneTuple = [number, number, number, number, number];

export interface SfcRateBlock {
  s05:   ZoneTuple;
  s05a:  ZoneTuple;
  s2:    ZoneTuple;
  s2a:   ZoneTuple;
  s5:    ZoneTuple;
  s5a:   ZoneTuple;
  s10:   ZoneTuple;
  s10a:  ZoneTuple;
}

export interface AirRateBlock {
  s05:   ZoneTuple;
  s05a:  ZoneTuple;
}

export interface PlanRateData {
  label:      string;
  cls:        PlanKey;
  commitment: string;
  cod_fixed:  number;
  cod_pct:    number;
  sfc:        SfcRateBlock;
  air:        AirRateBlock;
}

export type RateCardMode = 'all' | 'air' | 'sfc';

export interface RateCardService {
  /** Display name (e.g. "Surface Xpressbees 2 KG"). */
  name:         string;
  /** Mode tag pill at the start of the service-header row. */
  modeTag:      'AIR' | 'SFC' | 'REVERSE';
  /** Base-fare slab in 5-zone tuple form. */
  base:         ZoneTuple;
  /** Every-additional slab in 5-zone tuple form. */
  addl:         ZoneTuple;
  /** Sub-label rendered in the base-fare data row. */
  baseFareDesc: string;
  /** Sub-label rendered in the every-additional data row. */
  addlDesc:     string;
  /** When true, only the FWD value is shown (RTO not applicable). */
  isReverse:    boolean;
}

/* ── Pincode Serviceability screen ────────────────────────────── */

export type PsStatus = 'serviceable' | 'unserviceable';

export interface PsService {
  name:   string;
  detail: string;
  ok:     boolean;
  icon:   string;
}

export interface PsResult {
  origin:       string;
  destination:  string;
  originInfo:   PinDetails | null;
  destInfo:     PinDetails | null;
  zone:         Zone;
  zoneLabel:    string;
  etaLabel:     string;
  status:       PsStatus;
  services:     PsService[];
}
