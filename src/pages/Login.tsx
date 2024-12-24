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
  Link,
  Checkbox,
  Text,
  useToast,
  Heading,
  useColorModeValue
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { login, register, resetPassword } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [security_answer, setSecurityAnswer] = useState('');
  const [activeTab, setActiveTab] = useState('login');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  
  // Warna-warna responsif
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.200');
  const buttonBoxBorder = useColorModeValue('gray.200', 'gray.700');
  const buttonHover = useColorModeValue('gray.100', 'gray.900');

  // Reset form ketika pindah tab
  useEffect(() => {
    setPassword('');
    setSecurityAnswer('');
    setAgreeToTerms(false);
  }, [activeTab]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const loginPromise = login(email, password);
      toast.promise(loginPromise, {
        loading: {title: 'Logging in', description: 'Please wait while we log you in.'},
        success: {title: 'Login Successful', description: 'Welcome back!', duration: 1000, isClosable: true, onCloseComplete() {navigate('/')}},
        error: (error) => ({title: 'Login Failed', description: 'An error occurred during login: ' + error, duration: 5000, isClosable: true}),
      });
    } catch (error) {
      toast({
        title: 'Login Failed',
        description: `An error occurred during login: ${error}`,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
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

    try {
      const registerPromise = register({ name, email, password, security_answer });
      toast.promise(registerPromise, {
        loading: {title: 'Registration Process', description: 'Please wait while we register you.',},
        success: {title: 'Registration Successful', description: 'You can now log in with your new account.', duration: 1000, isClosable: true, onCloseComplete() {setActiveTab('login')}},
        error: (error) => ({title: 'Registration Failed', description: 'An error occurred during register: ' + error, duration: 5000, isClosable: true}),
      });
    } catch (error) {
      toast({
        title: 'Registration Failed',
        description: `An error occurred during register: ${error}`,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
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
        isClosable: true,
      });
      return;
    }

    try {
      const resetPasswordPromise = resetPassword({ email, newPassword, security_answer });
      toast.promise(resetPasswordPromise, {
        loading: {title: 'Reset Password Process', description: 'Please wait while we reset your password.',},
        success: {title: 'Password Reset Successful', description: 'You can now log in with your new password.', duration: 1000, isClosable: true, onCloseComplete() {handleCancel()}},
        error: (error) => ({title: 'Password Reset Failed', description: 'An error occurred during reset password: ' + error, duration: 5000, isClosable: true}),
      });
    } catch (error) {
      toast({
        title: 'Registration Failed',
        description: `An error occurred during register: ${error}`,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleCancel = () => {
    setShowResetPassword(false);
    setNewPassword('');
    setPassword('');
    setSecurityAnswer('');
    setAgreeToTerms(false);
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

        <Button
          type="submit"
          w="full"
          colorScheme="green"
          color="white"
        >
          Sign In
        </Button>

        <Box textAlign="center">
          <Link
            fontSize="sm"
            color="gray.600"
            _hover={{ color:"red.500 ", textDecoration: 'underline' }}
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

        <Button
          type="submit"
          w="full"
          bg="blue.500"
          color="white"
          _hover={{ bg: 'blue.800' }}
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

          <Flex justifyContent="space-between" mt={4}>
            <Button
              variant="ghost"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              bg="red.500"
              color="white"
              _hover={{ bg: 'red.800' }}
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
        transition={{ duration: 1 }}
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
                    borderBottom={activeTab === tab ? '3px solid' : 'none'}
                    borderColor={activeTab === tab && tab === 'login' ? 'green.500' : 'blue.500'}
                    bg={activeTab === tab && tab === 'login' ? 'green.50' : activeTab === tab && tab === 'register' ? 'blue.50' : 'transparent'}
                    color={tab === 'login' ? 'green.500' : 'blue.500'}
                    onClick={() => {
                      setActiveTab(tab);
                      setShowResetPassword(false);
                    }}
                    _hover={{
                      bg: buttonHover,
                    }}
                  >
                    {tab.toUpperCase()}
                  </Button>
                ))}
              </Flex>
            )}
  
            <AnimatePresence mode="wait">
              {showResetPassword ? (
                <motion.div
                  key="reset-password"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  {resetPasswordForm()}
                </motion.div>
              ) : activeTab === 'login' ? (
                <motion.div
                  key="login"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  {loginForm()}
                </motion.div>
              ) : (
                <motion.div
                  key="register"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  {registerForm()}
                </motion.div>
              )}
            </AnimatePresence>
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