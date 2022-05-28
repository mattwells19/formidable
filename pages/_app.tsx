import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import Head from "next/head";
import { IntlProvider } from "react-intl";

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
          <Component {...pageProps} />
        </ChakraProvider>
      </IntlProvider>
    </>
  );
}

export default MyApp;
