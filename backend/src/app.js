import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import Razorpay from "razorpay";
import crypto from "crypto";
import { supabaseAdmin } from "./services/supabase.js";
import { askGroq } from "./services/groq.js";
import {
  generateImage,
  generateReferenceImage
} from "./services/openrouter.js";

import imageAnalyzerRouter from "./routes/imageAnalyzer.js";
import youtubeToolkitRouter from "./routes/youtubeToolkit.js";
import googleAuthRouter from "./routes/googleAuth.js";
import grammarRewriterRouter from "./routes/grammarRewriter.js";
import pdfChatRouter from "./routes/pdfChat.js";
import translatorRouter from "./routes/translator.js";
import documentSummaryRouter from "./routes/documentSummary.js";
import presentationRouter from "./routes/presentation.js";
import presentationDownloadRouter from "./routes/presentationDownload.js";
import websiteBuilderRouter from "./routes/websiteBuilder.js";
import websiteEditorRouter from "./routes/websiteEditor.js";
import downloadWebsiteZipRoutes from "./routes/downloadWebsiteZip.js";
import exportReactProjectRoutes from "./routes/exportReactProject.js";
import exportReactProjectV2Routes from "./routes/exportReactProjectV2.js";
import publishWebsiteRouter from "./routes/publishWebsite.js";
import ocrRouter from "./routes/ocr.js";
import { requireAiAccess, FREE_DAILY_AI_LIMIT } from "./middleware/requireAiAccess.js";
// AI USAGE LIMIT SETTINGS

const app = express();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json({ limit: "20mb" }));

// =====================================================
 // RAZORPAY CREATE ORDER
 // =====================================================

app.post("/api/payment/create-order", async (req, res) => {
  try {
    const { plan } = req.body;

    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Please log in first.",
      });
    }

    const token = authHeader.slice(7);
    const { data: authData, error: authError } =
      await supabaseAdmin.auth.getUser(token);

    if (authError || !authData?.user) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired login session.",
      });
    }

    const userId = authData.user.id;

    const plans = {
      Pro: 999,
      Business: 1999,
    };

    if (!Object.hasOwn(plans, plan)) {
      return res.status(400).json({
        success: false,
        message: "Invalid plan.",
      });
    }

    if (
      !process.env.RAZORPAY_KEY_ID ||
      !process.env.RAZORPAY_KEY_SECRET
    ) {
      return res.status(500).json({
        success: false,
        message: "Payment configuration is missing.",
      });
    }

    const order = await razorpay.orders.create({
      amount: plans[plan],
      currency: "USD",
      receipt: `cryvix_${Date.now()}`,
      notes: {
        user_id: userId,
        plan,
      },
    });

    return res.json({
      success: true,
      key: process.env.RAZORPAY_KEY_ID,
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error("RAZORPAY CREATE ORDER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to create payment order.",
    });
  }
});


// =====================================================
// RAZORPAY PAYMENT VERIFY AND SAVE SUBSCRIPTION
// =====================================================

