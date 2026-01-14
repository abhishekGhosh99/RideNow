exports.calculatePrice = ({
  car,
  startDate,
  endDate,
  plan,
  extras,
  promoCode,
}) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

  // Base price
  let basePrice = car.pricing.perDay * days;

  // Apply plan discount
  let planDiscount = 0;
  if (plan) {
    const discountPercentage = car.pricing.discounts[plan.name] || 0;
    planDiscount = (basePrice * discountPercentage) / 100;
  }

  // Calculate extras
  let extraCharges = 0;
  if (extras && extras.length > 0) {
    extraCharges = extras.reduce((sum, extra) => sum + extra.price * days, 0);
  }

  // Apply promo code (simplified - you'd check DB for real promo)
  let promoDiscount = 0;
  if (promoCode === "FIRST20") {
    promoDiscount = basePrice * 0.2;
  }

  // Insurance (10% of base)
  const insurance = basePrice * 0.1;

  // Taxes (8% of subtotal)
  const subtotal =
    basePrice - planDiscount - promoDiscount + extraCharges + insurance;
  const taxes = subtotal * 0.08;

  const totalAmount = subtotal + taxes;

  return {
    basePrice: parseFloat(basePrice.toFixed(2)),
    planDiscount: parseFloat(planDiscount.toFixed(2)),
    promoDiscount: parseFloat(promoDiscount.toFixed(2)),
    insurance: parseFloat(insurance.toFixed(2)),
    extraCharges: parseFloat(extraCharges.toFixed(2)),
    taxes: parseFloat(taxes.toFixed(2)),
    totalAmount: parseFloat(totalAmount.toFixed(2)),
  };
};
