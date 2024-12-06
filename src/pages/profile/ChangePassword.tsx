// src/pages/profile/ChangePassword.tsx
import { useState } from 'react';
import { 
  Box, 
  Button, 
  Card, 
  CardBody, 
  FormControl, 
  FormLabel, 
  Heading, 
  Input, 
  Stack, 
  useColorModeValue, 
  useToast, 
  VStack, 
  useMediaQuery, 
  Flex 
} from '@chakra-ui/react';
import { editPassword } from '../../hooks/useUser';
import { useNavigate } from 'react-router-dom';

const ChangePassword = () => {
  const navigate = useNavigate();
  const [oldPassword, setOldPassword] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const toast = useToast();

  const cardBg = useColorModeValue('white', 'gray.800');
  const isMobile = useMediaQuery('(max-width: 768px)')[0];

  const handleChangePasswordProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordInput === newPassword) {
        // eslint-disable-next-line no-async-promise-executor
        const changePasswordPromise = new Promise(async (resolve, reject) => {
        try {
            await new Promise((res) => setTimeout(res, 2000));

            const success = await editPassword({ oldPassword, newPassword });
            if (success) {
            resolve(true);
            navigate('/profile');
            }
        } catch (error) {
            reject(error);
        }
        });

        toast.promise(changePasswordPromise, {
            loading: { title: 'Updating Password', description: 'Please wait while we update your password.' },
            success: { title: 'Change Password Success', description: 'Your password has been successfully updated!', duration: 3000, isClosable: true },
            error: { title: 'Change Password Failed', description: 'An error occurred during password update: ', duration: 5000, isClosable: true },
        });
    } else {
        toast({
            title: 'Change Password Failed',
            description: 'Your retype password is not the same!',
            status: 'error',
            duration: 5000,
            isClosable: true,
        });
    }
  };

  return (
    <VStack spacing={6} p={4} w="full" maxW="1200px" mx="auto">
      <Box p={6}>
        <VStack align="start" spacing={4}>
          <Heading size="lg">CHANGE PASSWORD</Heading>
        </VStack>
      </Box>
      <Card 
        maxW="450px" 
        w="full" 
        boxShadow="xl" 
        borderRadius="xl" 
        bg={cardBg}
        overflow="hidden"
      >
        <CardBody p={[4, 6, 8]}>
          <form onSubmit={handleChangePasswordProfile} name='editForm'>
            <Stack spacing={4}>
              <FormControl>
              <FormLabel>Old Password</FormLabel>
                <Input
                    type="password"
                    name="current_password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="Enter your old password"
                    required
                    autoComplete="off"
                    
                />
              </FormControl>

              <FormControl>
              <FormLabel>New Password</FormLabel>
                <Input
                    type="password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Enter your new password"
                    required
                />
              </FormControl>

              <FormControl>
              <FormLabel>Retype New Password</FormLabel>
                <Input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Retype your new password"
                    required
                />
              </FormControl>

              <Flex
                mt={4}
                gap={4}
                direction={isMobile ? 'column' : 'row'}
                justify="center"
              >
                {!isMobile && (
                <Button
                  bg="gray"
                  color="white"
                  _hover={{ bg: 'gray.800' }}
                  size={isMobile ? 'md' : 'lg'}
                  width={isMobile ? 'full' : 'auto'}
                  onClick={()=>navigate('/profile')}
                >
                  Cancel
                </Button>
                )}
                <Button
                  type="submit"
                  bg="blue.500"
                  color="white"
                  _hover={{ bg: 'blue.800' }}
                  size={isMobile ? 'md' : 'lg'}
                  width={isMobile ? 'full' : 'auto'}
                >
                  Change
                </Button>
                {isMobile && (
                <Button
                  bg="gray"
                  color="white"
                  _hover={{ bg: 'gray.800' }}
                  size={isMobile ? 'md' : 'lg'}
                  width={isMobile ? 'full' : 'auto'}
                  onClick={()=>navigate('/profile')}
                >
                  Cancel
                </Button>
                )}
              </Flex>
            </Stack>
          </form>
        </CardBody>
      </Card>
    </VStack>
  );
};

export default ChangePassword;