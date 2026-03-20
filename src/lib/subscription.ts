/**
 * Returns true if the LemonSqueezy subscription system is enabled.
 * When disabled, all users have full access and payment UI is hidden.
 */
export function isSubscriptionEnabled(): boolean {
  return process.env.NEXT_PUBLIC_LEMONSQUEEZY_ENABLED === "true";
}
