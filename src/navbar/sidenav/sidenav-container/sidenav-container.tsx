import { ReactNode, ReactElement } from "react";
import { Box, Grid, GridItem, useColorModeValue } from "@chakra-ui/react";

export interface SidenavContainerProps {
  children: ReactNode;
  sidenav: ReactElement;
}

export function SidenavContainer({ children, sidenav }: SidenavContainerProps) {
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const bgBox = useColorModeValue('white', 'gray.800');

  return (
    <Grid templateAreas={`'sidebar main'`} templateColumns="auto 1fr" bg={bgColor}>
      <GridItem area="sidebar" as="aside" w="full" p={0}>
        <Box
          pos="sticky"
          top={0}
          left={0}
          bottom={0}
          w={{ base: 0, md: "72px" }}
          borderRight="1px solid"
          borderColor={borderColor}
          bg={bgBox}
          p={{ base: 0, md: 2 }}
          paddingTop={8}
          height="100vh"
          overflow="auto"
          css={{
            "&::-webkit-scrollbar": {
              width: "6px"
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "var(--chakra-colors-gray-400)",
              borderRadius: "3px"
            }
          }}
        >
          {sidenav}
        </Box>
      </GridItem>
      <GridItem 
        as="main" 
        area="main" 
        p={{ base: 6, md: 8 }}
        transition="margin-left 0.3s ease"
      >
        {children}
      </GridItem>
    </Grid>
  );
}

export default SidenavContainer;
