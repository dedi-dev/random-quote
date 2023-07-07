import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <title>Random Quote</title>
      <meta property="og:title" content="Random Quote" key="title" />
      <meta name="description" content="Random Quotes from Popular Persons" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
