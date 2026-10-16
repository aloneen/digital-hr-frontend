import { useRef, useState } from 'react';
import {
  Box,
  Button,
  Chip,
  OutlinedInput,
  Typography,
} from '@mui/material';
import { AccessTime } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';

export default function EmailVerificationPage() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(['8', '', '', '']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      navigate('/reset-password');
    }, 600);
  };

  return (
    <AuthLayout
      illustrationSrc="/auth/email-verify-illustration.png"
      illustrationAlt="Email Verification Illustration"
    >
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 800, color: '#111827', mb: 1, fontSize: '1.75rem' }}>
          Email OTP Verification
        </Typography>
        <Typography variant="body2" sx={{ color: '#6B7280', fontSize: '0.9rem' }}>
          OTP sent to your Email Address ending ******doe@example.com
        </Typography>
      </Box>

      <Box component="form" onSubmit={handleVerify}>
        {/* OTP 4 boxes */}
        <Box sx={{ display: 'flex', gap: { xs: 1.5, sm: 2 }, justifyContent: 'space-between', mb: 2 }}>
          {otp.map((digit, idx) => (
            <OutlinedInput
              key={idx}
              inputRef={inputRefs[idx]}
              value={digit}
              onChange={(e) => handleOtpChange(idx, e.target.value)}
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => handleKeyDown(idx, e)}
              inputProps={{
                maxLength: 1,
                style: {
                  textAlign: 'center',
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  color: '#111827',
                  padding: '14px 0',
                },
              }}
              sx={{
                width: { xs: 56, sm: 68 },
                height: { xs: 56, sm: 68 },
                borderRadius: 2,
                bgcolor: '#FFFFFF',
                '& fieldset': {
                  borderColor: idx === 0 || digit ? '#FF5B22' : '#E5E7EB',
                  borderWidth: idx === 0 || digit ? 2 : 1,
                },
                '&:hover fieldset': { borderColor: '#FF5B22' },
                '&.Mui-focused fieldset': { borderColor: '#FF5B22' },
              }}
            />
          ))}
        </Box>

        {/* Timer chip */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2.5 }}>
          <Chip
            icon={<AccessTime sx={{ fontSize: '14px !important', color: '#EF4444' }} />}
            label="09:59 s"
            size="small"
            sx={{
              bgcolor: '#FEF2F2',
              color: '#EF4444',
              fontWeight: 700,
              fontSize: '0.8rem',
              borderRadius: 1.5,
              px: 0.5,
            }}
          />
        </Box>

        {/* Resend text */}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="body2" sx={{ color: '#6B7280', fontSize: '0.875rem' }}>
            Didn't get the OTP?{' '}
            <Typography
              component="span"
              sx={{
                color: '#FF5B22',
                fontWeight: 700,
                cursor: 'pointer',
                '&:hover': { textDecoration: 'underline' },
              }}
              onClick={() => alert('OTP code resent to your email')}
            >
              Resend OTP
            </Typography>
          </Typography>
        </Box>

        {/* Action Button */}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={isSubmitting}
          sx={{
            bgcolor: '#FF5B22',
            '&:hover': { bgcolor: '#E04815' },
            color: '#FFFFFF',
            py: 1.3,
            borderRadius: 2,
            textTransform: 'none',
            fontSize: '0.95rem',
            fontWeight: 700,
            boxShadow: 'none',
          }}
        >
          {isSubmitting ? 'Verifying...' : 'Verify & Proceed'}
        </Button>
      </Box>
    </AuthLayout>
  );
}
