import Document, { Html, Head, Main, NextScript } from 'next/document';

// Classe personnalisée pour injecter le CDN Tailwind dans le <Head>
export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="fr">
        <Head>
          <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
