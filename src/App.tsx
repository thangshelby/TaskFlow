import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { QueryClientProvider } from "@tanstack/react-query";
import Router from "./routers/router";
import { store } from "./store";
import { queryClient } from "./apis/react-query";
import { ToastContainer } from "react-toastify";
import { NotificationProvider } from "@libs/app/context/notification.context";
import { HelmetProvider } from "react-helmet-async";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <NotificationProvider>
            <HelmetProvider>
              <Router />
              <ReactQueryDevtools initialIsOpen={false} />
            </HelmetProvider>
          </NotificationProvider>
        </BrowserRouter>
        <ToastContainer />
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