app.post("/api/payment/verify", async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      plan,
    } = req.body;

    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Please log in first.",
      });
    }

    const token = authHeader.slice(7);
    const { data: authData, error: authError } =
      await supabaseAdmin.auth.getUser(token);

    if (authError || !authData?.user) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired login session.",
      });
    }

    const userId = authData.user.id;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !["Pro", "Business"].includes(plan)
    ) {
      return res.status(400).json({
        success: false,
        message: "Required payment details are missing.",
      });
    }

    // Fetch the order from Razorpay.
    const order = await razorpay.orders.fetch(
      razorpay_order_id
    );

    // Confirm that the order belongs to this user and plan.
    if (
      order.notes?.user_id !== userId ||
      order.notes?.plan !== plan
    ) {
      return res.status(403).json({
        success: false,
        message: "Order does not match this account or plan.",
      });
    }

    const expectedAmounts = {
      Pro: 999,
      Business: 1999,
    };

    if (
      order.amount !== expectedAmounts[plan] ||
      order.currency !== "USD"
    ) {
      return res.status(400).json({
        success: false,
        message: "Order amount or currency is invalid.",
      });
    }

    // Verify the Razorpay signature safely.
    const expectedSignature = crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET
      )
      .update(
        `${razorpay_order_id}|${razorpay_payment_id}`
      )
      .digest("hex");

    const expectedBuffer = Buffer.from(
      expectedSignature,
      "hex"
    );
    const receivedBuffer = Buffer.from(
      razorpay_signature,
      "hex"
    );

    if (
      expectedBuffer.length !== receivedBuffer.length ||
      !crypto.timingSafeEqual(
        expectedBuffer,
        receivedBuffer
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature.",
      });
    }

    // Fetch payment directly from Razorpay.
    const payment = await razorpay.payments.fetch(
      razorpay_payment_id
    );

    if (
      payment.order_id !== razorpay_order_id ||
      payment.status !== "captured" ||
      payment.amount !== order.amount ||
      payment.currency !== order.currency
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment is not confirmed or details do not match.",
      });
    }

    // Save the verified subscription.
    const { error: saveError } = await supabaseAdmin
      .from("user_subscriptions")
      .upsert(
        {
          user_id: userId,
          plan,
          status: "active",
          razorpay_payment_id,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "user_id",
        }
      );

    if (saveError) {
      console.error(
        "SUBSCRIPTION SAVE ERROR:",
        saveError
      );

      return res.status(500).json({
        success: false,
        message: "Payment verified, but subscription could not be saved.",
      });
    }

    return res.json({
      success: true,
      message: `${plan} payment verified and subscription saved.`,
      payment_id: razorpay_payment_id,
      plan,
    });
  } catch (error) {
    console.error("RAZORPAY VERIFY ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Payment verification failed.",
    });
  }
});

// =====================================================
// EXISTING ROUTES
// =====================================================

app.use(
  "/api/image-analyzer",
  imageAnalyzerRouter
);

app.use(
  "/api/youtube-toolkit",
  youtubeToolkitRouter
);

app.use(
  "/api/google-auth",
  googleAuthRouter
);

app.use(
  "/api/grammar-rewriter",
  grammarRewriterRouter
);

app.use(
  "/api/pdf-chat",
  pdfChatRouter
);

app.use(
  "/api/translator",
  translatorRouter
);

app.use(
  "/api/document-summary",
  documentSummaryRouter
);

app.use(
  "/api/ocr",
  ocrRouter
);

app.use(
  "/api/presentation",
  presentationRouter
);

app.use(
  "/api/presentation/download",
  presentationDownloadRouter
);

app.use(
  "/api/website-builder",
  websiteBuilderRouter
);

app.use(
  "/api/website-editor",
  websiteEditorRouter
);

app.use(
  "/api/website-builder/download-zip",
  downloadWebsiteZipRoutes
);

app.use(
  "/api/website-builder/export-react",
  exportReactProjectRoutes
);

app.use(
  "/api/website-builder/export-react-v2",
  exportReactProjectV2Routes
);

app.use(
  "/api/publish-website",
  publishWebsiteRouter
);

// =====================================================
// HEALTH CHECK
// =====================================================

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "CryvixAI API",
  });
});

// =====================================================
// GET CURRENT USER AI USAGE
// =====================================================

