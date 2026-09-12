"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import {
  ArrowLeft,
  CarFront,
  CheckCircle2,
  CreditCard,
  Loader2,
  Lock,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
);

const getImage = (car) => {
  if (Array.isArray(car?.images) && car.images.length > 0) {
    const firstImage = car.images.find((image) =>
      typeof image === "string" ? image : image?.url || image?.src,
    );

    if (typeof firstImage === "string") return firstImage;

    return firstImage?.url || firstImage?.src || "";
  }

  return car?.image || "";
};

const formatDate = (date) => {
  if (!date) return "—";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "—";

  return parsedDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const formatLocation = (location) => {
  if (!location) return "—";
  if (typeof location === "string") return location;

  return (
    [location.address, location.city, location.zipCode]
      .filter(Boolean)
      .join(", ") || "—"
  );
};

const PaymentForm = ({ booking }) => {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const params = useParams();
  const { authFetch } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cardComplete, setCardComplete] = useState(false);

  const car = booking?.car;

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      setError("Payment system is still loading. Please try again.");
      return;
    }

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      setError("Card details are unavailable.");
      return;
    }

    if (!cardComplete) {
      setError("Please enter your complete card details.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      /*
       * STEP 1
       * Ask our backend to create a Stripe PaymentIntent.
       */
      const intentResponse = await authFetch("/payments/create-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          bookingId: params.bookingId,
        }),
      });

      const intentData = await intentResponse.json();

      if (!intentResponse.ok || !intentData.success) {
        throw new Error(intentData.message || "Unable to start payment.");
      }

      const { clientSecret } = intentData.data;

      /*
       * STEP 2
       * Confirm the card payment with Stripe.
       */
      const { error: stripeError, paymentIntent } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: booking?.driverInfo?.name || booking?.user?.name || "",
              email: booking?.driverInfo?.email || booking?.user?.email || "",
            },
          },
        });

      if (stripeError) {
        throw new Error(
          stripeError.message || "Your payment could not be completed.",
        );
      }

      if (!paymentIntent) {
        throw new Error("Stripe did not return a payment result.");
      }

      if (paymentIntent.status !== "succeeded") {
        throw new Error(
          `Payment was not completed. Status: ${paymentIntent.status}`,
        );
      }

      /*
       * STEP 3
       * Get the Stripe PaymentMethod ID.
       */
      const paymentMethodId =
        typeof paymentIntent.payment_method === "string"
          ? paymentIntent.payment_method
          : paymentIntent.payment_method?.id;

      if (!paymentMethodId) {
        throw new Error("Payment method information was not returned.");
      }

      /*
       * STEP 4
       * Tell our backend to create the Payment record
       * and mark the booking as paid/confirmed.
       */
      const confirmResponse = await authFetch("/payments/confirm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          paymentIntentId: paymentIntent.id,
          bookingId: params.bookingId,
          paymentMethodId,
        }),
      });

      const confirmData = await confirmResponse.json();

      if (!confirmResponse.ok || !confirmData.success) {
        throw new Error(
          confirmData.message ||
            "Payment succeeded, but booking confirmation failed.",
        );
      }

      /*
       * STEP 5
       * Send the user to the success page.
       */
      router.push(`/booking/success/${params.bookingId}`);
    } catch (err) {
      console.error("Payment error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while processing your payment.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (!booking) return null;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Card section */}
      <section className="border border-[#27272A] bg-[#111113]">
        <div className="border-b border-[#27272A] px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center border border-[#D4AF5A]/30 bg-[#D4AF5A]/10">
              <CreditCard className="h-4 w-4 text-[#D4AF5A]" />
            </div>

            <div>
              <h2 className="text-base font-semibold text-[#F4F4F5]">
                Payment details
              </h2>

              <p className="mt-1 text-xs text-[#71717A]">
                Your card information is securely handled by Stripe.
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <label className="mb-3 block text-xs font-medium uppercase tracking-[0.12em] text-[#A1A1AA]">
            Card information
          </label>

          <div className="border border-[#27272A] bg-[#09090B] px-4 py-4 transition-colors focus-within:border-[#D4AF5A]/60">
            <CardElement
              onChange={(event) => {
                setCardComplete(event.complete);

                if (event.error) {
                  setError(event.error.message);
                } else {
                  setError("");
                }
              }}
              options={{
                style: {
                  base: {
                    color: "#F4F4F5",
                    fontSize: "16px",
                    fontFamily: "Inter, system-ui, -apple-system, sans-serif",
                    "::placeholder": {
                      color: "#71717A",
                    },
                  },
                  invalid: {
                    color: "#F87171",
                  },
                },
              }}
            />
          </div>

          {error && (
            <div className="mt-4 border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <div className="mt-5 flex items-start gap-3">
            <Lock className="mt-0.5 h-4 w-4 shrink-0 text-[#71717A]" />

            <p className="text-xs leading-5 text-[#71717A]">
              RideNow never stores your card number or security code. Payment
              details are securely processed by Stripe.
            </p>
          </div>
        </div>
      </section>

      {/* Security */}
      <div className="flex items-center gap-3 border border-[#27272A] bg-[#111113] px-5 py-4">
        <ShieldCheck className="h-5 w-5 text-[#D4AF5A]" />

        <div>
          <p className="text-sm font-medium text-[#F4F4F5]">Secure payment</p>

          <p className="mt-0.5 text-xs text-[#71717A]">
            Encrypted and securely processed by Stripe.
          </p>
        </div>
      </div>

      {/* Pay */}
      <button
        type="submit"
        disabled={!stripe || !elements || loading}
        className="flex h-14 w-full items-center justify-center gap-3 bg-[#D4AF5A] px-6 text-sm font-semibold text-[#09090B] transition-all duration-200 hover:bg-[#E0BE70] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Processing payment...
          </>
        ) : (
          <>
            <Lock className="h-4 w-4" />
            Pay ₹
            {Number(booking.pricing?.totalAmount || 0).toLocaleString("en-IN")}
          </>
        )}
      </button>
    </form>
  );
};

