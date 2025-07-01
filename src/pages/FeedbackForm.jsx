
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { ArrowLeft, Send, MessageSquare, Shield } from 'lucide-react';

const FeedbackForm = () => {
  const [formData, setFormData] = useState({
    category: '',
    role: '',
    feedback: '',
    priority: 'medium'
  });

  const categories = [
    'Communication',
    'Management',
    'Work Environment',
    'Processes',
    'Tools & Technology',
    'Team Dynamics',
    'Career Development',
    'Company Culture',
    'Other'
  ];

  const roles = [
    'Software Engineer',
    'Product Manager',
    'Designer',
    'Marketing',
    'Sales',
    'HR',
    'Operations',
    'Executive',
    'Other'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.category || !formData.role || !formData.feedback.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    // Save to localStorage
    const existingFeedback = JSON.parse(localStorage.getItem('fixure_feedback') || '[]');
    const newFeedback = {
      id: Date.now(),
      ...formData,
      timestamp: new Date().toISOString(),
      status: 'pending'
    };
    
    existingFeedback.push(newFeedback);
    localStorage.setItem('fixure_feedback', JSON.stringify(existingFeedback));

    toast({
      title: "Feedback Submitted! 🎉",
      description: "Thank you for your input. Your feedback will be reviewed and addressed.",
    });

    // Reset form
    setFormData({
      category: '',
      role: '',
      feedback: '',
      priority: 'medium'
    });
  };

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link to="/" className="inline-flex items-center text-purple-400 hover:text-purple-300 mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          
          <div className="glass-effect rounded-2xl p-8 mb-8">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-xl flex items-center justify-center mr-4">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold gradient-text">Anonymous Feedback</h1>
                <p className="text-gray-300">Your voice matters. Share your thoughts safely.</p>
              </div>
            </div>
            
            <div className="flex items-center text-sm text-gray-400 bg-green-500/10 border border-green-500/20 rounded-lg p-3">
              <Shield className="w-4 h-4 mr-2 text-green-400" />
              Your feedback is completely anonymous and secure
            </div>
          </div>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-effect rounded-2xl p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                  <SelectTrigger className="bg-white/5 border-white/10">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Your Role *</Label>
                <Select value={formData.role} onValueChange={(value) => setFormData({...formData, role: value})}>
                  <SelectTrigger className="bg-white/5 border-white/10">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority Level</Label>
              <Select value={formData.priority} onValueChange={(value) => setFormData({...formData, priority: value})}>
                <SelectTrigger className="bg-white/5 border-white/10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low - Minor improvement</SelectItem>
                  <SelectItem value="medium">Medium - Moderate impact</SelectItem>
                  <SelectItem value="high">High - Significant issue</SelectItem>
                  <SelectItem value="urgent">Urgent - Critical problem</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="feedback">Your Feedback *</Label>
              <Textarea
                id="feedback"
                placeholder="Share your thoughts, concerns, or suggestions. Be as detailed as you'd like..."
                value={formData.feedback}
                onChange={(e) => setFormData({...formData, feedback: e.target.value})}
                className="bg-white/5 border-white/10 min-h-[120px] resize-none"
              />
              <p className="text-sm text-gray-400">
                {formData.feedback.length}/1000 characters
              </p>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-lg py-6"
            >
              <Send className="w-5 h-5 mr-2" />
              Submit Feedback
            </Button>
          </form>
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 text-center"
        >
          <p className="text-gray-400 mb-4">
            Need to share something quickly? Try our pulse check instead.
          </p>
          <Link to="/pulse">
            <Button variant="outline" className="border-cyan-500 text-cyan-400 hover:bg-cyan-500/10">
              Take Pulse Check
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default FeedbackForm;
