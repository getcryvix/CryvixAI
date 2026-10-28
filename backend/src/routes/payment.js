import express from "express";
import crypto from "crypto";
import Razorpay from "razorpay";
import { supabaseAdmin } from "../services/supabase.js";

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Verify payment and save the subscription
router.post("/verify", async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      plan,
      user_id,
    } = req.body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !user_id ||
      !["Pro", "Business"].includes(plan)
    ) {
      return res.status(400).json({
        success: false,
        message: "Required payment details are missing.",
      });
    }

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const expected = Buffer.from(expectedSignature);
    const received = Buffer.from(razorpay_signature);

    if (
      expected.length !== received.length ||
      !crypto.timingSafeEqual(expected, received)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature.",
      });
    }

    // Confirm the payment with Razorpay before granting a plan.
    const payment = await razorpay.payments.fetch(
      razorpay_payment_id
    );

    if (
      payment.order_id !== razorpay_order_id ||
      payment.status !== "captured"
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment is not confirmed as captured.",
      });
    }

    const { data: userData, error: userError } =
      await supabaseAdmin.auth.admin.getUserById(user_id);

    if (userError || !userData?.user) {
      return res.status(400).json({
        success: false,
        message: "Unable to verify the account.",
      });
    }

    const { error: saveError } = await supabaseAdmin
      .from("user_subscriptions")
      .upsert(
        {
          user_id,
          plan,
          status: "active",
          razorpay_payment_id,
        },
        { onConflict: "user_id" }
      );

    if (saveError) {
      console.error("SUBSCRIPTION SAVE ERROR:", saveError);
      return res.status(500).json({
        success: false,
        message: "Payment verified, but subscription could not be saved.",
      });
    }

    return res.json({
      success: true,
      message: `${plan} payment verified and subscription saved.`,
      plan,
      payment_id: razorpay_payment_id,
    });
  } catch (error) {
    console.error("PAYMENT VERIFY ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Payment verification failed.",
    });
  }
});

export default router;