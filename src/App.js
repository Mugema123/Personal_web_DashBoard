import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import ThemeProvider from './theme';

import { Provider } from 'react-redux';
import { store } from './redux/store';
import AuthWrapper from './AuthWrapper';
import { Toaster } from 'react-hot-toast';

export default function App() {
  return (
    <Provider store={store}>
      <HelmetProvider>
        <BrowserRouter>
          <ThemeProvider>
            <AuthWrapper />
            <Toaster />
          </ThemeProvider>
        </BrowserRouter>
      </HelmetProvider>
    </Provider>
  );
}
