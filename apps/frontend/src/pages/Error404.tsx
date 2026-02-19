import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES } from "@/constants/routes";

export const Error404 = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [countdown, setCountdown] = useState(10);

  const redirectPath = isAuthenticated ? ROUTES.DASHBOARD : ROUTES.ROOT;

  useEffect(() => {
    const redirectTimer = setTimeout(() => {
      navigate(redirectPath);
    }, 10000);

    const countdownInterval = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => {
      clearTimeout(redirectTimer);
      clearInterval(countdownInterval);
    };
  }, [navigate, redirectPath]);

  return (
    <div 
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'var(--gradient-brand-linear)' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-2xl w-full text-center"
      >
        {/* Error Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="flex justify-center mb-8"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-brand-secundario/20 blur-3xl rounded-full"></div>
            <AlertCircle className="w-32 h-32 text-brand-secundario relative z-10" />
          </div>
        </motion.div>

        {/* 404 Text */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-9xl font-bold text-brand-primario mb-4"
        >
          404
        </motion.h1>

        {/* Error Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="space-y-4 mb-8"
        >
          <h2 className="text-3xl font-semibold text-brand-primario">
            ¡Ups! Página no encontrada
          </h2>
          <p className="text-lg text-brand-primario/70 max-w-md mx-auto">
            La página que estás buscando no existe o ha ocurrido un error.
          </p>
        </motion.div>

        {/* Countdown */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <p className="text-brand-secundario font-medium">
            Redirigiendo {isAuthenticated ? "al dashboard" : "al inicio"} en{" "}
            <span className="text-2xl font-bold">{countdown}</span> segundos...
          </p>
        </motion.div>

        {/* Action Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Link
            to={redirectPath}
            className="inline-flex items-center gap-2 px-8 py-4 bg-brand-primario text-white rounded-lg font-semibold hover:bg-brand-primario/90 transition-colors shadow-lg hover:shadow-xl"
          >
            <Home className="w-5 h-5" />
            {isAuthenticated ? "Volver al dashboard" : "Volver al inicio ahora"}
          </Link>
        </motion.div>

        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-brand-terciario/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-brand-secundario/10 rounded-full blur-3xl"></div>
      </motion.div>
    </div>
  );
};

export default Error404;
