
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useTheme } from '@/contexts/ThemeContext';
import { motion } from 'framer-motion';
import { forwardRef } from 'react';

interface StyledTextareaProps extends React.ComponentProps<typeof Textarea> {
  label?: string;
}

const StyledTextarea = forwardRef<HTMLTextAreaElement, StyledTextareaProps>(
  ({ label, className = '', ...props }, ref) => {
    const { isDark } = useTheme();

    return (
      <motion.div 
        className="space-y-3"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        {label && (
          <Label className={`text-sm font-semibold ${
            isDark ? 'text-gray-200' : 'text-gray-700'
          }`}>
            {label}
          </Label>
        )}
        <div className="relative group">
          <Textarea
            ref={ref}
            className={`
              relative transition-all duration-300 border-2 backdrop-blur-sm
              px-4 py-3 text-base min-h-[120px] resize-none
              ${isDark 
                ? 'bg-gray-800/50 border-gray-600 text-gray-100 placeholder:text-gray-400 focus:border-blue-500 focus:bg-gray-800/70 hover:bg-gray-800/60' 
                : 'bg-white/70 border-gray-200 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:bg-white/90 hover:bg-white/80'
              }
              focus:ring-4 focus:ring-blue-500/20 focus:outline-none
              shadow-lg hover:shadow-xl group-focus-within:shadow-2xl
              rounded-xl font-medium
              ${className}
            `}
            {...props}
          />
          <div className={`absolute inset-0 rounded-xl border-2 border-transparent bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none`}></div>
        </div>
      </motion.div>
    );
  }
);

StyledTextarea.displayName = "StyledTextarea";

export default StyledTextarea;
