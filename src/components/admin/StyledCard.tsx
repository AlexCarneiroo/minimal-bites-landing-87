
import { Card, CardContent } from "@/components/ui/card";
import { useTheme } from '@/contexts/ThemeContext';
import { motion } from 'framer-motion';

interface StyledCardProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

export default function StyledCard({ children, title, className = '' }: StyledCardProps) {
  const { isDark } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
      className="group"
    >
      <Card className={`relative overflow-hidden border-0 shadow-2xl backdrop-blur-lg transition-all duration-500 group-hover:shadow-3xl ${
        isDark 
          ? 'bg-gradient-to-br from-gray-800/90 via-gray-800/70 to-gray-900/90 border border-gray-700/50' 
          : 'bg-gradient-to-br from-white/90 via-white/70 to-gray-50/90 border border-gray-200/50'
      } ${className}`}>
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-50"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-400/10 to-transparent rounded-full blur-2xl"></div>
        
        <CardContent className="relative p-8">
          {title && (
            <motion.h3 
              className={`text-2xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {title}
            </motion.h3>
          )}
          {children}
        </CardContent>
      </Card>
    </motion.div>
  );
}
