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
  Checkbox,
  Text,
  useToast,
  Heading,
  useColorModeValue
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'framer-motion';

const Login = () => {
  const { login, register, resetPassword, setError, error } = useAuth();
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
  
  // Warna-warna responsif
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.200');
  const buttonBoxBorder = useColorModeValue('gray.200', 'gray.700');
  const buttonHover = useColorModeValue('gray.50', 'gray.900');

  // Reset form ketika pindah tab
  useEffect(() => {
    setPassword('');
    setSecurityAnswer('');
    setAgreeToTerms(false);
    setError('');
  }, [activeTab, setError]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // eslint-disable-next-line no-async-promise-executor
    const loginPromise = new Promise(async (resolve, reject) => {
      try {
        await new Promise((res) => setTimeout(res, 2000));

        const success = await login(email, password);
        if (success) {
          resolve(true);
        } else {
          reject(error);
        }
      } catch (error) {
        reject(error);
      }
    });

    toast.promise(loginPromise, {
      loading: {title: 'Logging in', description: 'Please wait while we log you in.',},
      success: {title: 'Login Successful', description: 'Welcome back!', duration: 3000, isClosable: true},
      error: {title: 'Login Failed', description: 'An error occurred during login: ' + error, duration: 5000, isClosable: true},
    });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!agreeToTerms) {
      toast({
        title: 'Error',
        description: 'Please agree to the terms and conditions',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // eslint-disable-next-line no-async-promise-executor
    const registerPromise = new Promise(async (resolve, reject) => {
      try {
        await new Promise((res) => setTimeout(res, 2000));

        const success = await register({ name, email, password, security_answer });
        if (success) {
          resolve(true);
          setActiveTab('login');
        } else {
          reject(error);
        }
      } catch (error) {
        reject(error);
      }
    });

    toast.promise(registerPromise, {
      loading: {title: 'Registration Process', description: 'Please wait while we register you.',},
      success: {title: 'Registration Successful', description: 'You can now log in with your new account.', duration: 3000, isClosable: true},
      error: {title: 'Registration Failed', description: 'An error occurred during register: ' + error, duration: 5000, isClosable: true},
    });
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeToTerms) {
      toast({
        title: 'Error',
        description: 'Please agree to the terms',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // eslint-disable-next-line no-async-promise-executor
    const registerPromise = new Promise(async (resolve, reject) => {
      try {
        await new Promise((res) => setTimeout(res, 2000));

        const success = await resetPassword({ email, newPassword, security_answer });
        if (success) {
          resolve(true);
          handleCancel();
        } else {
          reject(error);
        }
      } catch (error) {
        reject(error);
      }
    });

    toast.promise(registerPromise, {
      loading: {title: 'Reset Password Process', description: 'Please wait while we reset your password.',},
      success: {title: 'Password Reset Successful', description: 'You can now log in with your new password.', duration: 3000, isClosable: true},
      error: {title: 'Password Reset Failed', description: 'An error occurred during reset password: ' + error, duration: 5000, isClosable: true},
    });
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
            _hover={{ color:"blue.500 ", textDecoration: 'underline' }}
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
      <Heading fontSize="xl" mb={4}>Forgot your password?<br/>please fill this form</Heading>
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
    <Box 
      minH="100vh" 
      bg={bgColor} 
      display="flex" 
      alignItems="center" 
      justifyContent="center" 
      p={[4, 6, 8]}
    >      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Card 
          maxW="450px" 
          w="full" 
          boxShadow="xl" 
          borderRadius="xl" 
          bg={cardBg}
          overflow="hidden"
        >
          <CardBody p={[4, 6, 8]}>
            {!showResetPassword && (
              <Flex 
                mb={6} 
                borderBottom="2px" 
                borderColor={buttonBoxBorder}
                pb={2}
              >
                {['login', 'register'].map((tab) => (
                  <Button
                    key={tab}
                    flex="1"
                    variant="ghost"
                    borderBottom={activeTab === tab ? '2px solid' : 'none'}
                    borderColor={activeTab === tab ? 'blue.500' : 'transparent'}
                    bg={activeTab === tab ? 'gray.100' : 'transparent'}
                    color={activeTab === tab ? 'blue.500' : textColor}
                    onClick={() => {
                      setActiveTab(tab);
                      setErrorMessage('');
                      setShowResetPassword(false);
                    }}
                    _hover={{ 
                      bg: buttonHover,
                      color: activeTab === tab ? 'blue.600' : 'inherit'
                    }}
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
        
        <Flex 
          justifyContent="center" 
          mt={4} 
          color={textColor} 
          fontSize="sm"
          textAlign="center"
        >
          <Text>
            © {new Date().getFullYear()} Anaheim Internship. ComVis-CnFD.
          </Text>
        </Flex>
      </motion.div>
    </Box>
  );
};

export default Login;