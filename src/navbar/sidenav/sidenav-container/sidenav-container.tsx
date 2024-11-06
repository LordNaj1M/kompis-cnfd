import { ReactNode, ReactElement } from "react";
import { Box, Grid, GridItem } from "@chakra-ui/react";

export interface SidenavContainerProps {
  children: ReactNode;
  sidenav: ReactElement;
}

export function SidenavContainer({ children, sidenav }: SidenavContainerProps) {
  return (
    <Grid templateAreas={`'sidebar main'`} templateColumns="auto 1fr">
      <GridItem area="sidebar" as="aside" w="full" p={0}>
        <Box
          pos="sticky"
          top={0}
          w={{ base: 0, md: "72px" }}
          borderRight="1px solid"
          borderColor="gray.100"
          p={{ base: 0, md: 2 }}
          paddingTop={8}
          height="100vh"
          overflow="auto"
          css={{
            "&::-webkit-scrollbar": {
              height: "var(--chakra-sizes-1)",
              width: "var(--chakra-sizes-1)"
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "var(--chakra-colors-gray-400)"
            }
          }}
        >
          {sidenav}
        </Box>
      </GridItem>
      <GridItem as="main" area="main" p={{ base: 6, md: 8 }}>
        {children}
      </GridItem>
    </Grid>
  );
}

export default SidenavContainer;
