/**
 * Converts a string into a URL-friendly slug.
 * Handles basic transliteration and removes special characters.
 */
export function slugify(text: string): string {
  if (!text) return "";
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")           // Replace spaces with -
    .replace(/[^\w\-]+/g, "")       // Remove all non-word chars
    .replace(/\-\-+/g, "-")         // Replace multiple - with single -
    .replace(/^-+/, "")             // Trim - from start of text
    .replace(/-+$/, "");            // Trim - from end of text
}

/**
 * Determines the payment plan type (Cash or Installment) for display on unit cards.
 * Returns 'Installment' if any plan is an installment, otherwise 'Cash' if any plans exist.
 */
export function getPaymentPlanType(paymentPlans?: { paymentType?: string; PaymentType?: string }[]): string | undefined {
  if (!paymentPlans || paymentPlans.length === 0) return undefined;
  
  const hasInstallment = paymentPlans.some(plan => {
    const type = (plan.paymentType || plan.PaymentType || "").toString().toLowerCase();
    return type === 'installment';
  });

  return hasInstallment ? 'Installment' : 'Cash';
}
