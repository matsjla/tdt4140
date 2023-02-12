import { StrictMode } from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
} from "react-router-dom";
import { Outlet } from "react-router-dom";
import { MantineProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import { Registration } from "./pages/registration.jsx";
import { Layout } from "./pages/layout";
import { QueryClient, QueryClientProvider } from "react-query";
import { Login } from "./pages/login";
import { Home } from "./pages/home";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="/registration" element={<Registration />} />
      <Route path="/login" element={<Login />} />
    </Route>,
  ),
);

const queryClient = new QueryClient();

export const App = () => {
  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <MantineProvider
          withGlobalStyles
          theme={{
            colorScheme: "light",
          }}
          withNormalizeCSS
        >
          <NotificationsProvider>
            <RouterProvider router={router}>
              <Outlet />
            </RouterProvider>
          </NotificationsProvider>
        </MantineProvider>
      </QueryClientProvider>
    </StrictMode>
  );
};
