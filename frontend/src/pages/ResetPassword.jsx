import React, { useMemo, useState } from 'react';
import { Container, Paper, TextInput, PasswordInput, Button, Title, Text, Alert, Group } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconAlertCircle } from '@tabler/icons-react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const ResetPassword = () => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [error, setError] = useState('');
  const [verified, setVerified] = useState(false);
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const initialEmail = useMemo(() => params.get('email') || '', [params]);

  const verifyForm = useForm({
    initialValues: { email: initialEmail, code: '' },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      code: (value) => (value.length !== 6 ? 'Code must be 6 digits' : null),
    },
  });

  const resetForm = useForm({
    initialValues: { newPassword: '' },
    validate: {
      newPassword: (value) => (value.length < 7 ? 'Password must be at least 7 characters' : null),
    },
  });

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const handleVerifyCode = async ({ email, code }) => {
    setIsVerifying(true);
    setError('');
    try {
      const response = await fetch(`${BASE_URL}/auth/verify-reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success('Code verified. Enter a new password.');
        setVerified(true);
      } else {
        setError(data.message || 'Verification failed');
        toast.error(data.message || 'Verification failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      toast.error('Network error. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResetPassword = async ({ newPassword }) => {
    setIsResetting(true);
    setError('');
    try {
      const response = await fetch(`${BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: verifyForm.values.email, code: verifyForm.values.code, newPassword }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success('Password reset successful. Please login.');
        navigate('/login');
      } else {
        setError(data.message || 'Reset failed');
        toast.error(data.message || 'Reset failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      toast.error('Network error. Please try again.');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <Container size={420} my={40}>
      <Title align="center" sx={(theme) => ({ fontFamily: `Greycliff CF, ${theme.fontFamily}`, fontWeight: 900 })}>
        Reset Password
      </Title>
      <Text color="dimmed" size="sm" align="center" mt={5}>
        Verify OTP, then set a new password
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        {error && (
          <Alert icon={<IconAlertCircle size={16} />} color="red" mb="md">
            {error}
          </Alert>
        )}

        <form onSubmit={verifyForm.onSubmit(handleVerifyCode)}>
          <TextInput label="Email" placeholder="your@email.com" required {...verifyForm.getInputProps('email')} />
          <TextInput label="OTP Code" placeholder="6-digit code" required mt="md" maxLength={6} {...verifyForm.getInputProps('code')} />
          <Group mt="md">
            <Button type="submit" loading={isVerifying} disabled={verified}>
              Verify Code
            </Button>
            <Button variant="light" onClick={() => navigate(`/forgot-password?email=${encodeURIComponent(verifyForm.values.email)}`)}>
              Resend OTP
            </Button>
          </Group>
        </form>

        {verified && (
          <form onSubmit={resetForm.onSubmit(handleResetPassword)}>
            <PasswordInput label="New Password" placeholder="Enter new password" required mt="xl" {...resetForm.getInputProps('newPassword')} />
            <Button fullWidth mt="md" type="submit" loading={isResetting}>
              Reset Password
            </Button>
          </form>
        )}

        <Text color="dimmed" size="sm" align="center" mt="md">
          Back to{' '}
          <Link to="/login" style={{ color: '#228be6', textDecoration: 'none' }}>
            Login
          </Link>
        </Text>
      </Paper>
    </Container>
  );
};

export default ResetPassword;