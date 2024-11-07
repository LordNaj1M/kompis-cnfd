import {
  Box,
  Button,
  Input,
  FormControl,
  FormLabel,
  Card,
  CardBody,
  Stack,
  Flex,
  Alert,
  AlertIcon,
  Link,
  AbsoluteCenter,
  Checkbox,
  Text,
  useToast
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

const Login = () => {
  const { login, register, resetPassword, setError } = useAuth();
  const toast = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [security_answer, setSecurityAnswer] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [activeTab, setActiveTab] = useState('login');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  // Reset form ketika pindah tab
  useEffect(() => {
    setPassword('');
    setSecurityAnswer('');
    setAgreeToTerms(false);
    setError('');
  }, [activeTab, setError]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeToTerms) {
      toast({
        title: 'Error',
        description: 'Please agree to the terms and conditions',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    const success = await register({ name, email, password, security_answer });
    if (success) {
      toast({
        title: 'Success',
        description: 'Registration successful! Please login.',
        status: 'success',
        duration: 3000,
      });
      setActiveTab('login');
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeToTerms) {
      toast({
        title: 'Error',
        description: 'Please agree to the terms',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    const success = await resetPassword({ email, newPassword, security_answer });
    if (success) {
      toast({
        title: 'Success',
        description: 'Password has been reset! Please login.',
        status: 'success',
        duration: 3000,
      });
      handleCancel();
    }
  };

  const handleCancel = () => {
    setShowResetPassword(false);
    setNewPassword('');
    setSecurityAnswer('');
    setAgreeToTerms(false);
    setErrorMessage('');
    setActiveTab('login');
  };

  const loginForm = () => (
    <form onSubmit={handleLogin} name='loginForm'>
      <Stack spacing={4}>
        <FormControl>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            autoComplete="email"
          />
        </FormControl>

        <FormControl>
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </FormControl>

        {errorMessage && (
          <Alert status="error">
            <AlertIcon />
            {errorMessage}
          </Alert>
        )}

        <Button
          type="submit"
          w="full"
          bg="black"
          color="white"
          _hover={{ bg: 'gray.800' }}
        >
          Sign In
        </Button>

        <Box textAlign="center">
          <Link
            fontSize="sm"
            color="gray.600"
            _hover={{ textDecoration: 'underline' }}
            onClick={() => setShowResetPassword(true)}
          >
            Forgot password?
          </Link>
        </Box>
      </Stack>
    </form>
  );

  const registerForm = () => (
    <form onSubmit={handleRegister} name='registerForm'>
      <Stack spacing={4}>
        <FormControl>
          <FormLabel>Name</FormLabel>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            required
            autoComplete="name"
          />
        </FormControl>

        <FormControl>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            autoComplete="email"
          />
        </FormControl>

        <FormControl>
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </FormControl>

        <FormControl>
          <FormLabel>Security Question</FormLabel>
          <Text fontSize="sm" mb={2}>Apa pekerjaan impian Anda sewaktu kecil?</Text>
          <Input
            type="text"
            value={security_answer}
            onChange={(e) => setSecurityAnswer(e.target.value)}
            placeholder="Enter your answer"
            required
          />
        </FormControl>
        
        <FormControl>
          <Checkbox
            isChecked={agreeToTerms}
            onChange={(e) => setAgreeToTerms(e.target.checked)}
          >
            Saya yakin dengan data yang diisi
          </Checkbox>
        </FormControl>

        {errorMessage && (
          <Alert status="error">
            <AlertIcon />
            {errorMessage}
          </Alert>
        )}

        <Button
          type="submit"
          w="full"
          bg="black"
          color="white"
          _hover={{ bg: 'gray.800' }}
        >
          Register
        </Button>
      </Stack>
    </form>
  );

  const resetPasswordForm = () => (
    <Box>
      <Text fontSize="xl" mb={4}>Forgot your password? please fill this form</Text>
      <form onSubmit={handleResetPassword} name='resetPasswordForm'>
        <Stack spacing={4}>
          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </FormControl>

          <FormControl>
            <FormLabel>New Password</FormLabel>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </FormControl>

          <FormControl>
            <FormLabel>Verification Question</FormLabel>
            <Text fontSize="sm" mb={2}>Apa pekerjaan impian Anda sewaktu kecil?</Text>
            <Input
              type="text"
              value={security_answer}
              onChange={(e) => setSecurityAnswer(e.target.value)}
              placeholder="Enter your answer"
              required
            />
          </FormControl>

          <FormControl>
            <Checkbox
              isChecked={agreeToTerms}
              onChange={(e) => setAgreeToTerms(e.target.checked)}
            >
              Saya yakin dengan data yang diisi
            </Checkbox>
          </FormControl>

          {errorMessage && (
            <Alert status="error">
              <AlertIcon />
              {errorMessage}
            </Alert>
          )}

          <Flex justifyContent="space-between" mt={4}>
            <Button
              variant="ghost"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              bg="black"
              color="white"
              _hover={{ bg: 'gray.800' }}
            >
              Reset Password
            </Button>
          </Flex>
        </Stack>
      </form>
    </Box>
  );

  return (
    <Box minH="100vh" bg="gray.50">      
      <AbsoluteCenter>
        <Card maxW="400px" w="full" boxShadow="md" borderRadius="md">
          <CardBody>
            {!showResetPassword && (
              <Flex mb={6}>
                {['login', 'register'].map((tab) => (
                  <Button
                    key={tab}
                    flex="1"
                    borderRadius="0"
                    bg={activeTab === tab ? 'black' : 'white'}
                    color={activeTab === tab ? 'white' : 'black'}
                    onClick={() => {
                      setActiveTab(tab);
                      setErrorMessage('');
                      setShowResetPassword(false);
                    }}
                    _hover={{ bg: activeTab === tab ? 'gray.800' : 'gray.100' }}
                  >
                    {tab.toUpperCase()}
                  </Button>
                ))}
              </Flex>
            )}

            {showResetPassword ? (
              resetPasswordForm()
            ) : (
              activeTab === 'login' ? loginForm() : registerForm()
            )}
          </CardBody>
        </Card>
      </AbsoluteCenter>
    </Box>
  );
};

export default Login;