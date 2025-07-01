import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel } from '@/components/ui/alert-dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  ArrowLeft, BarChart3, MessageSquare, Clock, CheckCircle, AlertCircle, Filter, Eye, Siren, Sparkles, Lightbulb, Users, UserCheck, Briefcase
} from 'lucide-react';

const Dashboard = () => {
  const [feedback, setFeedback] = useState([]);
  const [pulseData, setPulseData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [newSolution, setNewSolution] = useState('');
  const [patterns, setPatterns] = useState([]);
  const [activeDashboard, setActiveDashboard] = useState('all');

  useEffect(() => {
    const savedFeedback = JSON.parse(localStorage.getItem('fixure_feedback') || '[]');
    const savedPulse = JSON.parse(localStorage.getItem('fixure_pulse') || '[]');
    setFeedback(savedFeedback.map(f => ({ ...f, solutions: f.solutions || [] })));
    setPulseData(savedPulse);
  }, []);

  useEffect(() => {
    const detectPatterns = () => {
      const categoryCounts = {};
      feedback.forEach(item => {
        if (!categoryCounts[item.category]) {
          categoryCounts[item.category] = { count: 0, highPriorityCount: 0, items: [] };
        }
        categoryCounts[item.category].count++;
        if (['high', 'urgent'].includes(item.priority)) {
          categoryCounts[item.category].highPriorityCount++;
        }
        categoryCounts[item.category].items.push(item.feedback);
      });

      const detectedPatterns = [];
      for (const category in categoryCounts) {
        if (categoryCounts[category].count >= 3) {
          detectedPatterns.push({
            type: 'Volume',
            category,
            details: `High volume of feedback (${categoryCounts[category].count} items) in the "${category}" category.`,
            items: categoryCounts[category].items
          });
        }
        if (categoryCounts[category].highPriorityCount >= 2) {
          detectedPatterns.push({
            type: 'Urgency',
            category,
            details: `Multiple high-priority issues (${categoryCounts[category].highPriorityCount} items) in the "${category}" category.`,
            items: categoryCounts[category].items
          });
        }
      }
      setPatterns(detectedPatterns);
    };
    detectPatterns();
  }, [feedback]);

  const updateFeedback = (updatedItem) => {
    const updatedFeedbackList = feedback.map(item =>
      item.id === updatedItem.id ? updatedItem : item
    );
    setFeedback(updatedFeedbackList);
    localStorage.setItem('fixure_feedback', JSON.stringify(updatedFeedbackList));
  };
  
  const updateFeedbackStatus = (id, newStatus) => {
    const item = feedback.find(f => f.id === id);
    if(item) {
      updateFeedback({ ...item, status: newStatus });
      toast({ title: "Status Updated! ✅", description: `Feedback marked as ${newStatus}.` });
    }
  };

  const addSolution = () => {
    if (newSolution.trim() && selectedFeedback) {
      const updatedItem = {
        ...selectedFeedback,
        solutions: [...selectedFeedback.solutions, { text: newSolution, author: 'Team' }]
      };
      setSelectedFeedback(updatedItem);
      updateFeedback(updatedItem);
      setNewSolution('');
      toast({ title: "Solution Added! 💡", description: "Your suggestion has been recorded." });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'status-pending';
      case 'in-progress': return 'status-in-progress';
      case 'resolved': return 'status-resolved';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const teamLeadCategories = ['Management', 'Processes', 'Team Dynamics', 'Tools & Technology'];
  const hrCategories = ['Work Environment', 'Career Development', 'Company Culture', 'Communication'];

  const filteredFeedback = feedback.filter(item => {
    const dashboardMatch = activeDashboard === 'all' ||
      (activeDashboard === 'team_lead' && teamLeadCategories.includes(item.category)) ||
      (activeDashboard === 'hr' && hrCategories.includes(item.category));
    const categoryMatch = selectedCategory === 'all' || item.category === selectedCategory;
    const statusMatch = selectedStatus === 'all' || item.status === selectedStatus;
    return dashboardMatch && categoryMatch && statusMatch;
  });

  const stats = {
    total: filteredFeedback.length,
    pending: filteredFeedback.filter(f => f.status === 'pending').length,
    inProgress: filteredFeedback.filter(f => f.status === 'in-progress').length,
    resolved: filteredFeedback.filter(f => f.status === 'resolved').length
  };

  const categories = [...new Set(feedback.map(f => f.category))];

  const aiSuggestions = [
    "Schedule a dedicated brainstorming session with the involved team members.",
    "Conduct a survey to gather more quantitative data on this issue.",
    "Review existing company policies related to this feedback.",
    "Implement a pilot program to test a potential solution on a small scale.",
    "Create a shared document for transparent tracking of progress on this issue."
  ];

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <Link to="/" className="inline-flex items-center text-purple-400 hover:text-purple-300 mb-6"><ArrowLeft className="w-4 h-4 mr-2" />Back to Home</Link>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold gradient-text mb-2">Management Dashboard</h1>
              <p className="text-gray-300">Monitor feedback, track resolutions, and analyze team pulse</p>
            </div>
            <Link to="/admin"><Button variant="outline" className="border-cyan-500 text-cyan-400 hover:bg-cyan-500/10">Admin Panel</Button></Link>
          </div>
          {patterns.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="pattern-alert-banner rounded-xl p-4 flex items-center mb-6"
                >
                  <Siren className="w-6 h-6 mr-3 text-red-400" />
                  <p className="font-semibold text-white">Pattern Detected! We've noticed {patterns.length} trend{patterns.length > 1 ? 's' : ''} in recent feedback. Click to review.</p>
                </motion.div>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Detected Patterns</AlertDialogTitle>
                  <AlertDialogDescription>The system has identified the following trends in the feedback data. These may require your attention.</AlertDialogDescription>
                </AlertDialogHeader>
                <ScrollArea className="h-72">
                  <div className="pr-4 space-y-4">
                    {patterns.map((pattern, index) => (
                      <Card key={index} className="bg-white/5">
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center">
                            <Badge className="mr-2">{pattern.type}</Badge> {pattern.category}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-300">{pattern.details}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
                <AlertDialogFooter>
                  <AlertDialogAction>Acknowledge</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-effect rounded-2xl p-8">
          <Tabs defaultValue="all" onValueChange={setActiveDashboard} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="all"><Users className="w-4 h-4 mr-2" />Overall</TabsTrigger>
              <TabsTrigger value="team_lead"><UserCheck className="w-4 h-4 mr-2" />Team Lead</TabsTrigger>
              <TabsTrigger value="hr"><Briefcase className="w-4 h-4 mr-2" />HR</TabsTrigger>
              <TabsTrigger value="pulse"><BarChart3 className="w-4 h-4 mr-2" />Pulse</TabsTrigger>
            </TabsList>
            <TabsContent value={activeDashboard} className="space-y-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <Card className="glass-effect"><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Total Feedback</CardTitle><MessageSquare className="w-4 h-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{stats.total}</div></CardContent></Card>
                  <Card className="glass-effect"><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Pending</CardTitle><Clock className="w-4 h-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{stats.pending}</div></CardContent></Card>
                  <Card className="glass-effect"><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">In Progress</CardTitle><AlertCircle className="w-4 h-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{stats.inProgress}</div></CardContent></Card>
                  <Card className="glass-effect"><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Resolved</CardTitle><CheckCircle className="w-4 h-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{stats.resolved}</div></CardContent></Card>
              </motion.div>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2"><Filter className="w-4 h-4 text-gray-400" /><span className="text-sm text-gray-400">Filters:</span></div>
                <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-sm"><option value="all">All Categories</option>{categories.map(cat => (<option key={cat} value={cat}>{cat}</option>))}</select>
                <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-sm"><option value="all">All Status</option><option value="pending">Pending</option><option value="in-progress">In Progress</option><option value="resolved">Resolved</option></select>
              </div>
              <ScrollArea className="h-[500px]">
                <div className="space-y-4 pr-4">
                  {filteredFeedback.length === 0 ? (
                    <div className="text-center py-12"><MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" /><p className="text-gray-400 text-lg">No feedback found</p><p className="text-gray-500">Try adjusting your filters or encourage team members to share feedback</p></div>
                  ) : (
                    filteredFeedback.map((item, index) => (
                      <motion.div key={item.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }} className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center flex-wrap gap-2 mb-2"><Badge className="category-badge">{item.category}</Badge><Badge variant="outline" className="text-gray-300">{item.role}</Badge><div className={`w-3 h-3 rounded-full ${getPriorityColor(item.priority)}`} title={`${item.priority} priority`}></div></div>
                            <p className="text-gray-300 mb-2 line-clamp-2">{item.feedback}</p>
                            <p className="text-xs text-gray-500">{new Date(item.timestamp).toLocaleDateString()}</p>
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            <Badge className={`${getStatusColor(item.status)} text-white border-0`}>{item.status.replace('-', ' ')}</Badge>
                            <Button size="sm" variant="ghost" onClick={() => setSelectedFeedback(item)}><Eye className="w-4 h-4" /></Button>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
            <TabsContent value="pulse" className="space-y-6">
              {pulseData.length === 0 ? (<div className="text-center py-12"><BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" /><p className="text-gray-400 text-lg">No pulse data available</p></div>) : (<div></div>)}
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

      <Dialog open={!!selectedFeedback} onOpenChange={() => setSelectedFeedback(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="gradient-text">Feedback Details & Resolution</DialogTitle>
            <DialogDescription>Review feedback and collaborate on a solution.</DialogDescription>
          </DialogHeader>
          {selectedFeedback && (
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="ai"><Sparkles className="w-4 h-4 mr-2" />AI Suggestions</TabsTrigger>
                <TabsTrigger value="team"><Lightbulb className="w-4 h-4 mr-2" />Team Solutions</TabsTrigger>
              </TabsList>
              <ScrollArea className="h-[350px] mt-4">
                <div className="pr-4">
                  <TabsContent value="details">
                    <Card className="bg-transparent border-0 shadow-none">
                      <CardContent className="space-y-4 pt-6">
                        <div className="flex items-center flex-wrap gap-2"><Badge className="category-badge">{selectedFeedback.category}</Badge><Badge variant="outline">{selectedFeedback.role}</Badge><Badge className={`${getPriorityColor(selectedFeedback.priority)} text-white border-0`}>{selectedFeedback.priority}</Badge></div>
                        <p className="text-gray-300 whitespace-pre-wrap">{selectedFeedback.feedback}</p>
                        <p className="text-xs text-gray-500">Submitted on {new Date(selectedFeedback.timestamp).toLocaleString()}</p>
                        <div className="flex space-x-2 pt-4">
                          <Button size="sm" variant="outline" onClick={() => updateFeedbackStatus(selectedFeedback.id, 'in-progress')} disabled={selectedFeedback.status === 'in-progress'}>Mark In Progress</Button>
                          <Button size="sm" variant="outline" onClick={() => updateFeedbackStatus(selectedFeedback.id, 'resolved')} disabled={selectedFeedback.status === 'resolved'}>Mark Resolved</Button>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  <TabsContent value="ai">
                    <Card className="bg-transparent border-0 shadow-none">
                      <CardContent className="space-y-3 pt-6">
                        {aiSuggestions.map((suggestion, i) => (
                          <div key={i} className="flex items-start p-3 rounded-lg bg-white/5"><Sparkles className="w-4 h-4 mr-3 mt-1 text-purple-400 flex-shrink-0" /><p className="text-sm text-gray-300">{suggestion}</p></div>
                        ))}
                      </CardContent>
                    </Card>
                  </TabsContent>
                  <TabsContent value="team">
                    <Card className="bg-transparent border-0 shadow-none">
                      <CardContent className="space-y-4 pt-6">
                        <div className="space-y-2">
                          <Textarea placeholder="Add a potential solution or idea..." value={newSolution} onChange={(e) => setNewSolution(e.target.value)} className="bg-white/5 border-white/10" />
                          <Button onClick={addSolution} size="sm">Add Suggestion</Button>
                        </div>
                        <div className="space-y-3">
                          {selectedFeedback.solutions.length === 0 ? (
                            <p className="text-sm text-gray-400 text-center py-4">No team solutions yet. Be the first to suggest one!</p>
                          ) : (
                            selectedFeedback.solutions.map((sol, i) => (
                              <div key={i} className="flex items-start p-3 rounded-lg bg-white/5"><Lightbulb className="w-4 h-4 mr-3 mt-1 text-cyan-400 flex-shrink-0" /><p className="text-sm text-gray-300">{sol.text}</p></div>
                            ))
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </div>
              </ScrollArea>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;