
import { Button, ButtonProps } from "@/components/ui/button";
import { useTheme } from '@/contexts/ThemeContext';
import { motion } from 'framer-motion';
import { forwardRef } from 'react';

interface StyledButtonProps extends ButtonProps {
  gradient?: boolean;
  icon?: React.ReactNode;
}

const StyledButton = forwardRef<HTMLButtonElement, StyledButtonProps>(
  ({ children, gradient = false, icon, variant = "default", className = '', ...props }, ref) => {
    const { isDark } = useTheme();

    const getButtonStyles = () => {
      if (gradient || variant === "default") {
        return `
          relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 
          hover:from-blue-700 hover:to-purple-700 text-white border-0
          shadow-lg hover:shadow-2xl shadow-blue-500/25
          before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/20 before:to-transparent 
          before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300
        `;
      }
      
      if (variant === "outline") {
        return isDark 
          ? `border-2 border-gray-600 bg-gray-800/50 hover:bg-gray-700/70 text-gray-200 hover:border-gray-500 backdrop-blur-sm`
          : `border-2 border-gray-300 bg-white/70 hover:bg-gray-50 text-gray-700 hover:border-gray-400 backdrop-blur-sm`;
      }
      
      if (variant === "destructive") {
        return `
          bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 
          text-white border-0 shadow-lg hover:shadow-xl shadow-red-500/25
        `;
      }
      
      return '';
    };

    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        <Button
          ref={ref}
          variant={gradient ? "default" : variant}
          className={`
            relative transition-all duration-300 rounded-xl font-semibold text-base
            px-6 py-3 min-h-[3rem] shadow-lg hover:shadow-xl
            ${getButtonStyles()}
            ${className}
          `}
          {...props}
        >
          <div className="relative flex items-center gap-3 z-10">
            {icon && (
              <motion.div
                initial={{ rotate: 0 }}
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                {icon}
              </motion.div>
            )}
            {children}
          </div>
        </Button>
      </motion.div>
    );
  }
);

StyledButton.displayName = "StyledButton";

export default StyledButton;
