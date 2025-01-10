import { ReactNode } from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: 'primary' | 'secondary'
  children: ReactNode
}

export const Button = ({ variant = 'primary', children, className = '', ...props }: ButtonProps) => {
  return (
    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className={`btn btn-${variant} ${className}`} {...props}>
      {children}
    </motion.button>
  )
}
