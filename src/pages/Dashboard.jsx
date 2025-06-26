import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUser, removeUser, startNewSession } from "../lib/localStorage";
import Header from "../components/Header";
import LiveStatsDisplay from "../components/LiveStatsDisplay";
import DailyPuzzles from "../components/DailyPuzzles";
import ProgressTracker from "../components/ProgressTracker";
import PuzzleStats from "../components/PuzzleStats";
import Chatbot from "../components/Chatbot";
import Button from "../components/Button";
import { LogOut } from "lucide-react";
import { toast } from "sonner";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = getUser();
    if (!userData) {
      navigate("/login");
    } else {
      setUser(userData);
      // Initialize session tracking
      startNewSession();
    }
    setLoading(false);
  }, [navigate]);

  const handleLogout = () => {
    removeUser();
    toast.success("Logged out successfully!");
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center puzzle-gradient">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-spin">🧩</div>
          <p className="text-white text-lg">Loading your puzzle quest...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen puzzle-gradient">
      <div className="absolute inset-0 bg-black/10"></div>

      <div className="relative z-10">
        <Header user={user} />

        <main className="container mx-auto px-4 py-8 space-y-8">
          {/* Welcome Section */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Welcome back, {user.name}! 🎯
            </h1>
            <p className="text-purple-200 text-lg">
              Ready for today's brain challenge?
            </p>
          </div>

          {/* Live Stats Overview */}
          <LiveStatsDisplay />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Daily Puzzles - Takes up 2 columns on large screens */}
            <div className="lg:col-span-2">
              <DailyPuzzles />
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              <ProgressTracker />

              {/* Logout Button */}
              <div className="glass-effect rounded-lg p-4">
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            </div>
          </div>

          {/* Detailed Statistics Section */}
          <div className="mt-12">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Your Performance Analytics 📊
              </h2>
              <p className="text-purple-200">
                Track your progress across all difficulty levels and puzzle
                types
              </p>
            </div>
            <PuzzleStats />
          </div>

          {/* Chatbot */}
          <Chatbot />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
