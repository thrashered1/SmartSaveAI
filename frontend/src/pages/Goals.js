import { useState, useEffect } from 'react';
import axios from 'axios';
import { Target, Plus, TrendingUp, CheckCircle, Wallet, Calendar } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import GoalCard from '../components/goals/GoalCard';
import CreateGoalModal from '../components/goals/CreateGoalModal';
import AddMoneyModal from '../components/goals/AddMoneyModal';
import GoalCompletionModal from '../components/goals/GoalCompletionModal';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function Goals() {
  const [goals, setGoals] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAddMoneyModal, setShowAddMoneyModal] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [completedGoal, setCompletedGoal] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    try {
      const res = await axios.get(`${API}/goals`);
      setGoals(res.data);
    } catch (error) {
      console.error('Failed to load goals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGoal = async (goalData) => {
    try {
      const res = await axios.post(`${API}/goals`, goalData);
      setGoals([...goals, res.data]);
      setShowCreateModal(false);
      toast.success('Goal created! 🎯');
    } catch (error) {
      toast.error('Failed to create goal');
    }
  };

  const handleAddMoney = async (goalId, amount, source) => {
    try {
      const res = await axios.post(`${API}/goals/${goalId}/add-money`, { amount, source });
      
      if (res.data.completed) {
        const goal = goals.find(g => g.id === goalId);
        setCompletedGoal({ ...goal, current_amount: res.data.new_amount });
        setShowCompletionModal(true);
      } else {
        toast.success(`€${amount} added! 💰`);
      }
      
      await loadGoals();
      setShowAddMoneyModal(false);
    } catch (error) {
      toast.error('Failed to add money');
    }
  };

  const handleDeleteGoal = async (goalId) => {
    try {
      await axios.delete(`${API}/goals/${goalId}`);
      setGoals(goals.filter(g => g.id !== goalId));
      toast.success('Goal deleted');
    } catch (error) {
      toast.error('Failed to delete goal');
    }
  };

  const openAddMoney = (goal) => {
    setSelectedGoal(goal);
    setShowAddMoneyModal(true);
  };

  const activeGoals = goals.filter(g => !g.completed_at);
  const completedGoals = goals.filter(g => g.completed_at);
  const totalSaved = goals.reduce((sum, g) => sum + g.current_amount, 0);
  const totalTarget = goals.reduce((sum, g) => sum + g.target_amount, 0);
  const overallProgress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-muted-foreground">Loading goals...</div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto min-h-screen bg-background p-6 pb-24">
      {/* Header */}
      <div className="mb-8 animate-fade-in flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1" data-testid="goals-title">Goals</h1>
          <p className="text-sm text-muted-foreground font-medium">Track your savings journey</p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          className="h-11 w-11 rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-600 shadow-lg shadow-purple-500/25 p-0"
          data-testid="create-goal-btn"
        >
          <Plus className="w-5 h-5" />
        </Button>
      </div>

      {/* Overall Progress Card */}
      {goals.length > 0 && (
        <div className="mb-6 premium-gradient rounded-3xl p-6 animate-fade-in" data-testid="overall-progress">
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-5 h-5 opacity-90" />
            <span className="text-sm font-semibold opacity-90 uppercase tracking-wider">Total Progress</span>
          </div>
          <div className="text-5xl font-bold tracking-tighter mb-2 number-display">
            €{totalSaved.toFixed(2)}
          </div>
          <div className="text-sm opacity-80 mb-3">of €{totalTarget.toFixed(2)} target</div>
          <Progress value={overallProgress} className="h-2 bg-white/20" />
          <div className="text-sm opacity-80 mt-2">{overallProgress.toFixed(1)}% complete</div>
        </div>
      )}

      {/* Stats Grid */}
      {goals.length > 0 && (
        <div className="grid grid-cols-4 gap-3 mb-6 animate-fade-in">
          <div className="premium-card p-4 text-center">
            <Target className="w-5 h-5 mx-auto mb-1 text-purple-400" />
            <div className="text-2xl font-bold number-display">{activeGoals.length}</div>
            <div className="text-xs text-muted-foreground">Active</div>
          </div>
          <div className="premium-card p-4 text-center">
            <CheckCircle className="w-5 h-5 mx-auto mb-1 text-green-400" />
            <div className="text-2xl font-bold number-display">{completedGoals.length}</div>
            <div className="text-xs text-muted-foreground">Done</div>
          </div>
          <div className="premium-card p-4 text-center">
            <Wallet className="w-5 h-5 mx-auto mb-1 text-purple-400" />
            <div className="text-xl font-bold number-display">€{totalSaved.toFixed(0)}</div>
            <div className="text-xs text-muted-foreground">Saved</div>
          </div>
          <div className="premium-card p-4 text-center">
            <TrendingUp className="w-5 h-5 mx-auto mb-1 text-green-400" />
            <div className="text-2xl font-bold number-display">{completedGoals.length > 0 ? ((completedGoals.length / goals.length) * 100).toFixed(0) : 0}%</div>
            <div className="text-xs text-muted-foreground">Rate</div>
          </div>
        </div>
      )}

      {/* Active Goals */}
      {activeGoals.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Active Goals</h2>
          <div className="space-y-3">
            {activeGoals.map(goal => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onAddMoney={() => openAddMoney(goal)}
                onDelete={handleDeleteGoal}
              />
            ))}
          </div>
        </div>
      )}

      {/* Completed Goals */}
      {completedGoals.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Completed Goals</h2>
          <div className="space-y-3 opacity-60">
            {completedGoals.map(goal => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onAddMoney={() => {}}
                onDelete={handleDeleteGoal}
                completed
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {goals.length === 0 && (
        <div className="text-center py-12 animate-fade-in" data-testid="empty-goals">
          <Target className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-semibold mb-2">No goals yet</h3>
          <p className="text-muted-foreground mb-6">Start saving for something special!</p>
        </div>
      )}

      {/* Modals */}
      <CreateGoalModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreateGoal}
      />

      {selectedGoal && (
        <AddMoneyModal
          open={showAddMoneyModal}
          onClose={() => setShowAddMoneyModal(false)}
          goal={selectedGoal}
          onAddMoney={handleAddMoney}
        />
      )}

      {completedGoal && (
        <GoalCompletionModal
          open={showCompletionModal}
          onClose={() => {
            setShowCompletionModal(false);
            setCompletedGoal(null);
          }}
          goal={completedGoal}
        />
      )}
    </div>
  );
}