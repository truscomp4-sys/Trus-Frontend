'use client'

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import type { VisionMissionContent } from "@/lib/aboutContent";

const VisionMission = ({ content }: { content: VisionMissionContent }) => {
    const { vision, mission } = content;
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const visionY = useTransform(scrollYProgress, [0, 0.5], [100, 0]);
    const missionY = useTransform(scrollYProgress, [0.4, 0.9], [100, 0]);
    const visionScale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1]);
    const missionScale = useTransform(scrollYProgress, [0.4, 0.9], [0.8, 1]);

    return (
        <section ref={containerRef} className="relative py-32 bg-background overflow-hidden">
            {/* Background Kinetic Elements */}
            <div className="absolute inset-0 pointer-events-none opacity-20">
                <motion.div
                    style={{ rotate: useTransform(scrollYProgress, [0, 1], [0, 90]) }}
                    className="absolute -top-1/4 -left-1/4 w-full h-full border-[1px] border-primary/30 rounded-full"
                />
                <motion.div
                    style={{ rotate: useTransform(scrollYProgress, [0, 1], [0, -90]) }}
                    className="absolute -bottom-1/4 -right-1/4 w-full h-full border-[1px] border-accent/30 rounded-full"
                />
            </div>

            <div className="section-container relative z-10">
                <div className="flex flex-col gap-32">
                    {/* Vision: The Convergence */}
                    <motion.div
                        style={{ y: visionY, scale: visionScale }}
                        className="max-w-4xl mx-auto text-center"
                    >
                        <span className="text-primary font-display font-medium tracking-[0.3em] uppercase mb-8 block text-sm">
                            {vision.eyebrow}
                        </span>
                        <div className="relative">
                            <h3 className="text-5xl md:text-7xl font-display font-bold leading-tight tracking-tighter">
                                {vision.heading_prefix} <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-warning">{vision.heading_highlight}</span> {vision.heading_suffix}
                            </h3>
                            <motion.div
                                className="absolute inset-0 blur-3xl bg-primary/5 -z-10"
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 4, repeat: Infinity }}
                            />
                        </div>
                        <p className="mt-8 text-xl text-muted-foreground/80 leading-relaxed font-light">
                            {vision.body}
                        </p>
                    </motion.div>

                    {/* Mission: The Engine */}
                    <motion.div
                        style={{ y: missionY, scale: missionScale }}
                        className="max-w-4xl mx-auto text-center"
                    >
                        <span className="text-accent font-display font-medium tracking-[0.3em] uppercase mb-8 block text-sm">
                            {mission.eyebrow}
                        </span>
                        <h3 className="text-5xl md:text-7xl font-display font-bold leading-tight tracking-tighter">
                            {mission.heading_prefix} <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary">{mission.heading_highlight}</span> {mission.heading_suffix}
                        </h3>
                        <p className="mt-8 text-xl text-muted-foreground/80 leading-relaxed font-light">
                            {mission.body}
                        </p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default VisionMission;