app.get("/api/ai-usage", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Please log in first.",
      });
    }

    const token = authHeader.slice(7);

    const { data: authData, error: authError } =
      await supabaseAdmin.auth.getUser(token);

    if (authError || !authData?.user) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired login session.",
      });
    }

    const userId = authData.user.id;

    const { data: subscription, error: planError } =
      await supabaseAdmin
        .from("user_subscriptions")
        .select("plan, status")
        .eq("user_id", userId)
        .maybeSingle();

    if (planError) {
      return res.status(503).json({
        success: false,
        message: "Unable to verify your plan.",
      });
    }

    const plan = String(subscription?.plan || "Free")
      .trim()
      .toLowerCase();

    const status = String(subscription?.status || "")
      .trim()
      .toLowerCase();

    const isPaid =
      status === "active" &&
      ["pro", "business"].includes(plan);

    const dateParts = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(new Date());

    const dateValues = Object.fromEntries(
      dateParts.map((part) => [part.type, part.value])
    );

    const usageDate =
      `${dateValues.year}-${dateValues.month}-${dateValues.day}`;

    const { data: usage, error: usageError } =
      await supabaseAdmin
        .from("ai_usage_daily")
        .select("request_count")
        .eq("user_id", userId)
        .eq("usage_date", usageDate)
        .maybeSingle();

    if (usageError) {
      console.error("AI USAGE FETCH ERROR:", usageError);

      return res.status(503).json({
        success: false,
        message: "Unable to load AI usage.",
      });
    }

    const used = usage?.request_count ?? 0;

    return res.json({
      success: true,
      plan: isPaid
        ? subscription.plan
        : "Free",
      usage: {
        request_count: used,
        daily_limit: isPaid ? null : FREE_DAILY_AI_LIMIT,
        remaining: isPaid
          ? null
          : Math.max(0, FREE_DAILY_AI_LIMIT - used),
      },
    });
  } catch (error) {
    console.error("AI USAGE ROUTE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load AI usage.",
    });
  }
});

// =====================================================
// AI CHAT
// =====================================================

app.post("/api/chat", requireAiAccess, async (req, res) => {
  try {
    const {
      message,
      messages = [],
    } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        error: "Message is required",
      });
    }

    const reply = await askGroq(message, messages);

    return res.json({
      success: true,
      reply,
      plan: req.aiPlan,
      usage: {
        request_count: req.aiUsage?.request_count ?? 0,
        daily_limit:
          ["pro", "business"].includes(
            String(req.aiPlan).trim().toLowerCase()
          )
            ? null
            : FREE_DAILY_AI_LIMIT,
      },
    });
  } catch (error) {
    console.error("AI CHAT ERROR:", error);

    return res.status(500).json({
      success: false,
      error: error.message || "AI response failed",
    });
  }
});

// =====================================================
// AI IMAGE
// =====================================================

app.post("/api/image", requireAiAccess, async (req, res) => {
  try {
    const {
      prompt,
      size,
      referenceImage,
    } = req.body;

    if (!prompt) {
      return res.status(400).json({
        error: "Prompt is required",
      });
    }

    const result = referenceImage
  ? await generateReferenceImage(
      prompt,
      referenceImage
    )
  : await generateImage(
      prompt,
      size,
      null
    );

    res.json(result);
  } catch (error) {
    console.error(
      "IMAGE ROUTE ERROR:",
      error
    );

    res.status(500).json({
      error:
        error.response?.data ||
        error.message ||
        "Image generation failed",
    });
  }
});

// =====================================================
// AI CODE
// =====================================================

app.post("/api/ai/code", requireAiAccess, async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({
        error: "Prompt is required",
      });
    }

    const result = await askGroq(prompt);

    res.json({
      result,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: error.message,
    });
  }
});

// =====================================================
// PROMPT GENERATOR
// =====================================================

app.post("/api/prompt-generator", requireAiAccess, async (req, res) => {
  try {
    const { request } = req.body;

    if (!request || !request.trim()) {
      return res.status(400).json({
        success: false,
        message: "Prompt request is required",
      });
    }

    const aiPrompt = `
You are an expert AI prompt engineer.

The user wants to create an AI prompt for this task:

${request.trim()}

Create a high-quality, detailed, professional prompt that the user can copy and use directly with an AI tool.

The prompt should:
- Clearly define the AI's role.
- Clearly explain the user's objective.
- Include useful context.
- Include specific instructions.
- Specify the desired output format when appropriate.
- Be practical and easy to use.
- Improve the user's original request without changing its main purpose.

Return ONLY the final prompt.
Do not explain the prompt.
Do not add headings such as "Here is your prompt".
Do not use Markdown code fences.
`;

    const result = await askGroq(aiPrompt);

    const generatedPrompt = String(
      result || ""
    ).trim();

    if (!generatedPrompt) {
      return res.status(500).json({
        success: false,
        message: "AI did not generate a prompt",
      });
    }

    return res.json({
      success: true,
      prompt: generatedPrompt,
    });
  } catch (error) {
    console.error(
      "PROMPT GENERATOR ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error?.message ||
        "Prompt generation failed",
    });
  }
});

