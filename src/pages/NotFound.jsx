import { Link } from "react-router-dom";
import Button from "../components/Button";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center puzzle-gradient">
      <div className="absolute inset-0 bg-black/20"></div>

      <div className="relative z-10 text-center space-y-8 p-8">
        <div className="space-y-4">
          <div className="text-8xl md:text-9xl font-bold text-white opacity-50">
            404
          </div>
          <div className="text-6xl mb-4">🧩</div>
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Puzzle Piece Missing!
          </h1>
          <p className="text-xl text-purple-200 max-w-md mx-auto">
            Looks like this page got lost in the puzzle maze. Let's get you back
            to the game!
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button className="puzzle-gradient text-white hover:scale-105 transition-transform">
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="border-purple-400 text-purple-200 hover:bg-purple-400/10"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
