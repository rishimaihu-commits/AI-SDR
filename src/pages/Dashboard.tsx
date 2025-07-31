import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Lock } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-medium mb-2">Hi Yash!</h1>
          <p className="text-muted-foreground">Your progress so far...</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">14K</div>
                  <div className="text-sm text-muted-foreground">
                    companies searched
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  View list
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">1,200</div>
                  <div className="text-sm text-muted-foreground">
                    Email campaigns sent
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  View Status
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Section */}
        <div className="mb-8">
          <h2 className="text-xl font-medium mb-6">
            How can I help you today?
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* AI SDR Card */}
            <Link to="/ai-sdr-dashboard">
              <Card className="bg-card border-border hover:bg-secondary/50 transition-colors cursor-pointer h-32">
                <CardContent className="p-6 h-full flex flex-col items-center justify-center">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-2">
                    <span className="text-primary-foreground text-sm font-medium">
                      AI SDR
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Invoice Card */}
            <Card className="bg-card border-border hover:bg-secondary/50 transition-colors cursor-pointer h-32">
              <CardContent className="p-6 h-full flex flex-col items-center justify-center">
                <FileText className="w-8 h-8 text-muted-foreground mb-2" />
                <span className="text-sm text-muted-foreground">Invoice</span>
              </CardContent>
            </Card>

            {/* Coming Soon Cards */}
            <Card className="bg-card border-border opacity-50 h-32">
              <CardContent className="p-6 h-full flex flex-col items-center justify-center">
                <Lock className="w-8 h-8 text-muted-foreground mb-2" />
                <span className="text-xs text-muted-foreground">
                  coming soon
                </span>
              </CardContent>
            </Card>

            <Card className="bg-card border-border opacity-50 h-32">
              <CardContent className="p-6 h-full flex flex-col items-center justify-center">
                <Lock className="w-8 h-8 text-muted-foreground mb-2" />
                <span className="text-xs text-muted-foreground">
                  coming soon
                </span>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
