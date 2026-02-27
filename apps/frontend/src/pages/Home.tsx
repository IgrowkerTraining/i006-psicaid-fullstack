import React from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"

import { Button } from "@/components/common/Button"
import { ASSETS, ROUTES } from "@/constants/routes"

const smoothEase: [number, number, number, number] = [0.22, 1, 0.36, 1]

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: smoothEase,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: custom * 0.1, ease: smoothEase },
  }),
}

const Home: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={`${ASSETS.S3_BUCKET_BASE_URL}${ASSETS.IMAGES.HOME_IMAGE}`}
          alt="Psychology office"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <motion.main
        initial="hidden"
        animate="visible"
        className="relative z-10 flex min-h-screen items-center justify-center px-4 py-16 sm:px-6 lg:px-8"
      >
        <motion.div
          variants={cardVariants}
          className="w-full max-w-4xl rounded-3xl border border-white/30 bg-[#8B94C8]/40 px-16 py-20 shadow-2xl backdrop-blur-xl sm:px-24 sm:py-24"
        >
          
          <motion.div custom={1} variants={itemVariants} className="mb-6 flex justify-center">
            <img
              src={`${ASSETS.S3_BUCKET_BASE_URL}${ASSETS.IMAGES.LOGO}`}
              alt="Psicaid"
              className="h-24 w-24 object-contain sm:h-28 sm:w-28"
            />
          </motion.div>

          
          <motion.h1
            custom={2}
            variants={itemVariants}
            className="mb-3 text-center text-4xl font-bold tracking-tight text-[#1a1a3e] sm:text-5xl"
          >
            Psicaid
          </motion.h1>

          
          <motion.p
            custom={3}
            variants={itemVariants}
            className="mb-10 text-center text-base font-medium text-white sm:text-lg"
          >
            Su nuevo aliado en el consultorio
          </motion.p>

          
          <motion.div custom={4} variants={itemVariants} className="flex justify-center gap-6">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                size="lg"
                className="h-12 min-w-48 rounded-md bg-brand-primario text-white hover:bg-brand-hover-primario"
                onClick={() => navigate(ROUTES.REGISTER)}
              >
                Registrarse
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                size="lg"
                className="h-11 min-w-48 rounded-md bg-brand-primario text-white hover:bg-brand-hover-primario"
                onClick={() => navigate(ROUTES.LOGIN)}
              >
                Inicio de sesión
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.main>
    </div>
  )
}

export default Home
