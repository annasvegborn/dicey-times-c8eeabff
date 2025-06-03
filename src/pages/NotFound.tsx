
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-parchment-100">
      <div className="text-center bg-parchment-50 p-8 rounded-3xl border-4 border-parchment-500 shadow-2xl">
        <h1 className="text-4xl font-bold mb-4 text-parchment-900 font-serif">404</h1>
        <p className="text-xl text-parchment-700 mb-4 font-serif">Oops! Page not found</p>
        <a href="/" className="text-parchment-500 hover:text-parchment-700 underline font-serif">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
