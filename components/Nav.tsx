import { Tab, Tabs, TabList } from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { PropsWithChildren } from "react";

function LinkTab({ children, href }: PropsWithChildren<{ href: string }>) {
  return (
    <NextLink href={href} passHref>
      <Tab as="a">{children}</Tab>
    </NextLink>
  );
}

const pages = ["/dependent", "/custom"];

function Nav() {
  const { pathname } = useRouter();
  const pageIndex = pages.findIndex((p) => p == pathname) + 1;

  return (
    <Tabs index={Math.max(pageIndex, 0)}>
      <TabList justifyContent={{ base: "center", md: "flex-start" }} as="nav">
        <LinkTab href="/">Basic</LinkTab>
        <LinkTab href="/dependent">Dependent</LinkTab>
        <LinkTab href="/custom">Custom</LinkTab>
      </TabList>
    </Tabs>
  );
}

export default Nav;
