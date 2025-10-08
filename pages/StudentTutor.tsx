import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

const StudentTutor = () => {
  const [messages, setMessages] = useState([
    {
      type: 'ai',
      content: "Hello! I'm your AI Tutor, trained specifically on your institution's curriculum. How can I help you study today?",
      timestamp: "10:30 AM"
    },
    {
      type: 'user', 
      content: "Can you explain quantum entanglement in simple terms?",
      timestamp: "10:31 AM"
    },
    {
      type: 'ai',
      content: "Based on your Physics curriculum (Chapter 12: Quantum Physics), quantum entanglement is a phenomenon where two particles become connected in such a way that measuring one particle instantly affects the other, no matter how far apart they are. Think of it like having two magical coins that always land on opposite sides - if one shows heads, the other will always show tails, even if they're on different planets!",
      timestamp: "10:31 AM"
    }
  ]);
  
  const [inputMessage, setInputMessage] = useState("");
  const [isSubscribed] = useState(true); // Toggle this to see subscription wall

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    
    setMessages(prev => [...prev, {
      type: 'user',
      content: inputMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
    
    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        type: 'ai',
        content: "I understand your question about " + inputMessage + ". Based on your curriculum, here's a detailed explanation...",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 1000);
    
    setInputMessage("");
  };

  if (!isSubscribed) {
    return (
      <div className="min-h-screen bg-muted/30">
        <Header />
        <div className="pt-20 pb-16 flex items-center justify-center">
          <Card className="max-w-md mx-4 gradient-card border-0 shadow-feature">
            <CardContent className="p-8 text-center space-y-6">
              <div className="text-6xl">🔒</div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-foreground">Subscription Required</h2>
                <p className="text-muted-foreground">
                  Your institution needs an active Acadira subscription to access the AI Tutor.
                </p>
              </div>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Contact your institution's administrator to:
                </p>
                <div className="text-left space-y-1 text-sm text-muted-foreground">
                  <div>• Subscribe to Acadira platform</div>
                  <div>• Upload your curriculum</div>
                  <div>• Enable student access</div>
                </div>
              </div>
              <Button variant="cta" className="w-full">
                Contact Administrator
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />
      
      <div className="pt-20 pb-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-1">AI Tutor</h1>
              <p className="text-sm text-muted-foreground">Curriculum-aligned tutoring for your studies</p>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="secondary" className="px-3 py-1">
                Demo Mode
              </Badge>
              <Badge variant="outline" className="px-3 py-1">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Online
              </Badge>
            </div>
          </div>

          <Card className="gradient-card border-0 shadow-feature h-[600px] flex flex-col">
            <CardHeader className="border-b border-border">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 gradient-hero rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">🤖</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Acadira AI Tutor</span>
                    <p className="text-xs text-muted-foreground">Trained on your institution's curriculum</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Clear Chat
                </Button>
              </CardTitle>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col p-0">
              <ScrollArea className="flex-1 p-6">
                <div className="space-y-4">
                  {messages.map((message, index) => (
                    <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] rounded-lg p-4 ${
                        message.type === 'user' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-background border border-border'
                      }`}>
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-xs mt-2 ${
                          message.type === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                        }`}>
                          {message.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              
              <div className="border-t border-border p-4">
                <div className="flex space-x-3">
                  <Input
                    placeholder="Ask me anything about your curriculum..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleSendMessage}
                    variant="cta"
                    disabled={!inputMessage.trim()}
                  >
                    Send
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  AI responses are based on your institution's uploaded curriculum only
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="mt-6 grid md:grid-cols-3 gap-4">
            <Card className="gradient-card border-0 shadow-soft">
              <CardContent className="p-4 text-center">
                <div className="text-2xl mb-2">📝</div>
                <h3 className="font-medium text-sm mb-1">Generate Quiz</h3>
                <p className="text-xs text-muted-foreground">Test your knowledge</p>
              </CardContent>
            </Card>
            
            <Card className="gradient-card border-0 shadow-soft">
              <CardContent className="p-4 text-center">
                <div className="text-2xl mb-2">🃏</div>
                <h3 className="font-medium text-sm mb-1">Study Cards</h3>
                <p className="text-xs text-muted-foreground">Review concepts</p>
              </CardContent>
            </Card>
            
            <Card className="gradient-card border-0 shadow-soft">
              <CardContent className="p-4 text-center">
                <div className="text-2xl mb-2">📊</div>
                <h3 className="font-medium text-sm mb-1">Study Progress</h3>
                <p className="text-xs text-muted-foreground">Track learning</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default StudentTutor;