import React, { useState } from 'react';
import { Container, Paper, TextInput, Button, Title, Text, Alert } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconAlertCircle } from '@tabler/icons-react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      email: ''
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email')
    }
  });

  const handleSubmit = async ({ email }) => {
    setIsLoading(true);
    setError('');

    try {
      const BASE_URL = import.meta.env.VITE_API_BASE_URL;
      const response = await fetch(`${BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await response.json();

      if (response.ok) {
        toast.success('If this email exists, an OTP has been sent');
        navigate(`/reset-password?email=${encodeURIComponent(email)}`);
      } else {
        setError(data.message || 'Request failed');
        toast.error(data.message || 'Request failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      toast.error('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container size={420} my={40}>
      <Title align="center" sx={(theme) => ({ fontFamily: `Greycliff CF, ${theme.fontFamily}`, fontWeight: 900 })}>
        Forgot Password
      </Title>
      <Text color="dimmed" size="sm" align="center" mt={5}>
        Enter your email to receive an OTP
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        {error && (
          <Alert icon={<IconAlertCircle size={16} />} color="red" mb="md">
            {error}
          </Alert>
        )}

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput label="Email" placeholder="your@email.com" required {...form.getInputProps('email')} />
          <Button fullWidth mt="xl" type="submit" loading={isLoading}>
            Send OTP
          </Button>
        </form>

        <Text color="dimmed" size="sm" align="center" mt="md">
          Remembered your password?{' '}
          <Link to="/login" style={{ color: '#228be6', textDecoration: 'none' }}>
            Back to login
          </Link>
        </Text>
      </Paper>
    </Container>
  );
};

export default ForgotPassword;