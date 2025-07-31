import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function NewCampaign() {
  const [prompt, setPrompt] = useState("");
  const [industry, setIndustry] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [searchLimit, setSearchLimit] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleContinue = async () => {
    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:5678/webhook-test/prompt-intent",
        {
          prompt,
          filters: {
            industry,
            companySize,
            searchLimit,
          },
        }
      );

      const responseData = Array.isArray(response.data)
        ? response.data[0]
        : response.data;

      const rawPeople = responseData?.campaignPeople || [];
      const rawCompanies = responseData?.campaignContacts || [];

      const allPeople = rawPeople.map((person: any) => ({
        name: person?.name || "Not Available",
        email: person?.email || "Not Available",
        designation: person?.title || "Not Available",
        linkedin_url: person?.linkedin_url || "Not Available",
        company: person?.organization_name || "Unknown Company",
        domain: "",
      }));

      const companies = rawCompanies.map((c: any) => ({
        company: c?.company || "Unknown",
        domain: c?.domain || "Not Available",
      }));

      // ✅ Save clean data to localStorage
      localStorage.setItem("campaignPeople", JSON.stringify(allPeople));
      localStorage.setItem("campaignContacts", JSON.stringify(companies));

      // ✅ Save campaign
      const campaignId = Date.now().toString();
      const campaign = {
        id: campaignId,
        name: prompt.slice(0, 50) || "Untitled Campaign",
        prompt,
        filters: { industry, companySize, searchLimit },
        createdAt: new Date().toISOString(),
        campaignPeople: allPeople,
        campaignContacts: companies,
      };

      const existing = JSON.parse(localStorage.getItem("campaigns") || "[]");
      existing.push(campaign);
      localStorage.setItem("campaigns", JSON.stringify(existing));
      localStorage.setItem("currentCampaignId", campaignId);

      navigate("/campaign-leads");
    } catch (error) {
      console.error("❌ Failed to trigger workflow:", error);
      alert("Something went wrong while extracting data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        <div>
          <label className="block mb-1 text-sm font-medium text-muted-foreground">
            Prompt
          </label>
          <Input
            placeholder="e.g. Find HR Managers at companies in FinTech"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-muted-foreground">
              Industry
            </label>
            <Input
              placeholder="e.g. FinTech"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-muted-foreground">
              Company Size
            </label>
            <Input
              placeholder="e.g. 100-500"
              value={companySize}
              onChange={(e) => setCompanySize(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-muted-foreground">
              Search Limit
            </label>
            <Input
              type="number"
              placeholder="e.g. 10"
              value={searchLimit}
              onChange={(e) => setSearchLimit(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-12 flex justify-between">
          <Link to="/ai-sdr-dashboard">
            <Button variant="outline">Cancel</Button>
          </Link>
          <div className="flex gap-4">
            <Button variant="outline">Save Draft</Button>
            <Button
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={handleContinue}
              disabled={loading}
            >
              {loading ? "Extracting..." : "Continue to Campaign Setup"}
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
