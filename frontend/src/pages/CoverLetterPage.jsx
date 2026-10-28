import Sidebar from "../components/Sidebar";
import { useState } from "react";
import { generateCoverLetter } from "../lib/api";
import jsPDF from "jspdf";

export default function CoverLetterPage() {
  const [name, setName] = useState("");
  const [jobRole, setJobRole] = useState("");
  const [company, setCompany] = useState("");
  const [skills, setSkills] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  // -----------------------------------------
  // CLEAN AI TEXT
  // -----------------------------------------
  const cleanText = (text) => {
    if (!text) return "";

    let cleaned = String(text);

    cleaned = cleaned.replace(/\*\*/g, "");
    cleaned = cleaned.replace(/^#+\s*/gm, "");

    cleaned = cleaned.replace(/[\u200B-\u200D\uFEFF]/g, "");

    cleaned = cleaned
      .replace(/[’‘]/g, "'")
      .replace(/[“”]/g, '"')
      .replace(/[–—]/g, "-")
      .replace(/…/g, "...");

    // Normal spaces only
    cleaned = cleaned.replace(/[ \t]+/g, " ");

    // Normal blank lines
    cleaned = cleaned.replace(/\n{3,}/g, "\n\n");

    return cleaned.trim();
  };

  // -----------------------------------------
  // GENERATE COVER LETTER
  // -----------------------------------------
  const handleGenerate = async () => {
    if (!name.trim() || !jobRole.trim() || !company.trim()) {
      alert("Please enter your Name, Job Role and Company Name.");
      return;
    }

    setLoading(true);

    const prompt = `
Create a professional one-page cover letter.

Candidate Name: ${name}
Job Role: ${jobRole}
Company: ${company}
Skills / Experience: ${skills || "No additional information provided."}

IMPORTANT RULES:
- Use ONLY the information provided above.
- Do NOT invent companies.
- Do NOT invent achievements.
- Do NOT invent percentages.
- Do NOT invent revenue.
- Do NOT invent account numbers.
- Do NOT invent awards.
- Do NOT invent clients.
- Do NOT invent job history.
- Do NOT invent years of experience.
- Do NOT use markdown.
- Do NOT use ** symbols.
- Do NOT put spaces between individual letters.
- Do NOT include Subject.
- Do NOT include Dear Hiring Manager.
- Do NOT include Sincerely.
- Return ONLY the main cover letter paragraphs.
- Keep the writing natural, professional and concise.
- Keep it suitable for a one-page PDF.
`;

    try {
      const data = await generateCoverLetter(prompt);

      const cleaned = cleanText(data.reply);

      setResult(cleaned);
    } catch (error) {
      console.error(error);
      alert(error.message || "Failed to generate cover letter.");
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------------------
  // BODY TEXT
  // -----------------------------------------
  const getBodyText = () => {
    let body = cleanText(result);

    body = body
      .replace(/^Subject:.*$/gim, "")
      .replace(/^Dear Hiring Manager,?\s*$/gim, "")
      .replace(/^To Whom It May Concern,?\s*$/gim, "")
      .replace(/^Sincerely,?\s*$/gim, "");

    if (name.trim()) {
      const escapedName = name.trim().replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      );

      body = body.replace(
        new RegExp(`^${escapedName}\\s*$`, "gim"),
        ""
      );
    }

    return body
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  };

  // -----------------------------------------
  // PDF TEXT CLEANER
  // -----------------------------------------
  const safePDFText = (text) => {
    if (!text) return "";

    let cleaned = String(text);

    cleaned = cleaned.replace(/\*\*/g, "");
    cleaned = cleaned.replace(/^#+\s*/gm, "");

    cleaned = cleaned.replace(/[\u200B-\u200D\uFEFF]/g, "");

    cleaned = cleaned
      .replace(/[’‘]/g, "'")
      .replace(/[“”]/g, '"')
      .replace(/[–—]/g, "-")
      .replace(/…/g, "...");

    // IMPORTANT:
    // Do NOT modify individual letters here.
    // This prevents PDF character spacing problems.

    cleaned = cleaned.replace(/[ \t]+/g, " ");
    cleaned = cleaned.replace(/\n{3,}/g, "\n\n");

    return cleaned.trim();
  };

  // -----------------------------------------
  // DOWNLOAD PDF
  // -----------------------------------------
  const downloadPDF = () => {
    if (!result) return;

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      putOnlyUsedFonts: true,
      compress: true,
    });

    const pageWidth = 210;
    const pageHeight = 297;

    const marginLeft = 20;
    const marginRight = 20;
    const marginTop = 20;
    const marginBottom = 20;

    const contentWidth =
      pageWidth - marginLeft - marginRight;

    let y = marginTop;

    // -----------------------------------------
    // HEADER
    // -----------------------------------------

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(22);
    pdf.setTextColor(30, 30, 30);

    pdf.text(
      safePDFText(name || "Your Name"),
      marginLeft,
      y
    );

    y += 8;

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(11);
    pdf.setTextColor(80, 80, 80);

    pdf.text(
      safePDFText(jobRole || "Job Applicant"),
      marginLeft,
      y
    );

    y += 7;

    pdf.setDrawColor(190, 190, 190);
    pdf.setLineWidth(0.4);

    pdf.line(
      marginLeft,
      y,
      pageWidth - marginRight,
      y
    );

    y += 12;

    // -----------------------------------------
    // DATE
    // -----------------------------------------

    const date = new Date().toLocaleDateString(
      "en-US",
      {
        month: "long",
        day: "numeric",
        year: "numeric",
      }
    );

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10.5);
    pdf.setTextColor(60, 60, 60);

    pdf.text(date, marginLeft, y);

    y += 12;

    // -----------------------------------------
    // COMPANY
    // -----------------------------------------

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(11);
    pdf.setTextColor(40, 40, 40);

    pdf.text(
      "Hiring Manager",
      marginLeft,
      y
    );

    y += 6;

    pdf.setFont("helvetica", "normal");

    pdf.text(
      safePDFText(company || "Company"),
      marginLeft,
      y
    );

    y += 13;

    // -----------------------------------------
    // SUBJECT
    // -----------------------------------------

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(11);

    const subject =
      `Subject: Application for ${jobRole || "Position"}`;

    pdf.text(
      safePDFText(subject),
      marginLeft,
      y
    );

    y += 13;

    // -----------------------------------------
    // GREETING
    // -----------------------------------------

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(11);
    pdf.setTextColor(45, 45, 45);

    pdf.text(
      "Dear Hiring Manager,",
      marginLeft,
      y
    );

    y += 11;

    // -----------------------------------------
    // BODY
    // -----------------------------------------

    const body = getBodyText();

    const paragraphs = body
      .split(/\n\s*\n/)
      .map((paragraph) => safePDFText(paragraph))
      .filter(Boolean);

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10.5);
    pdf.setTextColor(45, 45, 45);

    const lineHeight = 5.5;

    paragraphs.forEach((paragraph, index) => {
      // IMPORTANT:
      // Clean BEFORE splitTextToSize.
      const cleanParagraph =
        safePDFText(paragraph);

      const lines = pdf.splitTextToSize(
        cleanParagraph,
        contentWidth
      );

      lines.forEach((line) => {
        if (y > pageHeight - marginBottom - 20) {
          pdf.addPage();
          y = marginTop;
        }

        // IMPORTANT:
        // Explicitly force normal character spacing.
        pdf.text(
          safePDFText(line),
          marginLeft,
          y,
          {
            charSpace: 0,
          }
        );

        y += lineHeight;
      });

      if (index < paragraphs.length - 1) {
        y += 4;
      }
    });

    // -----------------------------------------
    // SIGNATURE
    // -----------------------------------------

    if (y > pageHeight - marginBottom - 20) {
      pdf.addPage();
      y = marginTop;
    }

    y += 7;

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10.5);
    pdf.setTextColor(45, 45, 45);

    pdf.text(
      "Sincerely,",
      marginLeft,
      y,
      {
        charSpace: 0,
      }
    );

    y += 7;

    pdf.setFont("helvetica", "bold");

    pdf.text(
      safePDFText(name || "Your Name"),
      marginLeft,
      y,
      {
        charSpace: 0,
      }
    );

    // -----------------------------------------
    // SAVE PDF
    // -----------------------------------------

    const safeName = (name || "CoverLetter")
      .replace(/[^a-z0-9]/gi, "_")
      .replace(/_+/g, "_");

    pdf.save(
      `${safeName}_Cover_Letter_Final.pdf`
    );
  };

  // -----------------------------------------
  // UI
  // -----------------------------------------

  return (
    <div className="flex min-h-screen bg-surface text-white">
      <Sidebar />

      <div className="flex-1 p-10">

        <h1 className="text-3xl font-bold mb-6">
          AI Cover Letter Generator
        </h1>

        <div className="bg-gray-900 rounded-xl p-6 max-w-3xl space-y-4">

          {/* NAME */}
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            className="w-full p-3 rounded bg-gray-800"
          />

          {/* JOB ROLE */}
          <input
            type="text"
            placeholder="Job Role"
            value={jobRole}
            onChange={(e) =>
              setJobRole(e.target.value)
            }
            className="w-full p-3 rounded bg-gray-800"
          />

          {/* COMPANY */}
          <input
            type="text"
            placeholder="Company Name"
            value={company}
            onChange={(e) =>
              setCompany(e.target.value)
            }
            className="w-full p-3 rounded bg-gray-800"
          />

          {/* SKILLS */}
          <textarea
            placeholder="Your Skills / Experience"
            value={skills}
            onChange={(e) =>
              setSkills(e.target.value)
            }
            className="w-full p-3 rounded bg-gray-800 h-32"
          />

          {/* GENERATE */}
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="bg-blue-600 px-6 py-3 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading
              ? "Generating..."
              : "Generate Cover Letter"}
          </button>

          {/* DOWNLOAD */}
          {result && (
            <button
              onClick={downloadPDF}
              className="ml-3 bg-green-600 px-6 py-3 rounded hover:bg-green-700"
            >
              Download PDF
            </button>
          )}

          {/* PREVIEW */}
          {result && (
            <div className="mt-8">

              <h2 className="text-xl font-bold mb-4">
                Cover Letter Preview
              </h2>

              <div className="bg-white text-gray-800 rounded-xl shadow-2xl p-10 max-w-3xl mx-auto">

                {/* HEADER */}
                <div className="border-b border-gray-300 pb-4 mb-6">

                  <h2 className="text-3xl font-bold">
                    {name}
                  </h2>

                  <p className="text-gray-500 mt-1">
                    {jobRole}
                  </p>

                </div>

                {/* DATE */}
                <p className="text-sm text-gray-600 mb-6">
                  {new Date().toLocaleDateString(
                    "en-US",
                    {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    }
                  )}
                </p>

                {/* COMPANY */}
                <p className="font-semibold">
                  Hiring Manager
                </p>

                <p className="text-gray-600 mb-6">
                  {company}
                </p>

                {/* SUBJECT */}
                <p className="font-semibold mb-6">
                  Subject: Application for{" "}
                  {jobRole} Position
                </p>

                {/* GREETING */}
                <p className="mb-5">
                  Dear Hiring Manager,
                </p>

                {/* BODY */}
                <div className="space-y-5 leading-7 text-gray-700">

                  {getBodyText()
                    .split(/\n\s*\n/)
                    .filter(Boolean)
                    .map((paragraph, index) => (
                      <p key={index}>
                        {paragraph.trim()}
                      </p>
                    ))}

                </div>

                {/* SIGNATURE */}
                <div className="mt-8">

                  <p>
                    Sincerely,
                  </p>

                  <p className="font-semibold mt-2">
                    {name}
                  </p>

                </div>

              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}