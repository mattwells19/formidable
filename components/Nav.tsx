import { Tab, Tabs, TabList, Link } from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { PropsWithChildren } from "react";

function LinkTab({ children, href }: PropsWithChildren<{ href: string }>) {
  return (
    <NextLink href={href} passHref>
      <Tab as="li">
        <Link>{children}</Link>
      </Tab>
    </NextLink>
  );
}

const pages = ["/dependent", "/custom"];

function Nav() {
  const { pathname } = useRouter();
  const pageIndex = pages.findIndex((p) => p == pathname) + 1;

  return (
    <Tabs as="nav" index={Math.max(pageIndex, 0)}>
      <TabList as="ul">
        <LinkTab href="/">Basic</LinkTab>
        <LinkTab href="/dependent">Dependent</LinkTab>
        <LinkTab href="/custom">Custom</LinkTab>
      </TabList>
    </Tabs>
  );
}

export default Nav;
