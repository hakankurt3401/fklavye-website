import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="tr">
      <Head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/logo.png" />
      </Head>
      <body className="bg-lighter min-h-screen flex flex-col">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
