import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { supabase } from "../lib/supabase";

export default function PricingPage() {
  const [currentPlan, setCurrentPlan] = useState("Free");
  const [loadingPlan, setLoadingPlan] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const loadPlan = async () => {
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) throw sessionError;

        if (!session?.user) {
          if (!cancelled) setCurrentPlan("Free");
          return;
        }

        const { data, error } = await supabase
          .from("user_subscriptions")
          .select("plan, status")
          .eq("user_id", session.user.id)
          .maybeSingle();

        if (error) throw error;

        if (!cancelled) {
          const validPlan =
            data?.status === "active" &&
            ["Free", "Pro", "Business"].includes(data.plan);

          setCurrentPlan(validPlan ? data.plan : "Free");
        }
      } catch (error) {
        console.error("LOAD SUBSCRIPTION ERROR:", error);
      } finally {
        if (!cancelled) setLoadingPlan(false);
      }
    };

    loadPlan();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      loadPlan();
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "/month",
      description: "For getting started with CryvixAI",
      features: [
        "10 AI requests/day",
        "AI Chat",
        "AI Writer",
        "Basic AI tools",
        "History",
      ],
    },
    {
      name: "Pro",
      price: "$9.99",
      period: "/month",
      description: "For creators and professionals",
      features: [
        "Unlimited AI requests",
        "All AI tools",
        "AI Image Generation",
        "Priority processing",
        "Advanced features",
      ],
    },
    {
      name: "Business",
      price: "$19.99",
      period: "/month",
      description: "For businesses and teams",
      features: [
        "Everything in Pro",
        "Higher usage limits",
        "Business tools",
        "Priority support",
        "Team-ready features",
      ],
    },
  ];

  const handlePayment = async (plan) => {
    try {
      if (
        loadingPlan ||
        plan.name === currentPlan ||
        (currentPlan === "Business" &&
          ["Free", "Pro"].includes(plan.name)) ||
        (currentPlan === "Pro" && plan.name === "Free")
      ) {
        return;
      }

      if (!window.Razorpay) {
        alert("Razorpay is still loading. Please try again.");
        return;
      }

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session) {
        alert("Please log in before upgrading your plan.");
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/payment/create-order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ plan: plan.name }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to create payment order."
        );
      }

      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: "CryvixAI",
        description: `${plan.name} Plan`,
        order_id: data.order_id,

        handler: async (paymentResponse) => {
          try {
            const verifyResponse = await fetch(
              `${import.meta.env.VITE_API_URL}/api/payment/verify`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${session.access_token}`,
                },
                body: JSON.stringify({
                  ...paymentResponse,
                  plan: plan.name,
                }),
              }
            );

            const verifyData = await verifyResponse.json();

            if (!verifyResponse.ok || !verifyData.success) {
              alert(
                verifyData.message ||
                  "Payment verification failed."
              );
              return;
            }

            setCurrentPlan(plan.name);
            alert(
              `${plan.name} payment verified successfully!`
            );
          } catch (error) {
            console.error("PAYMENT VERIFY ERROR:", error);
            alert("Payment verification failed. Please contact support if money was charged.");
          }
        },

        modal: {
          ondismiss: () => {
            console.log("Razorpay checkout closed.");
          },
        },

        theme: { color: "#06b6d4" },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", (response) => {
        console.error("RAZORPAY PAYMENT FAILED:", response.error);
        alert(
          response.error?.description ||
            "Payment failed. Please try again."
        );
      });

      razorpay.open();
    } catch (error) {
      console.error("PAYMENT ERROR:", error);
      alert(error.message || "Payment could not be started.");
    }
  };

  const isIncluded = (name) =>
    (currentPlan === "Pro" && name === "Free") ||
    (currentPlan === "Business" &&
      ["Free", "Pro"].includes(name));

  const getButtonLabel = (plan) => {
    if (loadingPlan) return "Checking Plan...";
    if (plan.name === currentPlan) return "Current Plan";
    if (isIncluded(plan.name)) return "Included in Your Plan";
    return `Upgrade to ${plan.name}`;
  };

  return (
    <div className="flex min-h-screen bg-surface text-white">
      <Sidebar />

      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-cyan-400">
              Choose Your Plan
            </h1>
            <p className="mt-3 text-gray-400">
              Choose the CryvixAI plan that fits your needs.
            </p>
            <p className="mt-2 text-cyan-300">
              {loadingPlan
                ? "Loading your subscription..."
                : `Your current plan: ${currentPlan}`}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => {
              const current = plan.name === currentPlan;
              const included = isIncluded(plan.name);
              const disabled =
                loadingPlan || current || included;

              return (
                <div
                  key={plan.name}
                  className={`rounded-2xl p-6 border ${
                    plan.name === "Pro"
                      ? "border-cyan-400 shadow-lg shadow-cyan-500/20"
                      : current
                      ? "border-green-500"
                      : "border-zinc-800"
                  } bg-zinc-900`}
                >
                  {plan.name === "Pro" && (
                    <div className="mb-4 text-center">
                      <span className="px-3 py-1 rounded-full bg-cyan-500 text-white text-xs font-semibold">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <h2 className="text-2xl font-bold">{plan.name}</h2>

                  <p className="mt-2 text-sm text-gray-400">
                    {plan.description}
                  </p>

                  <div className="mt-6">
                    <span className="text-4xl font-bold">
                      {plan.price}
                    </span>
                    <span className="text-gray-400">
                      {plan.period}
                    </span>
                  </div>

                  <div className="mt-6 space-y-3">
                    {plan.features.map((feature) => (
                      <p key={feature} className="text-gray-300">
                        ✓ {feature}
                      </p>
                    ))}
                  </div>

                  <button
                    disabled={disabled}
                    onClick={() => handlePayment(plan)}
                    className={`w-full mt-8 px-5 py-3 rounded-xl font-semibold transition ${
                      disabled
                        ? "bg-zinc-800 text-gray-500 cursor-not-allowed"
                        : "bg-cyan-500 hover:bg-cyan-400 text-white"
                    }`}
                  >
                    {getButtonLabel(plan)}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}