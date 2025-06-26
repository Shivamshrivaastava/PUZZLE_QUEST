import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getUser } from "../lib/localStorage";
import Button from "../components/Button";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to dashboard if user is already logged in
    const user = getUser();
    if (user) {
      navigate("/dashboard");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen puzzle-gradient">
      <div className="absolute inset-0 bg-black/10"></div>

      {/* Header */}
      <header className="relative z-10 container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-4xl">🧩</div>
            <div>
              <h1 className="text-2xl font-bold text-white">Puzzle Quest</h1>
              <p className="text-purple-200 text-sm">Daily Brain Challenge</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/login">
              <Button variant="outline" className="text-sm">
                Login
              </Button>
            </Link>
            <Link to="/signup">
              <Button className="puzzle-gradient text-white text-sm">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 flex items-center justify-center min-h-[calc(100vh-200px)] px-6">
        <div className="text-center max-w-3xl mx-auto">
          <div className="mb-8">
            <div className="text-8xl mb-8 animate-bounce-in">🧠</div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Train Your Brain
              <span className="block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Every Day
              </span>
            </h1>
            <p className="text-xl text-purple-200 mb-12 max-w-2xl mx-auto">
              Solve AI-generated puzzles, track your IQ, and build your daily
              streak.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link to="/signup">
              <Button
                size="lg"
                className="puzzle-gradient text-white text-lg px-12 py-4 hover:scale-105 transition-transform neon-glow"
              >
                Start Playing 🚀
              </Button>
            </Link>
            <Link to="/login">
              <Button
                variant="outline"
                size="lg"
                className="border-purple-400 text-purple-200 hover:bg-purple-400/10 text-lg px-12 py-4"
              >
                I Have Account
              </Button>
            </Link>
          </div>

          {/* Simple Stats */}
          <div className="mt-20 grid grid-cols-3 gap-8 max-w-md mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">3</div>
              <p className="text-purple-200 text-sm">Daily Puzzles</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">∞</div>
              <p className="text-purple-200 text-sm">Practice Mode</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-2">📈</div>
              <p className="text-purple-200 text-sm">IQ Tracking</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-8">
        <p className="text-purple-300 text-sm">
          Made with 💜 for brain enthusiasts
        </p>
      </footer>
    </div>
  );
};

export default Index;
