import { useState } from "react";
import jsPDF from "jspdf";
import Sidebar from "../components/Sidebar";

export default function InvoicePage() {

  const [client, setClient] = useState("");
  const [company, setCompany] = useState("");
  const [service, setService] = useState("");
  const [amount, setAmount] = useState("");
  const [invoiceNo, setInvoiceNo] = useState(
    "INV-" + Math.floor(Math.random() * 100000)
  );

  const downloadInvoice = () => {

    const doc = new jsPDF();

    doc.setFontSize(22);
    doc.text("CryvixAI Invoice", 20, 20);

    doc.setFontSize(12);

    doc.text(`Invoice No : ${invoiceNo}`,20,40);
    doc.text(`Client : ${client}`,20,50);
    doc.text(`Company : ${company}`,20,60);
    doc.text(`Service : ${service}`,20,70);
    doc.text(`Amount : ₹${amount}`,20,80);

    doc.text("Status : Unpaid",20,90);

    doc.save(`${invoiceNo}.pdf`);
  };

  return (
    <div className="flex min-h-screen bg-surface text-white">
      <Sidebar />

      <div className="flex-1 p-8 max-w-4xl">

        <h1 className="text-4xl font-bold mb-6">
          🧾 Invoice Generator
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
            placeholder="Service"
            value={service}
            onChange={(e) => setService(e.target.value)}
          />

          <input
            className="w-full p-3 rounded-xl text-black"
            placeholder="Amount (₹)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

        </div>

        <div className="flex gap-3 mt-6">

          <button
            onClick={downloadInvoice}
            className="bg-cyan-500 hover:bg-cyan-600 px-6 py-3 rounded-xl"
          >
            📄 Download PDF
          </button>

          <button
            onClick={()=>{
              setClient("");
              setCompany("");
              setService("");
              setAmount("");
              setInvoiceNo("INV-"+Math.floor(Math.random()*100000));
            }}
            className="bg-gray-600 hover:bg-gray-700 px-6 py-3 rounded-xl"
          >
            Clear
          </button>

        </div>

      </div>

    </div>
  );
}