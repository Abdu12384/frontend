import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'


function PageNotFound() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const updateMousePosition = (ev) => {
      setMousePosition({ x: ev.clientX, y: ev.clientY })
    }
    window.addEventListener('mousemove', updateMousePosition)
    return () => {
      window.removeEventListener('mousemove', updateMousePosition)
    }
  }, [])

  const variants = {
    default: {
      x: 0,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      },
    },
    hover: {
      x: (mousePosition.x - window.innerWidth / 2) / 20,
      y: (mousePosition.y - window.innerHeight / 2) / 20,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      },
    },
  }

  return (
     <div className="min-h-screen  bg-gradient-to-br from-gray-50 to-gray-100   flex flex-col items-center justify-center p-4">
      <motion.div
        className="text-center"
        initial="default"
        animate="hover"
        variants={variants}
      >
        <h1 className="text-[12rem] sm:text-[20rem] font-extrabold text-transparent bg-clip-text bg-gradient-to-r dark:from-gray-900 to-primary-foreground  leading-none">
          404
        </h1>
        <p className="mt-4 text-2xl sm:text-3xl font-semibold text-gray-700 dark:from-gray-900">
          Page Not Found
        </p>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400 max-w-md mx-auto">
          Oops! It seems you've wandered into uncharted territory.
        </p>
      </motion.div>
      <div className="mt-8">
        <a href="/" className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-black	 rounded-md hover:bg-primary-dark">
          <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Return Home
        </a>
      </div>
    </div>
);
}

export default PageNotFound;