// =====================================================
// EXCEL FORMULA
// =====================================================

app.post("/api/excel-formula", requireAiAccess, async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({
        success: false,
        error: "Excel request is required",
      });
    }

    const aiPrompt = `
You are an expert Microsoft Excel formula assistant.

The user wants this:

${prompt}

Generate the correct Excel formula.

Return ONLY in this exact format:

FORMULA:
<one Excel formula>

EXPLANATION:
<short simple explanation>

Rules:
- Use standard Microsoft Excel formulas.
- Do not use Markdown code fences.
- Do not add any text before FORMULA:
- Do not add any text after the explanation.
`;

    const result = await askGroq(aiPrompt);

    const output = String(
      result || ""
    ).trim();

    const formulaMatch = output.match(
      /FORMULA:\s*([\s\S]*?)(?:\n\s*EXPLANATION:|$)/i
    );

    const explanationMatch = output.match(
      /EXPLANATION:\s*([\s\S]*)$/i
    );

    const formula = formulaMatch
      ? formulaMatch[1].trim()
      : output;

    const explanation = explanationMatch
      ? explanationMatch[1].trim()
      : "Formula generated by CryvixAI.";

    return res.json({
      success: true,
      formula,
      explanation,
    });
  } catch (error) {
    console.error(
      "EXCEL FORMULA ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      error:
        error?.message ||
        "Excel formula generation failed",
    });
  }
});

// =====================================================
// AI SUMMARIZER
// =====================================================

app.post("/api/summarizer", requireAiAccess, async (req, res) => {
  try {
    const {
      text,
      length = "medium",
    } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        error: "Text is required",
      });
    }

    let lengthInstruction;

if (length === "short") {
  lengthInstruction = `
Create a very short summary.

Rules:
- Maximum 2-3 sentences.
- Include only the most important idea and essential facts.
- Remove examples, repetition and minor details.
`;
} else if (length === "detailed") {
  lengthInstruction = `
Create a detailed summary.

Rules:
- Cover the major ideas, important facts, examples and conclusions.
- Use multiple paragraphs or bullet points when useful.
- Keep approximately 40-50% of the useful information from the original.
- Do not unnecessarily repeat the original text.
`;
} else {
  lengthInstruction = `
Create a medium-length summary.

Rules:
- Use approximately 20-30% of the useful information from the original.
- Include the main ideas and important supporting details.
- Use 1-2 clear paragraphs.
- Remove repetition and minor details.
`;
}
    const aiPrompt = `
You are an expert AI text summarizer.

The user has provided the following text:

${text}

Your task is to summarize the text.

${lengthInstruction}

Rules:
- Preserve the original meaning.
- Do not invent facts.
- Do not add information that is not present in the original text.
- Use clear and simple language.
- Remove unnecessary repetition.
- Keep important names, numbers, dates and facts when relevant.
- Do not mention that you are an AI.
- Return ONLY the final summary.
- Do not use Markdown formatting such as **bold**, ## headings, or code blocks.
- Return clean plain text only.
`;

    const result = await askGroq(aiPrompt);

    const summary = String(result || "").trim();

    if (!summary) {
      return res.status(500).json({
        success: false,
        error: "AI returned an empty summary",
      });
    }

    return res.json({
      success: true,
      summary,
    });

  } catch (error) {
    console.error(
      "AI SUMMARIZER ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      error:
        error?.message ||
        "Summary generation failed",
    });
  }
});

export default app;