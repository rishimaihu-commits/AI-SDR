import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Normalize function to improve company matching
function normalize(str: string = "") {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .trim();
}

export default function CampaignLeads() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [people, setPeople] = useState<any[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<any>(null);
  const [employees, setEmployees] = useState<any[]>([]);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [generatedEmails, setGeneratedEmails] = useState<
    Record<string, string>
  >({});
  const [selectAll, setSelectAll] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [customPrompt, setCustomPrompt] = useState<string>(
    "Write a short cold email introducing our product to this person. Keep it professional and friendly. Their name is [NAME] and they work at [COMPANY]."
  );

  useEffect(() => {
    try {
      const peopleData = localStorage.getItem("campaignPeople");
      const contactsData = localStorage.getItem("campaignContacts");

      if (!peopleData || !contactsData) {
        console.warn("⚠️ No campaign found in localStorage");
        return;
      }

      setPeople(JSON.parse(peopleData));
      setCompanies(JSON.parse(contactsData));
    } catch (err) {
      console.error("❌ Failed to load localStorage data", err);
    }
  }, []);

  const fetchEmployees = (company: any) => {
    setSelectedCompany(company);
    setLoading(true);

    try {
      const targetCompany = normalize(company.company);
      const filtered = people.filter(
        (p) => normalize(p.company) === targetCompany
      );

      if (filtered.length === 0) {
        setEmployees([
          {
            company: company.company,
            name: "Not Available",
            email: "Not Available",
            designation: "Not Available",
            linkedin_url: "Not Available",
          },
        ]);
      } else {
        const mapped = filtered.map((p) => ({
          company: p.company || "Not Available",
          name: p.name || "Not Available",
          email: p.email || "Not Available",
          designation: p.designation || "Not Available",
          linkedin_url: p.linkedin_url || "Not Available",
        }));
        setEmployees(mapped);
      }

      setSelectedEmployees([]);
      setGeneratedEmails({});
      setSelectAll(false);
    } catch (err) {
      console.error("❌ Error filtering employees", err);
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleSelect = (email: string) => {
    setSelectedEmployees((prev) =>
      prev.includes(email) ? prev.filter((e) => e !== email) : [...prev, email]
    );
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedEmployees([]);
    } else {
      const allEmails = employees.map((emp) => emp.email).filter(Boolean);
      setSelectedEmployees(allEmails);
    }
    setSelectAll(!selectAll);
  };

  const generateEmail = async (emp: any) => {
    const prompt = customPrompt
      .replace(/\[NAME\]/g, emp.name)
      .replace(/\[COMPANY\]/g, emp.company);

    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer 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`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:8080",
          "X-Title": "AI SDR Campaign",
        },
        body: JSON.stringify({
          model: "mistralai/mistral-7b-instruct",
          messages: [
            { role: "system", content: "You are a B2B email writing expert." },
            { role: "user", content: prompt },
          ],
        }),
      });

      const data = await res.json();
      const content =
        data.choices?.[0]?.message?.content || "⚠️ No content generated.";

      setGeneratedEmails((prev) => ({ ...prev, [emp.email]: content }));
    } catch (err) {
      console.error("❌ Failed to generate email for", emp.email, err);
      setGeneratedEmails((prev) => ({
        ...prev,
        [emp.email]: "❌ Error generating email",
      }));
    }
  };

  const sendEmails = async () => {
    const recipients = employees
      .filter((emp) => selectedEmployees.includes(emp.email))
      .map((emp) => ({
        company: emp.company,
        email: emp.email,
        linkedin_url: emp.linkedin_url,
        message: generatedEmails[emp.email] || "",
      }));

    if (recipients.length === 0) {
      alert("No recipients selected");
      return;
    }

    try {
      setSending(true);
      const response = await fetch(
        "http://localhost:5678/webhook-test/send-emails",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ recipients }),
        }
      );

      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);
      const result = await response.json();
      console.log("📤 Server Response:", result);
      alert("✅ Emails sent successfully!");
    } catch (err) {
      console.error("❌ Failed to send emails", err);
      alert("❌ Failed to send emails.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">
        {!selectedCompany
          ? "Select a Company"
          : `Employees at ${selectedCompany.company}`}
      </h2>

      {!selectedCompany ? (
        companies.length > 0 ? (
          <ul className="space-y-2">
            {companies.map((company, idx) => (
              <li
                key={idx}
                className="border p-3 rounded flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">{company.company}</p>
                  <p className="text-sm text-muted-foreground">
                    Domain: {company.domain || "Not Available"}
                  </p>
                </div>
                <Button onClick={() => fetchEmployees(company)}>
                  View Employees
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No companies found in localStorage.</p>
        )
      ) : loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="mb-4">
            <label className="block mb-1 font-medium">
              Custom Email Prompt
            </label>
            <Input
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Enter prompt here..."
            />
            <p className="text-sm text-muted-foreground mt-1">
              Use [NAME] and [COMPANY] as placeholders.
            </p>
          </div>

          <table className="w-full mt-4 border rounded">
            <thead className="bg-secondary">
              <tr>
                <th className="p-2 text-left">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">Email</th>
                <th className="p-2 text-left">Designation</th>
                <th className="p-2 text-left">LinkedIn</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp, idx) => (
                <tr key={idx} className="border-b align-top">
                  <td className="p-2">
                    <input
                      type="checkbox"
                      checked={selectedEmployees.includes(emp.email)}
                      onChange={() => toggleSelect(emp.email)}
                      disabled={emp.email === "Not Available"}
                    />
                  </td>
                  <td className="p-2">{emp.name}</td>
                  <td className="p-2 text-blue-500">{emp.email}</td>
                  <td className="p-2">{emp.designation}</td>
                  <td className="p-2">
                    {emp.linkedin_url !== "Not Available" ? (
                      <a
                        href={emp.linkedin_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-500 underline"
                      >
                        LinkedIn
                      </a>
                    ) : (
                      "Not Available"
                    )}
                  </td>
                  <td className="p-2">
                    {emp.email !== "Not Available" && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => generateEmail(emp)}
                        >
                          Generate Email
                        </Button>
                        {generatedEmails[emp.email] && (
                          <div className="mt-2 p-2 bg-muted rounded text-sm whitespace-pre-wrap">
                            {generatedEmails[emp.email]}
                          </div>
                        )}
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {employees.length === 1 && employees[0].email === "Not Available" && (
            <p className="mt-4 italic text-muted-foreground">
              No actual employees found for this company.
            </p>
          )}

          <div className="flex gap-4 mt-4">
            <Button
              className="bg-primary text-white"
              disabled={selectedEmployees.length === 0 || sending}
              onClick={sendEmails}
            >
              {sending ? "Sending..." : "Send Email to Selected"}
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setSelectedCompany(null);
                setEmployees([]);
                setSelectedEmployees([]);
                setGeneratedEmails({});
                setSelectAll(false);
              }}
            >
              ← Back to companies
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
