import '../src/app/globals.css';
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from 'next-themes';

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <ThemeProvider attribute="class">
        <main>
          <Component {...pageProps} />
        </main>
      </ThemeProvider>
      
    </SessionProvider>

  );
}

export default MyApp;
