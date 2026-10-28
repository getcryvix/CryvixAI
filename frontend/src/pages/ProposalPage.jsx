import { useState } from "react";
import jsPDF from "jspdf";
import Sidebar from "../components/Sidebar";

export default function ProposalPage() {
  const [client, setClient] = useState("");
  const [company, setCompany] = useState("");
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [timeline, setTimeline] = useState("");
  const [proposalType, setProposalType] = useState("AI Project");

  const [proposal, setProposal] = useState("");
  const [loading, setLoading] = useState(false);

  const generateProposal = async () => {
    if (
      !client ||
      !company ||
      !projectTitle ||
      !projectDescription
    ) {
      alert("Please fill all required fields.");
      return;
    }

    setLoading(true);

    try {
      const prompt = `
Create a professional business proposal.

Client Name:
${client}

Company:
${company}

Proposal Type:
${proposalType}

Project Title:
${projectTitle}

Project Description:
${projectDescription}

Budget:
${budget}

Timeline:
${timeline}

Generate a proposal with:

1. Executive Summary
2. Project Scope
3. Deliverables
4. Timeline
5. Budget
6. Why Choose Us
7. Closing Statement

Use professional English.
`;

      const res = await fetch("http://localhost:3001/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: prompt,
          messages: [],
        }),
      });

      const data = await res.json();

      setProposal(data.reply || "No proposal generated.");
    } catch (err) {
      setProposal("Server Error");
    }

    setLoading(false);
  };

  const downloadPDF = () => {
  if (!proposal) return;

  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("CryvixAI Proposal", 20, 20);

  doc.setFontSize(12);

  const lines = doc.splitTextToSize(proposal, 170);

  doc.text(lines, 20, 35);

  doc.save("Proposal.pdf");
};

  return (
    <div className="flex min-h-screen bg-surface text-white">
      <Sidebar />

      <div className="flex-1 p-8 max-w-5xl">

        <h1 className="text-4xl font-bold mb-6">
          📄 Proposal Generator
        </h1>

        <div className="grid md:grid-cols-2 gap-4">

          <input
            className="w-full p-3 rounded-xl text-black"
            placeholder="Client Name"
            value={client}
            onChange={(e) => setClient(e.target.value)}
          />

          <input
            className="w-full p-3 rounded-xl text-black"
            placeholder="Company Name"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />

          <input
            className="w-full p-3 rounded-xl text-black"
            placeholder="Project Title"
            value={projectTitle}
            onChange={(e) => setProjectTitle(e.target.value)}
          />

          <input
            className="w-full p-3 rounded-xl text-black"
            placeholder="Budget"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
          />

          <input
            className="w-full p-3 rounded-xl text-black"
            placeholder="Timeline"
            value={timeline}
            onChange={(e) => setTimeline(e.target.value)}
          />

          <select
            className="w-full p-3 rounded-xl text-black"
            value={proposalType}
            onChange={(e) => setProposalType(e.target.value)}
          >
            <option>AI Project</option>
            <option>Website</option>
            <option>Mobile App</option>
            <option>Marketing</option>
            <option>Business</option>
          </select>

        </div>

        <textarea
          className="w-full h-48 p-4 rounded-xl text-black mt-4"
          placeholder="Project Description..."
          value={projectDescription}
          onChange={(e) => setProjectDescription(e.target.value)}
        />

        <div className="flex gap-3 mt-4">

          <button
            onClick={generateProposal}
            className="bg-cyan-500 hover:bg-cyan-600 px-6 py-3 rounded-xl"
          >
            {loading ? "Generating..." : "Generate Proposal"}
          </button>

          <button
            onClick={() => {
              setClient("");
              setCompany("");
              setProjectTitle("");
              setProjectDescription("");
              setBudget("");
              setTimeline("");
              setProposal("");
            }}
            className="bg-gray-600 hover:bg-gray-700 px-6 py-3 rounded-xl"
          >
            Clear
          </button>

        </div>

        {proposal && (

          <div className="mt-8">

            <button
              onClick={() => navigator.clipboard.writeText(proposal)}
              className="bg-green-600 hover:bg-green-700 px-5 py-2 rounded-lg mb-4"
            >
              📋 Copy Proposal
            </button>

<button
  onClick={downloadPDF}
  className="ml-3 bg-red-600 hover:bg-red-700 px-5 py-2 rounded-lg mb-4"
>
  📄 Download PDF
</button>
            <div className="bg-zinc-900 rounded-xl p-5 whitespace-pre-wrap">
              {proposal}
            </div>

          </div>

        )}

      </div>

    </div>
  );
}