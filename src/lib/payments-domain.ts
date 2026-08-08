export const PAYMENT_CURRENCY = "USD";
export const PAYMENT_BPS_DENOMINATOR = 10_000;

export const PAYMENT_ACCOUNT_STATUSES = [
  "not_started",
  "onboarding",
  "restricted",
  "active",
  "disabled",
] as const;

export const BOOKING_PAYMENT_STATUSES = [
  "pending",
  "requires_action",
  "processing",
  "succeeded",
  "failed",
  "cancelled",
  "refunded",
  "partially_refunded",
] as const;

export const PAYMENT_LEDGER_ENTRY_TYPES = [
  "client_charge",
  "platform_fee",
  "provider_gross",
  "refund",
  "dispute",
  "adjustment",
] as const;

export type PaymentAccountStatus = (typeof PAYMENT_ACCOUNT_STATUSES)[number];
export type BookingPaymentStatus = (typeof BOOKING_PAYMENT_STATUSES)[number];
export type PaymentLedgerEntryType = (typeof PAYMENT_LEDGER_ENTRY_TYPES)[number];

export interface PaymentSplitInput {
  amountCents: number;
  platformFeeBps: number;
}

export interface PaymentSplit {
  amountCents: number;
  applicationFeeCents: number;
  providerGrossCents: number;
}

export function assertCurrency(currency: string) {
  if (!/^[A-Z]{3}$/.test(currency)) {
    throw new Error("Currency must be a 3-letter ISO code.");
  }
}

export function assertCents(value: number, label = "amount") {
  if (!Number.isInteger(value) || value < 0) {
    throw new Error(`${label} must be a non-negative integer cent amount.`);
  }
}

export function calculatePaymentSplit({
  amountCents,
  platformFeeBps,
}: PaymentSplitInput): PaymentSplit {
  assertCents(amountCents, "amountCents");

  if (
    !Number.isInteger(platformFeeBps) ||
    platformFeeBps < 0 ||
    platformFeeBps > PAYMENT_BPS_DENOMINATOR
  ) {
    throw new Error("platformFeeBps must be between 0 and 10000.");
  }

  const applicationFeeCents = Math.round(
    (amountCents * platformFeeBps) / PAYMENT_BPS_DENOMINATOR
  );

  return {
    amountCents,
    applicationFeeCents,
    providerGrossCents: amountCents - applicationFeeCents,
  };
}

export function isPaymentAccountReady(status: PaymentAccountStatus) {
  return status === "active";
}

export function isTerminalBookingPaymentStatus(status: BookingPaymentStatus) {
  return ["succeeded", "failed", "cancelled", "refunded"].includes(status);
}
