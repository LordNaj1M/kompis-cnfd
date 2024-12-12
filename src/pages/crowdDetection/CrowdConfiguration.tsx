import { Box, Heading, VStack, Text, Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const CrowdConfiguration = () => {
  const navigate = useNavigate();
  return (
    <Box p={6}>
      <VStack align="start" spacing={4}>
        <Heading size="lg">CROWD CONFIGURATION</Heading>
        <Text>Assalamualaikum Crowd Configuration</Text>
        <Button onClick={()=>navigate(`/admin/crowd-configuration/view/${1}`)}>
          View
        </Button>
        <Button onClick={()=>navigate(`/admin/crowd-configuration/edit/${1}`)}>
          Edit
        </Button>
      </VStack>
    </Box>
  );
};

export default CrowdConfiguration;