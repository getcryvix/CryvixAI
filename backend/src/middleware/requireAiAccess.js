import { supabaseAdmin } from "../services/supabase.js";

export const FREE_DAILY_AI_LIMIT = 5;
const AI_USAGE_TIMEZONE = "Asia/Kolkata";

export async function requireAiAccess(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        code: "AUTH_REQUIRED",
        message: "Please log in to use CryvixAI tools.",
      });
    }

    const token = authHeader.slice(7);

    const { data: authData, error: authError } =
      await supabaseAdmin.auth.getUser(token);

    if (authError || !authData?.user) {
      console.error("SUPABASE TOKEN VERIFY ERROR:", authError?.message);
      return res.status(401).json({
        success: false,
        code: "AUTH_REQUIRED",
        message: "Your session is invalid or expired. Please log in again.",
      });
    }

    const userId = authData.user.id;

    const { data: subscription, error: subscriptionError } =
      await supabaseAdmin
        .from("user_subscriptions")
        .select("plan, status")
        .eq("user_id", userId)
        .maybeSingle();

    if (subscriptionError) {
      console.error("SUBSCRIPTION CHECK ERROR:", subscriptionError);

      return res.status(503).json({
        success: false,
        message: "Unable to verify your plan. Please try again.",
      });
    }

    const normalizedPlan = String(subscription?.plan || "")
      .trim()
      .toLowerCase();

    const normalizedStatus = String(subscription?.status || "")
      .trim()
      .toLowerCase();

    const isPaid =
      normalizedStatus === "active" &&
      ["pro", "business"].includes(normalizedPlan);

    const dateParts = new Intl.DateTimeFormat("en-GB", {
      timeZone: AI_USAGE_TIMEZONE,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(new Date());

    const dateValues = Object.fromEntries(
      dateParts.map((part) => [part.type, part.value])
    );

    const usageDate =
      `${dateValues.year}-${dateValues.month}-${dateValues.day}`;

    const { data: usageResult, error: usageError } =
      await supabaseAdmin.rpc("consume_ai_request", {
        p_user_id: userId,
        p_usage_date: usageDate,
        p_daily_limit: isPaid ? null : FREE_DAILY_AI_LIMIT,
      });

    if (usageError) {
      console.error("AI USAGE CHECK ERROR:", usageError);

      return res.status(503).json({
        success: false,
        message: "Unable to check AI usage. Please try again.",
      });
    }

    const usage = Array.isArray(usageResult)
      ? usageResult[0]
      : usageResult;

    if (!usage?.allowed) {
      return res.status(429).json({
        success: false,
        code: "DAILY_LIMIT_REACHED",
        message:
          "You have used all 5 free AI requests for today. Upgrade your plan to continue.",
        request_count: usage?.request_count ?? FREE_DAILY_AI_LIMIT,
        daily_limit: FREE_DAILY_AI_LIMIT,
      });
    }

    req.user = authData.user;
    req.aiPlan = isPaid ? subscription.plan : "Free";
    req.aiUsage = usage;

    next();
  } catch (error) {
    console.error("AI ACCESS MIDDLEWARE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to verify AI access right now.",
    });
  }
}