import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const AdminDashboard = () => {
  const stats = [
    { label: "Active Students", value: "247", change: "+12 this week" },
    { label: "Curriculum Files", value: "34", change: "Last updated 2 days ago" },
    { label: "AI Queries Today", value: "1,429", change: "+23% from yesterday" },
    { label: "Avg Session Time", value: "18m", change: "+5m from last week" }
  ];

  const recentUploads = [
    { name: "Mathematics_Grade_12.pdf", size: "2.4 MB", date: "2 hours ago", status: "Processed" },
    { name: "Physics_Quantum_Notes.pdf", size: "1.8 MB", date: "1 day ago", status: "Processed" },
    { name: "Chemistry_Lab_Manual.pdf", size: "3.2 MB", date: "2 days ago", status: "Processed" },
    { name: "Biology_Question_Bank.pdf", size: "4.1 MB", date: "3 days ago", status: "Processing" }
  ];

  const weakTopics = [
    { topic: "Quantum Physics", queries: 87, accuracy: 65 },
    { topic: "Organic Chemistry", queries: 64, accuracy: 72 },
    { topic: "Calculus Integration", queries: 59, accuracy: 78 },
    { topic: "Cell Biology", queries: 43, accuracy: 82 }
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />
      
      <div className="pt-20 pb-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage your institution's AI tutoring platform</p>
            </div>
            <Badge variant="secondary" className="px-4 py-2">
              Demo Mode
            </Badge>
          </div>

          {/* Stats Overview */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card key={index} className="gradient-card border-0 shadow-soft">
                <CardContent className="p-6">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs text-green-600">{stat.change}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Upload Section */}
              <Card className="gradient-card border-0 shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Curriculum Management
                    <Button variant="cta" size="sm">
                      Upload Files
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-primary/20 rounded-lg p-8 text-center">
                    <div className="text-4xl mb-4">📤</div>
                    <h3 className="font-semibold mb-2">Upload Curriculum Files</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Drag and drop PDFs, notes, and question banks here
                    </p>
                    <Button variant="outline" size="sm">
                      Choose Files
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Uploads */}
              <Card className="gradient-card border-0 shadow-card">
                <CardHeader>
                  <CardTitle>Recent Uploads</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentUploads.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="text-red-500 text-lg">📄</div>
                          <div>
                            <p className="font-medium text-sm">{file.name}</p>
                            <p className="text-xs text-muted-foreground">{file.size} • {file.date}</p>
                          </div>
                        </div>
                        <Badge variant={file.status === 'Processed' ? 'secondary' : 'outline'}>
                          {file.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Weak Topics Analysis */}
              <Card className="gradient-card border-0 shadow-card">
                <CardHeader>
                  <CardTitle>Topics Needing Attention</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {weakTopics.map((topic, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm">{topic.topic}</span>
                          <span className="text-xs text-muted-foreground">{topic.queries} queries</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Progress value={topic.accuracy} className="flex-1" />
                          <span className="text-xs text-muted-foreground w-12">{topic.accuracy}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Student Activity */}
              <Card className="gradient-card border-0 shadow-card">
                <CardHeader>
                  <CardTitle>Student Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Online Now</span>
                      <span className="font-semibold">42 students</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Peak Time</span>
                      <span className="font-semibold">4-6 PM</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Most Active Subject</span>
                      <span className="font-semibold">Mathematics</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="gradient-card border-0 shadow-card">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    👥 Manage Students
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    📊 View Analytics
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    ⚙️ Platform Settings
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    📞 Contact Support
                  </Button>
                </CardContent>
              </Card>

              {/* Subscription Info */}
              <Card className="gradient-card border-0 shadow-card">
                <CardHeader>
                  <CardTitle>Subscription Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium">Active Plan</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Annual Subscription
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Renewal: March 15, 2025
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      Manage Billing
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AdminDashboard;