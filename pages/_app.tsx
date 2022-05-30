import type { AppProps } from "next/app";
import { Box, ChakraProvider, Divider, Flex, Heading } from "@chakra-ui/react";
import Head from "next/head";
import { IntlProvider } from "react-intl";
import Nav from "../components/Nav";

const messages = {
  fieldIsRequired: "Field is required",
  min250k: "Must be at least $250k",
  notNegative: "Cannot be negative.",
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
          <Box marginY="10" width="fit-content" padding="9" margin="auto">
            <Box as="header">
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
          </Box>
        </ChakraProvider>
      </IntlProvider>
    </>
  );
}

export default MyApp;
