import {
  AppShell,
  Navbar,
  Header,
  Box,
  Text,
  Flex,
  Button,
  UnstyledButton,
  Group,
  Input,
  useMantineTheme,
} from "@mantine/core";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { useLogout, useSession } from "../auth.js";
import { useForm } from "react-hook-form";

const Logo = () => {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();
  const onSearchNavigate = (data) => {
    navigate(`/search?q=${data.query}`);
  };

  return (
    <Header height={60}>
      <Group sx={{ height: "100%" }} px={20} position="apart">
        <Flex align="center" columnGap="sm">
          <Icon
            icon="material-symbols:menu-book-outline-sharp"
            width={40}
            height={40}
          />
          <Text fw={800} fs="xl">
            IBDB
          </Text>
        </Flex>
        <form onSubmit={handleSubmit(onSearchNavigate)}>
          <Flex columnGap="xs">
            <Input
              sx={{ width: 300 }}
              placeholder="Søk etter bok eller forfatter"
              {...register("query", {
                required: true,
                minLength: 1,
              })}
              icon={<Icon icon="mdi:search" width={20} height={20} />}
            />
            <Button type="submit">Søk</Button>
          </Flex>
        </form>
      </Group>
    </Header>
  );
};

const Links = () => {
  const theme = useMantineTheme();
  const session = useSession();
  const navigate = useNavigate();
  const links = [
    {
      icon: "mdi:format-list-numbered",
      href: "/",
      label: "Topplister",
      color: theme.colors.blue[4],
    },
  ];
  if (session !== null) {
    if (session.user.user_role === "a") {
      links.push(
        // {
        //   icon: "mdi:file-document-remove",
        //   href: "/admin/remove-reviews",
        //   label: "Fjern anmeldelser",
        //   color: theme.colors.teal[4],
        // },
        {
          icon: "mdi:book-plus",
          href: "/admin/books",
          label: "Legg til bøker",
          color: theme.colors.teal[4],
        },
        {
          icon: "mdi:book-plus",
          href: "/admin/genres",
          label: "Legg til sjangere",
          color: theme.colors.teal[4],
        },
        {
          icon: "mdi:book-plus",
          href: "/admin/authors",
          label: "Legg til forfattere",
          color: theme.colors.teal[4],
        },
      );
    } else {
      // links.push(
      //   {
      //     icon: "mdi:book-heart",
      //     href: "/my-favorites",
      //     label: "Mine favoritter",
      //     color: theme.colors.red[4],
      //   },
      //   {
      //     icon: "mdi:message-draw",
      //     href: "/my-reviews",
      //     label: "Mine anmeldelser",
      //     color: theme.colors.green[4],
      //   },
      //   {
      //     icon: "mdi:view-list",
      //     href: "/my-lists",
      //     label: "Mine lister",
      //     color: theme.colors.yellow[4],
      //   },
      // );
    }
  }

  return (
    <Box>
      {links.map((link) => (
        <UnstyledButton
          key={link.href}
          onClick={() => navigate(link.href)}
          sx={(theme) => ({
            display: "block",
            width: "100%",
            padding: theme.spacing.xs,
            borderRadius: theme.radius.sm,
            color: theme.black,

            "&:hover": {
              backgroundColor: theme.colors.gray[0],
            },
          })}
        >
          <Group>
            <Icon width={40} color={link.color} height={40} icon={link.icon} />
            <Text size="sm">{link.label}</Text>
          </Group>
        </UnstyledButton>
      ))}
    </Box>
  );
};

const User = () => {
  const navigate = useNavigate();
  const theme = useMantineTheme();
  const session = useSession();
  const logout = useLogout();
  const onLogoutClick = () => {
    logout();
    navigate("/");
  };

  return (
    <Box
      sx={{
        paddingTop: theme.spacing.sm,
        borderTop: `1px solid ${theme.colors.gray[2]}`,
        padding: theme.spacing.xs,
      }}
    >
      <Flex columnGap="xs" direction="row" align="center">
        {session !== null ? (
          <>
            <Flex columnGap="xs">
              <Icon width={40} height={40} icon="mdi:account-circle" />
              <Box>
                <Text size="sm" weight={500}>
                  {session.user.username} (
                  {session.user.user_role === "u" ? "Bruker" : "Administrator"})
                </Text>
                <Text color="dimmed" size="xs">
                  {session.user.email}
                </Text>
              </Box>
            </Flex>
            <Button onClick={() => onLogoutClick()}>Logg ut</Button>
          </>
        ) : (
          <>
            <Button onClick={() => navigate("/login")}>Logg inn</Button>
            <Button onClick={() => navigate("/registration")}>
              Registrer bruker
            </Button>
          </>
        )}
      </Flex>
    </Box>
  );
};

export const Layout = () => {
  return (
    <AppShell
      padding="md"
      navbar={
        <Navbar p="xs" width={{ base: 400 }}>
          <Navbar.Section grow mt="md">
            <Links />
          </Navbar.Section>
          <Navbar.Section>
            <User />
          </Navbar.Section>
        </Navbar>
      }
      header={<Logo />}
    >
      <Outlet />
    </AppShell>
  );
};
