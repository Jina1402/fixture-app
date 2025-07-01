
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { toast } from '@/components/ui/use-toast';
import { ArrowLeft, Heart, TrendingUp, Users, Zap } from 'lucide-react';

const PulseCheck = () => {
  const [responses, setResponses] = useState({
    satisfaction: [7],
    workload: [5],
    communication: [7],
    growth: [6],
    teamwork: [8]
  });

  const questions = [
    {
      id: 'satisfaction',
      title: 'Job Satisfaction',
      description: 'How satisfied are you with your current role?',
      icon: Heart,
      color: 'from-pink-500 to-rose-500'
    },
    {
      id: 'workload',
      title: 'Workload Balance',
      description: 'How manageable is your current workload?',
      icon: TrendingUp,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'communication',
      title: 'Team Communication',
      description: 'How effective is communication within your team?',
      icon: Users,
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'growth',
      title: 'Professional Growth',
      description: 'How supported do you feel in your professional development?',
      icon: Zap,
      color: 'from-purple-500 to-violet-500'
    },
    {
      id: 'teamwork',
      title: 'Team Collaboration',
      description: 'How well does your team work together?',
      icon: Users,
      color: 'from-orange-500 to-amber-500'
    }
  ];

  const handleSliderChange = (questionId, value) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Save to localStorage
    const existingPulse = JSON.parse(localStorage.getItem('fixure_pulse') || '[]');
    const newPulse = {
      id: Date.now(),
      responses,
      timestamp: new Date().toISOString(),
      week: new Date().toISOString().slice(0, 10)
    };
    
    existingPulse.push(newPulse);
    localStorage.setItem('fixure_pulse', JSON.stringify(existingPulse));

    toast({
      title: "Pulse Check Submitted! 💓",
      description: "Thank you for sharing your weekly pulse. Your input helps us improve.",
    });

    // Reset to default values
    setResponses({
      satisfaction: [7],
      workload: [5],
      communication: [7],
      growth: [6],
      teamwork: [8]
    });
  };

  const getScoreColor = (score) => {
    if (score >= 8) return 'text-green-400';
    if (score >= 6) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreLabel = (score) => {
    if (score >= 9) return 'Excellent';
    if (score >= 7) return 'Good';
    if (score >= 5) return 'Fair';
    if (score >= 3) return 'Poor';
    return 'Critical';
  };

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-3xl mx-auto">
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
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl flex items-center justify-center mr-4">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold gradient-text">Weekly Pulse Check</h1>
                <p className="text-gray-300">Quick check-in on how you're feeling this week</p>
              </div>
            </div>
            
            <div className="text-sm text-gray-400 bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
              💡 This takes less than 2 minutes and helps leadership understand team sentiment
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
          <form onSubmit={handleSubmit} className="space-y-8">
            {questions.map((question, index) => (
              <motion.div
                key={question.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="space-y-4"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 bg-gradient-to-r ${question.color} rounded-lg flex items-center justify-center`}>
                    <question.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{question.title}</h3>
                    <p className="text-gray-400 text-sm">{question.description}</p>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${getScoreColor(responses[question.id][0])}`}>
                      {responses[question.id][0]}
                    </div>
                    <div className={`text-xs ${getScoreColor(responses[question.id][0])}`}>
                      {getScoreLabel(responses[question.id][0])}
                    </div>
                  </div>
                </div>
                
                <div className="px-3">
                  <Slider
                    value={responses[question.id]}
                    onValueChange={(value) => handleSliderChange(question.id, value)}
                    max={10}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>1 - Poor</span>
                    <span>5 - Average</span>
                    <span>10 - Excellent</span>
                  </div>
                </div>
              </motion.div>
            ))}

            <div className="pt-6 border-t border-white/10">
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-lg py-6"
              >
                <Heart className="w-5 h-5 mr-2" />
                Submit Pulse Check
              </Button>
            </div>
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
            Have specific feedback to share? Use our detailed feedback form.
          </p>
          <Link to="/feedback">
            <Button variant="outline" className="border-purple-500 text-purple-400 hover:bg-purple-500/10">
              Give Detailed Feedback
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default PulseCheck;
