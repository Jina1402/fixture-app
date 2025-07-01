import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { 
  ArrowLeft, 
  Settings, 
  Database, 
  Users, 
  TrendingUp,
  Download,
  Trash2,
  RefreshCw,
  BarChart3,
  MessageSquare,
  Heart
} from 'lucide-react';

const AdminPanel = () => {
  const [stats, setStats] = useState({
    totalFeedback: 0,
    totalPulse: 0,
    avgSatisfaction: 0,
    resolutionRate: 0
  });

  useEffect(() => {
    calculateStats();
  }, []);

  const calculateStats = () => {
    const feedback = JSON.parse(localStorage.getItem('fixure_feedback') || '[]');
    const pulse = JSON.parse(localStorage.getItem('fixure_pulse') || '[]');
    
    const resolved = feedback.filter(f => f.status === 'resolved').length;
    const resolutionRate = feedback.length > 0 ? ((resolved / feedback.length) * 100).toFixed(1) : 0;
    
    const avgSatisfaction = pulse.length > 0 
      ? (pulse.reduce((acc, p) => acc + p.responses.satisfaction[0], 0) / pulse.length).toFixed(1)
      : 0;

    setStats({
      totalFeedback: feedback.length,
      totalPulse: pulse.length,
      avgSatisfaction,
      resolutionRate
    });
  };

  const exportData = () => {
    const feedback = JSON.parse(localStorage.getItem('fixure_feedback') || '[]');
    const pulse = JSON.parse(localStorage.getItem('fixure_pulse') || '[]');
    
    const data = {
      feedback,
      pulse,
      exportDate: new Date().toISOString(),
      stats
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fixure-data-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    
    toast({
      title: "Data Exported! 📊",
      description: "All platform data has been downloaded successfully.",
    });
  };

  const clearAllData = () => {
    if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      localStorage.removeItem('fixure_feedback');
      localStorage.removeItem('fixure_pulse');
      calculateStats();
      
      toast({
        title: "Data Cleared! 🗑️",
        description: "All platform data has been removed.",
        variant: "destructive"
      });
    }
  };

  const generateSampleData = () => {
    const sampleFeedback = [
      {
        id: Date.now() + 1,
        category: 'Communication',
        role: 'Software Engineer',
        feedback: 'Team meetings could be more structured. They often run over time and lack clear agendas.',
        priority: 'high',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        status: 'pending',
        solutions: []
      },
      {
        id: Date.now() + 2,
        category: 'Work Environment',
        role: 'Product Manager',
        feedback: 'The office noise level makes it difficult to concentrate. Can we introduce quiet zones?',
        priority: 'medium',
        timestamp: new Date(Date.now() - 172800000).toISOString(),
        status: 'in-progress',
        solutions: [{ text: 'Headphones are available for booking.', author: 'Team' }]
      },
      {
        id: Date.now() + 3,
        category: 'Tools & Technology',
        role: 'Designer',
        feedback: 'Our design software is outdated and slowing down the creative process.',
        priority: 'medium',
        timestamp: new Date(Date.now() - 259200000).toISOString(),
        status: 'resolved',
        solutions: []
      },
      {
        id: Date.now() + 4,
        category: 'Communication',
        role: 'Marketing',
        feedback: 'The all-hands meetings are not very engaging. It feels like a one-way broadcast.',
        priority: 'medium',
        timestamp: new Date(Date.now() - 86400000 * 3).toISOString(),
        status: 'pending',
        solutions: []
      },
      {
        id: Date.now() + 5,
        category: 'Communication',
        role: 'Sales',
        feedback: 'Cross-department communication is lacking. We often find out about product changes too late.',
        priority: 'urgent',
        timestamp: new Date(Date.now() - 86400000 * 4).toISOString(),
        status: 'pending',
        solutions: []
      }
    ];

    const samplePulse = [
      {
        id: Date.now() + 6,
        responses: { satisfaction: [8], workload: [6], communication: [7], growth: [5], teamwork: [9] },
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        week: new Date(Date.now() - 86400000).toISOString().slice(0, 10)
      },
      {
        id: Date.now() + 7,
        responses: { satisfaction: [7], workload: [8], communication: [6], growth: [7], teamwork: [8] },
        timestamp: new Date(Date.now() - 172800000).toISOString(),
        week: new Date(Date.now() - 172800000).toISOString().slice(0, 10)
      }
    ];

    localStorage.setItem('fixure_feedback', JSON.stringify(sampleFeedback));
    localStorage.setItem('fixure_pulse', JSON.stringify(samplePulse));
    calculateStats();

    toast({
      title: "Sample Data Generated! 🎯",
      description: "Demo feedback and pulse data has been added to the platform.",
    });
  };

  const adminActions = [
    {
      title: 'Export All Data',
      description: 'Download complete platform data as JSON',
      icon: Download,
      action: exportData,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Generate Sample Data',
      description: 'Add demo feedback and pulse data for testing',
      icon: RefreshCw,
      action: generateSampleData,
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Clear All Data',
      description: 'Remove all feedback and pulse data',
      icon: Trash2,
      action: clearAllData,
      color: 'from-red-500 to-rose-500'
    }
  ];

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <Link to="/dashboard" className="inline-flex items-center text-purple-400 hover:text-purple-300 mb-6"><ArrowLeft className="w-4 h-4 mr-2" />Back to Dashboard</Link>
          <div className="flex items-center mb-8">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-xl flex items-center justify-center mr-4"><Settings className="w-6 h-6 text-white" /></div>
            <div><h1 className="text-4xl font-bold gradient-text">Admin Panel</h1><p className="text-gray-300">Platform management and analytics</p></div>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="glass-effect rounded-2xl p-6 card-hover"><div className="flex items-center justify-between mb-4"><MessageSquare className="w-8 h-8 text-purple-400" /><span className="text-2xl font-bold">{stats.totalFeedback}</span></div><p className="text-gray-300">Total Feedback</p></div>
          <div className="glass-effect rounded-2xl p-6 card-hover"><div className="flex items-center justify-between mb-4"><Heart className="w-8 h-8 text-pink-400" /><span className="text-2xl font-bold">{stats.totalPulse}</span></div><p className="text-gray-300">Pulse Responses</p></div>
          <div className="glass-effect rounded-2xl p-6 card-hover"><div className="flex items-center justify-between mb-4"><TrendingUp className="w-8 h-8 text-green-400" /><span className="text-2xl font-bold">{stats.avgSatisfaction}</span></div><p className="text-gray-300">Avg Satisfaction</p></div>
          <div className="glass-effect rounded-2xl p-6 card-hover"><div className="flex items-center justify-between mb-4"><BarChart3 className="w-8 h-8 text-cyan-400" /><span className="text-2xl font-bold">{stats.resolutionRate}%</span></div><p className="text-gray-300">Resolution Rate</p></div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-effect rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center"><Database className="w-6 h-6 mr-2 text-purple-400" />Data Management</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {adminActions.map((action, index) => (
              <motion.div key={action.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + index * 0.1 }} className="bg-white/5 border border-white/10 rounded-xl p-6 card-hover">
                <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-xl flex items-center justify-center mb-4`}><action.icon className="w-6 h-6 text-white" /></div>
                <h3 className="text-lg font-semibold mb-2">{action.title}</h3><p className="text-gray-400 text-sm mb-4">{action.description}</p>
                <Button onClick={action.action} className="w-full" variant={action.title.includes('Clear') ? 'destructive' : 'default'}>{action.title}</Button>
              </motion.div>
            ))}
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-effect rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center"><Users className="w-6 h-6 mr-2 text-cyan-400" />Platform Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link to="/feedback"><Button variant="outline" className="w-full justify-start border-purple-500 text-purple-400 hover:bg-purple-500/10"><MessageSquare className="w-4 h-4 mr-2" />Test Feedback Form</Button></Link>
                <Link to="/pulse"><Button variant="outline" className="w-full justify-start border-pink-500 text-pink-400 hover:bg-pink-500/10"><Heart className="w-4 h-4 mr-2" />Test Pulse Check</Button></Link>
                <Link to="/dashboard"><Button variant="outline" className="w-full justify-start border-cyan-500 text-cyan-400 hover:bg-cyan-500/10"><BarChart3 className="w-4 h-4 mr-2" />View Dashboard</Button></Link>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">System Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/20 rounded-lg"><span className="text-green-400">Data Storage</span><span className="text-green-400 font-semibold">Active</span></div>
                <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/20 rounded-lg"><span className="text-green-400">Feedback System</span><span className="text-green-400 font-semibold">Online</span></div>
                <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/20 rounded-lg"><span className="text-green-400">Pulse Monitoring</span><span className="text-green-400 font-semibold">Running</span></div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminPanel;