import React from 'react'
import { motion } from "framer-motion";
import { recentActivity } from '@/Constants/InstructorContent';
function RecentActivity() {
    return (
        <motion.div

            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="rounded-xl bg-foreground/5 p-5 shadow-sm w-full mt-4">
            <h2 className="text-lg font-semibold mb-4">Recent Student Activity</h2>
            <div className="flex flex-col gap-3">
                {recentActivity.map((reactive, index) => {


                    return (
                        <motion.div
                            key={index}
                            whileHover={{
                                scale: 1.03,
                                boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
                                transition: { type: "spring", stiffness: 300, damping: 20 },
                            }}
                            className="flex items-center gap-3 rounded-xl bg-background/60 p-4 cursor-pointer"
                        >
                            <img src="https://logodix.com/logo/649370.png"
                                alt={reactive.name}
                                className="w-7 h-7 object-cover rounded-full" />
                            <div className="flex flex-col gap-2">
                                <p className=" text-foreground/80"><span className='font-bold mr-2'>{reactive.name}</span>{reactive.text}</p>
                        <span className='text-sm text-foreground/60'>{reactive.time}</span>
                            </div>
                            
                        </motion.div>
                    );
                })}
            </div>
        </motion.div>
    )
}

export default RecentActivity