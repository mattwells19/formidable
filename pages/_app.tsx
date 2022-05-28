import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import Head from "next/head";
import { IntlProvider } from "react-intl";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Formidable</title>
      </Head>
      <IntlProvider locale="en-US">
        <ChakraProvider>
          <Component {...pageProps} />
        </ChakraProvider>
      </IntlProvider>
    </>
  );
}

export default MyApp;
