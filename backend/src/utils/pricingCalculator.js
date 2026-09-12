const { calculateRentalDays } = require("./dateHelpers");

exports.calculatePrice = ({
  car,
  startDate,
  endDate,
  plan,
  extras = [],
  promoCode,
}) => {
  if (!car?.pricing?.perDay) {
    throw new Error("Car pricing information is missing");
  }

  const days = calculateRentalDays(startDate, endDate);

  const basePrice = car.pricing.perDay * days;

  // Plan discount
  let planDiscount = 0;

  if (plan?.name) {
    const discountPercentage =
      car.pricing.discounts?.[plan.name] || 0;

    planDiscount =
      (basePrice * discountPercentage) / 100;
  }

  // Extras
  const extraCharges = extras.reduce((sum, extra) => {
    const price = Number(extra.price) || 0;

    return sum + price * days;
  }, 0);

  // Promo code
  let promoDiscount = 0;

  if (promoCode === "FIRST20") {
    promoDiscount = basePrice * 0.2;
  }

  // Insurance
  const insurance = basePrice * 0.1;

  const discountedBasePrice = Math.max(
    0,
    basePrice - planDiscount - promoDiscount
  );

  const subtotal =
    discountedBasePrice +
    extraCharges +
    insurance;

  // Temporary tax rate
  const taxes = subtotal * 0.08;

  const totalAmount = subtotal + taxes;

  return {
    days,

    basePrice: Number(basePrice.toFixed(2)),

    planDiscount: Number(
      planDiscount.toFixed(2)
    ),

    promoDiscount: Number(
      promoDiscount.toFixed(2)
    ),

    insurance: Number(
      insurance.toFixed(2)
    ),

    extraCharges: Number(
      extraCharges.toFixed(2)
    ),

    subtotal: Number(
      subtotal.toFixed(2)
    ),

    taxes: Number(
      taxes.toFixed(2)
    ),

    totalAmount: Number(
      totalAmount.toFixed(2)
    ),
  };
};