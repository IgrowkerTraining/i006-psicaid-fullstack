import * as React from "react"
import { motion } from "framer-motion"

import { ASSETS } from "@/constants/routes"

type AuthSplitLayoutProps = {
  eyebrow: string
  description: string
  children: React.ReactNode
  footer: React.ReactNode
}

const smoothEase: [number, number, number, number] = [0.22, 1, 0.36, 1]

export function AuthSplitLayout({
  eyebrow,
  description,
  children,
  footer,
}: AuthSplitLayoutProps) {
  return (
    <div className="min-h-screen bg-brand-gradient p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: smoothEase }}
        className="mx-auto grid min-h-[90vh] w-full max-w-6xl overflow-hidden rounded-2xl border border-brand-secundario/30 bg-brand-acento md:grid-cols-2"
      >
        <motion.div
          initial={{ opacity: 0, x: -34 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, delay: 0.1, ease: smoothEase }}
          className="relative hidden md:block"
        >
          <img
            src={`${ASSETS.S3_BUCKET_BASE_URL}${ASSETS.IMAGES.AUTH_IMAGE}`}
            alt="Psychology office"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/10" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 34 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, delay: 0.15, ease: smoothEase }}
          className="flex items-center justify-center p-6 sm:p-10"
        >
          <div className="w-full max-w-md">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3, ease: smoothEase }}
              className="mb-8 flex flex-col items-center text-center"
            >
              <img
                src={`${ASSETS.S3_BUCKET_BASE_URL}${ASSETS.IMAGES.LOGO}`}
                alt="Psicaid logo"
                className="mb-4 h-14 w-14 object-contain"
              />
              <h1 className="text-4xl font-bold text-gray-900">Psicaid</h1>
              <p className="mt-3 text-sm text-gray-900/70">{description}</p>
            </motion.div>

            {children}

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.45, ease: smoothEase }}
              className="mt-8 text-center text-sm text-gray-900/70"
            >
              {footer}
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
