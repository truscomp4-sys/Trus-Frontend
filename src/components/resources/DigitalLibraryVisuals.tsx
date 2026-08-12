'use client'

import { motion } from "framer-motion";
import { FileText, Search, Database } from "lucide-react";

export const DigitalLibraryVisuals = () => {
    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* 1. Floating Document Cards (Bottom to Top) */}
            {[
                { left: "15%", rotate: 2, duration: 18, delay: 0 },
                { left: "30%", rotate: -4, duration: 22, delay: 3 },
                { left: "50%", rotate: 5, duration: 16, delay: 6 },
                { left: "68%", rotate: -2, duration: 24, delay: 2 },
                { left: "82%", rotate: 4, duration: 20, delay: 5 },
                { left: "40%", rotate: -3, duration: 19, delay: 8 },
            ].map((doc, i) => (
                <motion.div
                    key={`doc-${i}`}
                    className="absolute bg-white/40 backdrop-blur-sm border border-white/60 p-3 rounded-lg shadow-sm flex flex-col gap-2 w-24 md:w-32"
                    style={{
                        left: doc.left,
                        bottom: "-20%",
                    }}
                    animate={{
                        y: [-50, -600],
                        rotate: [doc.rotate, doc.rotate],
                        opacity: [0, 0.6, 0]
                    }}
                    transition={{
                        duration: doc.duration,
                        repeat: Infinity,
                        ease: "linear",
                        delay: doc.delay
                    }}
                >
                    {/* Abstract Content Lines */}
                    <div className="h-2 w-1/2 bg-gray-200 rounded-full" />
                    <div className="h-2 w-full bg-gray-100 rounded-full" />
                    <div className="h-2 w-3/4 bg-gray-100 rounded-full" />

                    {/* Icon Accent */}
                    <div className="absolute top-2 right-2 text-primary/40">
                        <FileText size={14} />
                    </div>
                </motion.div>
            ))}

            {/* 2. Structured Data Streams (Horizontal Flow) */}
            {[...Array(3)].map((_, i) => (
                <motion.div
                    key={`stream-${i}`}
                    className="absolute h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent w-full"
                    style={{ top: `${30 + i * 20}%` }}
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }} // Flow left to right
                    transition={{
                        duration: 8 + i * 4,
                        repeat: Infinity,
                        ease: "linear",
                        delay: i * 2
                    }}
                />
            ))}

            {/* 3. Search / Index Nodes (Pulsing Points) */}
            <motion.div
                className="absolute top-[35%] right-[15%] flex items-center gap-2 opacity-20 text-primary"
                animate={{ opacity: [0.1, 0.4, 0.1] }}
                transition={{ duration: 4, repeat: Infinity }}
            >
                <Search size={48} strokeWidth={1.5} />
            </motion.div>

            <motion.div
                className="absolute bottom-[25%] left-[10%] flex items-center gap-2 opacity-10 text-primary"
                animate={{ opacity: [0.1, 0.3, 0.1] }}
                transition={{ duration: 5, repeat: Infinity, delay: 1 }}
            >
                <Database size={64} strokeWidth={1} />
            </motion.div>
        </div>
    );
};
