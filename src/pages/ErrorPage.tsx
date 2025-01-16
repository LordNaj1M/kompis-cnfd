import { Box, Heading, Text, Button, AbsoluteCenter } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <Box textAlign="center" minH="100vh">
      <AbsoluteCenter>
        <Heading display="inline-block" size="xl">
          404 | Page Not Found
        </Heading>
        <Text mt={3} mb={2}>
          The page you're looking for does not seem to exist
        </Text>
        <Button colorScheme="blue" onClick={() => navigate("/")} mt={4}>
          Go to Right Way
        </Button>
      </AbsoluteCenter>
    </Box>
  );
};

export default ErrorPage;
