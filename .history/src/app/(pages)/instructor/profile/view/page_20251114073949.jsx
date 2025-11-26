"use client";

import { motion } from "framer-motion";

export default function InstructorProfile() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto py-10"
    >
      {/* Header */}
      <div className="flex flex-col items-center">
        <motion.img
          src="/user.jpg"
          className="w-32 h-32 rounded-full"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          whileHover={{ scale: 1.05 }}
        />

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center mt-4"
        >
          <h1 className="text-2xl font-bold">John Instructor</h1>
          <p className="text-gray-500">Full Stack Instructor</p>
        </motion.div>
      </div>

      {/* About */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mt-10 max-w-2xl mx-auto"
      >
        <h2 className="text-xl font-semibold mb-3">About Me</h2>
        <p className="text-gray-600">
          Instructor with 5+ years teaching experience...
        </p>
      </motion.div>

      {/* Courses */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-14"
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 1 },
          show: {
            opacity: 1,
            transition: { staggerChildren: 0.2 }
          }
        }}
      >
        {[1, 2, 3].map((item) => (
          <motion.div
            key={item}
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0 }
            }}
            whileHover={{ scale: 1.03 }}
            className="rounded-xl border p-4"
          >
            <img src="/course.jpg" className="rounded-lg" />
            <h3 className="font-semibold mt-3">Course Title</h3>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
