import { Box, Heading, VStack, Text } from '@chakra-ui/react';

const Profile = () => {
  return (
    <Box p={6}>
      <VStack align="start" spacing={4}>
        <Heading size="lg">PROFILE</Heading>
        <Text>Assalamualaikum Profile</Text>
      </VStack>
    </Box>
  );
};

export default Profile;