import { Box, Heading, VStack, Text, Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const FatigueConfiguration = () => {
    const navigate = useNavigate();
  return (
    <Box p={6}>
      <VStack align="start" spacing={4}>
        <Heading size="lg">FATIGUE CONFIGURATION</Heading>
        <Text>Assalamualaikum Fatigue Configuration</Text>
        <Button onClick={()=>navigate(`/admin/fatigue-configuration/view/${1}`)}>
          View
        </Button>
        <Button onClick={()=>navigate(`/admin/fatigue-configuration/edit/${1}`)}>
          Edit
        </Button>
      </VStack>
    </Box>
  );
};

export default FatigueConfiguration;