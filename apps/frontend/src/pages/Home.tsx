import React from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowRight, LogIn, UserPlus } from "lucide-react"

import { Button } from "@/components/common/Button"
import { ASSETS, ROUTES } from "@/constants/routes"

const smoothEase: [number, number, number, number] = [0.22, 1, 0.36, 1]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: smoothEase,
      staggerChildren: 0.08,
      delayChildren: 0.08,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: smoothEase },
  },
}

const Home: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="relative min-h-screen overflow-hidden bg-brand-gradient">
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, ease: smoothEase }}
        className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-brand-secundario/35 blur-3xl"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, delay: 0.1, ease: smoothEase }}
        className="pointer-events-none absolute -bottom-28 -right-20 h-80 w-80 rounded-full bg-brand-terciario/25 blur-3xl"
      />

      <motion.main
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 mx-auto flex min-h-screen w-full max-w-5xl flex-col items-center justify-center px-6 py-16 text-center"
      >
        <motion.div variants={itemVariants} className="mb-4">
          <img
            src={`${ASSETS.S3_BUCKET_BASE_URL}${ASSETS.IMAGES.LOGO}`}
            alt="Psicaid"
            className="mx-auto h-28 w-28 object-contain md:h-32 md:w-32"
          />
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="text-6xl font-bold tracking-tight text-brand-primario drop-shadow-sm md:text-7xl"
        >
          Psicaid
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="mt-5 max-w-3xl text-3xl font-semibold leading-tight text-brand-primario md:text-5xl"
        >
          Su nuevo aliado en el consultorio
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="mt-12 flex w-full max-w-xl flex-col gap-4 sm:flex-row sm:justify-center"
        >
          <motion.div whileHover={{ y: -2, scale: 1.01 }} whileTap={{ scale: 0.98 }}>
            <Button
              size="lg"
              className="h-12 min-w-52 bg-brand-secundario text-gray-900 hover:bg-brand-secundario/90"
              onClick={() => navigate(ROUTES.REGISTER)}
            >
              Registrarse
            </Button>
          </motion.div>

          <motion.div whileHover={{ y: -2, scale: 1.01 }} whileTap={{ scale: 0.98 }}>
            <Button
              size="lg"
              variant="outline"
              className="h-12 min-w-52 border-brand-primaro/50 bg-brand-primario/70 text-white hover:bg-brand-hover-primario"
              onClick={() => navigate(ROUTES.LOGIN)}
            >
              Iniciar sesion
            </Button>
          </motion.div>
        </motion.div>
      </motion.main>
    </div>
  )
}

export default Home
