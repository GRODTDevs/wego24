
import { supabase } from "@/integrations/supabase/client";

// Input sanitization utilities
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
};

export const sanitizeEmail = (email: string): string => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const sanitized = sanitizeInput(email.toLowerCase());
  return emailRegex.test(sanitized) ? sanitized : '';
};

export const sanitizePhoneNumber = (phone: string): string => {
  return phone.replace(/[^\d+\-\s()]/g, '').trim();
};

// Rate limiting utilities
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export const checkRateLimit = (identifier: string, maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000): boolean => {
  const now = Date.now();
  const key = `rate_limit_${identifier}`;
  
  const current = rateLimitStore.get(key);
  
  if (!current || now > current.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (current.count >= maxAttempts) {
    return false;
  }
  
  current.count++;
  return true;
};

// Secure API key generation
export const generateSecureApiKey = (): string => {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const segments = [];
  
  for (let i = 0; i < 4; i++) {
    let segment = '';
    for (let j = 0; j < 8; j++) {
      segment += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    segments.push(segment);
  }
  
  return segments.join('-').toUpperCase();
};

// Security event logging
export const logSecurityEvent = async (
  action: string,
  resourceType: string,
  resourceId?: string,
  details?: Record<string, any>
) => {
  try {
    const user = (await supabase.auth.getUser()).data.user;
    
    await supabase.rpc('log_security_event', {
      p_user_id: user?.id || null,
      p_action: action,
      p_resource_type: resourceType,
      p_resource_id: resourceId || null,
      p_details: details ? JSON.stringify(details) : null
    });
  } catch (error) {
    console.error('Failed to log security event:', error);
  }
};

// File upload validation
export const validateFileUpload = (file: File): { valid: boolean; error?: string } => {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'application/pdf',
    'text/plain'
  ];

  if (file.size > maxSize) {
    return { valid: false, error: 'File size exceeds 10MB limit' };
  }

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'File type not allowed' };
  }

  // Check for suspicious file names
  const suspiciousPatterns = [
    /\.php$/i,
    /\.jsp$/i,
    /\.asp$/i,
    /\.js$/i,
    /\.html$/i,
    /\.exe$/i
  ];

  if (suspiciousPatterns.some(pattern => pattern.test(file.name))) {
    return { valid: false, error: 'File type not allowed for security reasons' };
  }

  return { valid: true };
};

// Content Security Policy headers
export const getSecurityHeaders = () => {
  return {
    'Content-Security-Policy': 
      "default-src 'self'; " +
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
      "style-src 'self' 'unsafe-inline'; " +
      "img-src 'self' data: https:; " +
      "font-src 'self' data:; " +
      "connect-src 'self' https://hjwocoqipxrqkyhnmcuw.supabase.co wss://hjwocoqipxrqkyhnmcuw.supabase.co; " +
      "frame-ancestors 'none';",
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=()'
  };
};
