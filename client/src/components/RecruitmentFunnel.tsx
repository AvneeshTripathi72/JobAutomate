import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface FunnelStep {
  icon: LucideIcon;
  title: string;
  description: string;
  percentage: number;
}

interface RecruitmentFunnelProps {
  steps: FunnelStep[];
}

export default function RecruitmentFunnel({ steps }: RecruitmentFunnelProps) {
  const maxWidth = 100;
  const minWidth = 40;
  const stepHeight = 80;
  const gap = 8;

  const getStepWidth = (stepIndex: number) => {
    return steps[stepIndex].percentage;
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-8" data-testid="recruitment-funnel">
      <div className="relative">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isLastStep = index === steps.length - 1;
          const currentWidth = getStepWidth(index);
          const nextWidth = index < steps.length - 1 ? getStepWidth(index + 1) : currentWidth;
          
          const offsetX = (100 - currentWidth) / 2;
          
          const topLeft = (maxWidth - currentWidth) / 2;
          const topRight = topLeft + currentWidth;
          const bottomLeft = (maxWidth - nextWidth) / 2;
          const bottomRight = bottomLeft + nextWidth;
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative mb-2"
              style={{ height: `${stepHeight}px` }}
              data-testid={`funnel-step-${index}`}
            >
              <div className="flex items-center gap-4 h-full">
                <div 
                  className="relative h-full w-full transition-all duration-500"
                >
                  <svg
                    className="absolute inset-0 w-full h-full"
                    viewBox={`0 0 ${maxWidth} ${stepHeight}`}
                    preserveAspectRatio="none"
                  >
                    <defs>
                      <linearGradient id={`gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                        <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.6} />
                      </linearGradient>
                      <clipPath id={`clip-${index}`}>
                        <path d={`
                          M ${topLeft} 0
                          L ${topRight} 0
                          L ${bottomRight} ${stepHeight}
                          L ${bottomLeft} ${stepHeight}
                          Z
                        `} />
                      </clipPath>
                    </defs>
                    
                    <motion.path
                      d={`
                        M ${topLeft} 0
                        L ${topRight} 0
                        L ${bottomRight} ${stepHeight}
                        L ${bottomLeft} ${stepHeight}
                        Z
                      `}
                      fill={`url(#gradient-${index})`}
                      stroke="hsl(var(--primary))"
                      strokeWidth="2"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 0.8, delay: index * 0.15 }}
                    />
                    
                    <foreignObject
                      x="0"
                      y="0"
                      width={maxWidth}
                      height={stepHeight}
                      clipPath={`url(#clip-${index})`}
                    >
                      <div className="w-full h-full flex items-center justify-between px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary-foreground/90 flex items-center justify-center flex-shrink-0">
                            <Icon className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-semibold text-primary-foreground/80 bg-primary-foreground/20 px-2 py-0.5 rounded" data-testid={`funnel-step-number-${index}`}>
                                Step {index + 1}
                              </span>
                            </div>
                            <h3 className="text-lg font-bold text-primary-foreground" data-testid={`funnel-title-${index}`}>
                              {step.title}
                            </h3>
                          </div>
                        </div>
                        
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.5, delay: index * 0.15 + 0.3 }}
                          className="text-right"
                        >
                          <div className="text-2xl font-bold text-primary-foreground" data-testid={`funnel-percentage-${index}`}>
                            {step.percentage}%
                          </div>
                        </motion.div>
                      </div>
                    </foreignObject>
                  </svg>
                </div>
              </div>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.15 + 0.2 }}
                className="mt-2 text-center px-4"
              >
                <p className="text-sm text-muted-foreground max-w-2xl mx-auto" data-testid={`funnel-description-${index}`}>
                  {step.description}
                </p>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
