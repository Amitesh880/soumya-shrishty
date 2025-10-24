import React, { useState } from 'react';
import { Container, Paper, TextInput, PasswordInput, Button, Title, Text, Alert } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconAlertCircle } from '@tabler/icons-react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import UserDetailContext from '../context/UserDetailContext';
import { useContext } from 'react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setUserDetails } = useContext(UserDetailContext);
  const { login } = useAuth();

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) => (value.length < 6 ? 'Password must be at least 6 characters' : null),
    },
  });

  const handleLogin = async (values) => {
    setIsLoading(true);
    setError('');

    try {
      const result = await login(values.email, values.password);

      if (result.success) {
        // Update user details context
        setUserDetails({
          token: result.token,
          user: result.user,
          Favourites: [],
          bookings: [],
        });

        toast.success('Login successful!');
        navigate('/');
      } else {
        setError(result.message || 'Login failed');
        toast.error(result.message || 'Login failed');
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
      <Title
        align="center"
        sx={(theme) => ({ fontFamily: `Greycliff CF, ${theme.fontFamily}`, fontWeight: 900 })}
      >
        Welcome Back
      </Title>
      <Text color="dimmed" size="sm" align="center" mt={5}>
        Sign in to your account
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        {error && (
          <Alert icon={<IconAlertCircle size={16} />} color="red" mb="md">
            {error}
          </Alert>
        )}

        <form onSubmit={form.onSubmit(handleLogin)}>
          <TextInput
            label="Email"
            placeholder="your@email.com"
            required
            {...form.getInputProps('email')}
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            required
            mt="md"
            {...form.getInputProps('password')}
          />

          <Text size="sm" align="right" mt="xs">
            <Link to="/forgot-password" style={{ color: '#228be6', textDecoration: 'none' }}>
              Forgot password?
            </Link>
          </Text>

          <Button fullWidth mt="xl" type="submit" loading={isLoading}>
            Sign In
          </Button>
        </form>

        <Text color="dimmed" size="sm" align="center" mt="md">
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#228be6', textDecoration: 'none' }}>
            Create one here
          </Link>
        </Text>
      </Paper>
    </Container>
  );
};

export default Login;
