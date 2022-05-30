import type { AppProps } from "next/app";
import { Box, ChakraProvider, Divider, Flex, Heading } from "@chakra-ui/react";
import Head from "next/head";
import { IntlProvider } from "react-intl";
import Nav from "../components/Nav";

const messages = {
  fieldIsRequired: "Field is required",
  min250k: "Must be at least $250k",
  notNegative: "Cannot be negative.",
  needX: "Need at least {x}.",
  min10Chars: "Must be at least 10 characters.",
  max500Chars: "No more than 500 characters.",
  mustBeInThePast: "Date must be in the past.",
  optional: "optional",
};

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Formidable</title>
      </Head>
      <IntlProvider locale="en-US" messages={messages}>
        <ChakraProvider>
          <Flex flexDir="column" padding="9" gap="5" alignItems="center">
            <Box as="header" maxWidth="container.lg" width="full">
              <Heading as="h1" textAlign="center">
                Formidable
              </Heading>
              <Divider marginY="5" />
              <Nav />
            </Box>
            <Flex
              as="main"
              flexWrap="wrap"
              gap="20"
              paddingTop="5"
              justifyContent="center"
            >
              <Component {...pageProps} />
            </Flex>
          </Flex>
        </ChakraProvider>
      </IntlProvider>
    </>
  );
}

export default MyApp;
