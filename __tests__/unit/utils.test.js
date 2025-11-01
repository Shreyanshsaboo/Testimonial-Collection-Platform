import { cn } from '@/lib/utils'

describe('Utils Functions', () => {
  describe('cn - className merger', () => {
    it('should merge class names correctly', () => {
      const result = cn('text-red-500', 'bg-blue-500')
      expect(result).toContain('text-red-500')
      expect(result).toContain('bg-blue-500')
    })

    it('should handle conflicting tailwind classes', () => {
      const result = cn('text-red-500', 'text-blue-500')
      // tailwind-merge should keep only the last one
      expect(result).toBe('text-blue-500')
    })

    it('should handle conditional classes', () => {
      const isActive = true
      const result = cn('base-class', isActive && 'active-class')
      expect(result).toContain('base-class')
      expect(result).toContain('active-class')
    })

    it('should ignore falsy values', () => {
      const result = cn('text-red-500', false, null, undefined, 'bg-blue-500')
      expect(result).toContain('text-red-500')
      expect(result).toContain('bg-blue-500')
      expect(result).not.toContain('false')
      expect(result).not.toContain('null')
    })

    it('should handle arrays', () => {
      const result = cn(['text-red-500', 'bg-blue-500'])
      expect(result).toContain('text-red-500')
      expect(result).toContain('bg-blue-500')
    })

    it('should handle objects', () => {
      const result = cn({
        'text-red-500': true,
        'bg-blue-500': false,
        'border': true,
      })
      expect(result).toContain('text-red-500')
      expect(result).not.toContain('bg-blue-500')
      expect(result).toContain('border')
    })
  })

  // Additional utility tests if you add more functions
  describe('String sanitization', () => {
    it('should trim whitespace from strings', () => {
      const input = '  Hello World  '
      const result = input.trim()
      expect(result).toBe('Hello World')
    })

    it('should handle empty strings', () => {
      const input = '   '
      const result = input.trim()
      expect(result).toBe('')
    })
  })
})
