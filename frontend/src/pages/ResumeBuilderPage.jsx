import Sidebar from "../components/Sidebar";
import { useState } from "react";
import jsPDF from "jspdf";
import { generateResume } from "../lib/api";

export default function ResumeBuilderPage() {
  const [name, setName] = useState("");
  const [jobRole, setJobRole] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [skills, setSkills] = useState("");
  const [experience, setExperience] = useState("");
  const [education, setEducation] = useState("");

  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  // =====================================================
  // GENERATE RESUME
  // =====================================================

  const handleGenerate = async () => {
    if (!name || !jobRole) {
      setResult("Please enter Full Name and Job Role.");
      return;
    }

    setLoading(true);

    const prompt = `
Create a professional ATS-friendly resume using ONLY the information provided below.

PERSONAL INFORMATION
Name: ${name}
Job Role: ${jobRole}
Email: ${email}
Phone: ${phone}
LinkedIn: ${linkedin}

SKILLS
${skills}

EXPERIENCE
${experience}

EDUCATION
${education}

IMPORTANT RULES:

1. Do NOT invent companies, dates, salaries, achievements, certifications, percentages or qualifications.
2. Do NOT add fake information.
3. Improve grammar and professional wording only.
4. Keep the resume concise and professional.
5. Use these sections when information is available:

SUMMARY
SKILLS
PROFESSIONAL EXPERIENCE
EDUCATION

6. Use simple plain text.
7. Do NOT use Markdown.
8. Do NOT use #, ##, ###, **, *, or ---.
9. Do NOT write placeholders such as [Phone], [Email] or [LinkedIn].
10. Do not repeat the person's name.
11. Do not repeat the job role.
12. Do not repeat email, phone number or LinkedIn.
13. For experience, use short bullet-style statements beginning with "-".
14. Return ONLY the resume content.
`;

    try {
      const data = await generateResume(prompt);

      let cleanResult = String(data.reply || "")
        .replace(/\*\*/g, "")
        .replace(/###/g, "")
        .replace(/##/g, "")
        .replace(/^#+/gm, "")
        .replace(/---+/g, "")
        .trim();

      setResult(cleanResult);
    } catch (err) {
      console.error(err);
      setResult("❌ Resume generate nahi ho saka.");
    }

    setLoading(false);
  };

  // =====================================================
  // CLEAN TEXT
  // =====================================================

  const cleanLine = (line) => {
    return line
      .replace(/\*\*/g, "")
      .replace(/###/g, "")
      .replace(/^#+\s*/g, "")
      .replace(/^[-•*]\s*/, "")
      .trim();
  };

  // =====================================================
  // PDF DOWNLOAD
  // =====================================================

  const downloadPDF = () => {
    const resumeElement = document.getElementById("resume-preview");

    if (!resumeElement) {
      alert("Resume preview not found");
      return;
    }

    const pdf = new jsPDF("p", "mm", "a4");

    pdf.html(resumeElement, {
      callback: function (doc) {
        const safeName = (name || "Resume")
          .replace(/[^a-z0-9]/gi, "_")
          .replace(/_+/g, "_");

        doc.save(`${safeName}_Resume.pdf`);
      },

      x: 10,
      y: 10,
      width: 190,
      windowWidth: resumeElement.scrollWidth,
      margin: [10, 10, 10, 10],
      autoPaging: "text"
    });
  };

  // =====================================================
  // PREVIEW
  // =====================================================

  const previewLines = result
    ? result
        .split("\n")
        .map(cleanLine)
        .filter(Boolean)
    : [];

  const previewSections = [
    "SUMMARY",
    "PROFILE",
    "OBJECTIVE",
    "SKILLS",
    "KEY SKILLS",
    "CORE SKILLS",
    "PROFESSIONAL EXPERIENCE",
    "WORK EXPERIENCE",
    "EXPERIENCE",
    "EDUCATION",
    "CERTIFICATIONS",
    "PROJECTS",
    "ACHIEVEMENTS",
    "TECHNICAL SKILLS",
    "TECHNICAL PROFICIENCIES",
    "LANGUAGES",
    "INTERESTS"
  ];

  const previewHeading = (line) => {
    const upper = line
      .replace(/[:\-]/g, "")
      .trim()
      .toUpperCase();

    return previewSections.includes(upper);
  };

  return (
    <div className="flex min-h-screen bg-surface text-white">

      <Sidebar />

      <div className="flex-1 p-10">

        <h1 className="text-3xl font-bold mb-6">
          AI Resume Builder
        </h1>

        <div className="bg-gray-900 rounded-xl p-6 space-y-4 max-w-4xl">

          {/* =====================================================
              PERSONAL DETAILS
          ===================================================== */}

          <h2 className="text-lg font-semibold text-blue-400">
            Personal Details
          </h2>

          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 rounded bg-gray-800"
          />

          <input
            type="text"
            placeholder="Job Role"
            value={jobRole}
            onChange={(e) => setJobRole(e.target.value)}
            className="w-full p-3 rounded bg-gray-800"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded bg-gray-800"
          />

          <input
            type="text"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full p-3 rounded bg-gray-800"
          />

          <input
            type="text"
            placeholder="LinkedIn URL"
            value={linkedin}
            onChange={(e) => setLinkedin(e.target.value)}
            className="w-full p-3 rounded bg-gray-800"
          />

          {/* =====================================================
              SKILLS
          ===================================================== */}

          <h2 className="text-lg font-semibold text-blue-400 pt-3">
            Skills
          </h2>

          <textarea
            placeholder="Example: Customer Handling, Communication, Sales, MS Excel"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            rows={3}
            className="w-full p-3 rounded bg-gray-800"
          />

          {/* =====================================================
              EXPERIENCE
          ===================================================== */}

          <h2 className="text-lg font-semibold text-blue-400 pt-3">
            Experience
          </h2>

          <textarea
            placeholder="Write your work experience..."
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            rows={5}
            className="w-full p-3 rounded bg-gray-800"
          />

          {/* =====================================================
              EDUCATION
          ===================================================== */}

          <h2 className="text-lg font-semibold text-blue-400 pt-3">
            Education
          </h2>

          <textarea
            placeholder="Example: 12th Pass, CBSE, 2019"
            value={education}
            onChange={(e) => setEducation(e.target.value)}
            rows={3}
            className="w-full p-3 rounded bg-gray-800"
          />

          {/* =====================================================
              BUTTONS
          ===================================================== */}

          <div className="flex gap-3 pt-3">

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="bg-blue-600 px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Generating..." : "Generate Resume"}
            </button>

            {result && (
              <button
                onClick={downloadPDF}
                className="bg-green-600 px-6 py-3 rounded-lg hover:bg-green-700"
              >
                Download PDF
              </button>
            )}

          </div>

          {/* =====================================================
              RESUME PREVIEW
          ===================================================== */}

          {result && (
            <div className="mt-8">

              <h2 className="text-xl font-bold mb-4">
                Resume Preview
              </h2>

              {/* THIS IS THE ONLY ELEMENT USED FOR PDF */}

              <div
                id="resume-preview"
                className="bg-white text-gray-900 rounded-lg p-8 shadow-xl"
              >

                {/* =================================================
                    RESUME HEADER
                ================================================= */}

                <div className="border-b pb-4 mb-5">

                  <h1 className="text-3xl font-bold">
                    {name}
                  </h1>

                  <p className="text-lg mt-1">
                    {jobRole}
                  </p>

                  <p className="text-sm text-gray-600 mt-2">
                    {[email, phone, linkedin]
                      .filter(Boolean)
                      .join(" | ")}
                  </p>

                </div>

                {/* =================================================
                    RESUME CONTENT
                ================================================= */}

                <div className="space-y-2">

                  {previewLines.map((line, index) => {

                    // Prevent duplicate name
                    if (
                      name &&
                      line.toLowerCase() === name.toLowerCase()
                    ) {
                      return null;
                    }

                    // Prevent duplicate job role
                    if (
                      jobRole &&
                      line.toLowerCase() === jobRole.toLowerCase()
                    ) {
                      return null;
                    }

                    // Prevent duplicate email
                    if (
                      email &&
                      line.toLowerCase() === email.toLowerCase()
                    ) {
                      return null;
                    }

                    // Prevent duplicate phone
                    if (
                      phone &&
                      line.toLowerCase() === phone.toLowerCase()
                    ) {
                      return null;
                    }

                    // Prevent duplicate LinkedIn
                    if (
                      linkedin &&
                      line.toLowerCase() === linkedin.toLowerCase()
                    ) {
                      return null;
                    }

                    // Section heading
                    if (previewHeading(line)) {
                      return (
                        <div
                          key={index}
                          className="pt-2"
                        >
                          <h3 className="font-bold text-lg uppercase border-b border-gray-300 pb-1">
                            {line}
                          </h3>
                        </div>
                      );
                    }

                    return (
                      <p
                        key={index}
                        className="text-sm leading-6"
                      >
                        {line}
                      </p>
                    );
                  })}

                </div>

              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}