const CheckoutPage = () => {
  const params = useParams();
  const router = useRouter();
  const { authFetch, loading: authLoading } = useAuth();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await authFetch(`/bookings/${params.bookingId}`, {
          credentials: "include",
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Unable to load booking.");
        }

        setBooking(data.data);
      } catch (err) {
        console.error("Booking fetch error:", err);

        setError(
          err instanceof Error ? err.message : "Unable to load booking.",
        );
      } finally {
        setLoading(false);
      }
    };

    if (params.bookingId && !authLoading) {
      fetchBooking();
    }
  }, [params.bookingId, authLoading, authFetch]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#09090B] pt-[76px]">
        <div className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-[#D4AF5A]" />
        </div>
      </main>
    );
  }

  if (error || !booking) {
    return (
      <main className="min-h-screen bg-[#09090B] px-6 pt-[120px]">
        <div className="mx-auto max-w-xl border border-[#27272A] bg-[#111113] p-8 text-center">
          <h1 className="text-xl font-semibold text-[#F4F4F5]">
            Unable to load checkout
          </h1>

          <p className="mt-3 text-sm text-[#A1A1AA]">
            {error || "This booking could not be found."}
          </p>

          <Link
            href="/dashboard/bookings"
            className="mt-6 inline-flex h-11 items-center justify-center bg-[#D4AF5A] px-5 text-sm font-semibold text-[#09090B]"
          >
            View bookings
          </Link>
        </div>
      </main>
    );
  }

  const car = booking.car;

  const image = getImage(car) || "/images/car-placeholder.jpg";

  const basePrice = Number(booking?.pricing?.basePrice || 0);

  const insurance = Number(booking?.pricing?.insurance || 0);

  const taxes = Number(booking?.pricing?.taxes || 0);

  const total = Number(booking?.pricing?.totalAmount || 0);

  return (
    <main className="min-h-screen bg-[#09090B] pt-[76px] text-[#F4F4F5]">
      <div className="mx-auto max-w-7xl px-6 py-12 sm:px-8 lg:px-10">
        {/* Header */}
        <div className="mb-10">
          <Link
            href={`/booking/${car?._id || ""}`}
            className="mb-6 inline-flex items-center gap-2 text-sm text-[#71717A] transition-colors hover:text-[#F4F4F5]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to booking
          </Link>

          <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#D4AF5A]">
            Secure checkout
          </p>

          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
            Complete your reservation
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#A1A1AA]">
            Review your reservation and securely complete your payment.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_390px] lg:items-start">
          {/* Payment */}
          <div>
            <Elements
              stripe={stripePromise}
              options={{
                appearance: {
                  theme: "night",
                  variables: {
                    colorPrimary: "#D4AF5A",
                    colorBackground: "#09090B",
                    colorText: "#F4F4F5",
                    colorTextSecondary: "#A1A1AA",
                    colorDanger: "#F87171",
                    borderRadius: "0px",
                  },
                },
              }}
            >
              <PaymentForm booking={booking} />
            </Elements>
          </div>

          {/* Summary */}
          <aside className="border border-[#27272A] bg-[#111113] lg:sticky lg:top-[100px]">
            <div className="border-b border-[#27272A] p-6">
              <p className="text-xs font-medium uppercase tracking-[0.15em] text-[#71717A]">
                Reservation
              </p>

              <div className="mt-5 overflow-hidden border border-[#27272A] bg-[#09090B]">
                <div className="relative h-48">
                  <img
                    src={image}
                    alt={car?.name || "Rental car"}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="font-semibold text-[#F4F4F5]">
                        {car?.name || "Vehicle"}
                      </h2>

                      <p className="mt-1 text-xs text-[#71717A]">
                        {car?.brand || "RideNow Fleet"}
                      </p>
                    </div>

                    <CarFront className="h-5 w-5 text-[#D4AF5A]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Dates */}
            <div className="space-y-4 border-b border-[#27272A] p-6">
              <div className="flex justify-between gap-5">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.12em] text-[#71717A]">
                    Pickup
                  </p>

                  <p className="mt-1 text-sm font-medium">
                    {formatDate(booking.startDate)}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-[11px] uppercase tracking-[0.12em] text-[#71717A]">
                    Return
                  </p>

                  <p className="mt-1 text-sm font-medium">
                    {formatDate(booking.endDate)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 text-[#D4AF5A]" />

                <div>
                  <p className="text-xs text-[#71717A]">Pickup location</p>

                  <p className="mt-1 text-sm text-[#F4F4F5]">
                    {formatLocation(booking.pickupLocation)}
                  </p>
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="space-y-4 p-6">
              {/* Base rental */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-500">Rental</span>

                <span className="text-sm font-medium text-zinc-200">
                  ₹{basePrice.toLocaleString("en-IN")}
                </span>
              </div>

              {/* Insurance */}
              {insurance > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-500">Insurance</span>

                  <span className="text-sm font-medium text-zinc-200">
                    ₹{insurance.toLocaleString("en-IN")}
                  </span>
                </div>
              )}

              {/* Taxes */}
              {taxes > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-500">Taxes</span>

                  <span className="text-sm font-medium text-zinc-200">
                    ₹{taxes.toLocaleString("en-IN")}
                  </span>
                </div>
              )}

              {/* Total */}
              <div className="border-t border-white/[0.08] pt-5">
                <div className="flex items-end justify-between">
                  <span className="text-sm font-medium text-zinc-300">
                    Total
                  </span>

                  <span className="text-3xl font-semibold tracking-[-0.04em] text-white">
                    ₹{total.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default CheckoutPage;
