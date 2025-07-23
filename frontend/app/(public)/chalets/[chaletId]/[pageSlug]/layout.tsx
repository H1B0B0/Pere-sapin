export default function PageViewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <meta charSet="utf-8" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </head>
      <body
        style={{
          margin: 0,
          padding: 0,
          fontFamily:
            '"ui-sans-serif", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "Noto Sans", "sans-serif"',
          backgroundColor: "rgb(37, 37, 37)",
          color: "rgba(255, 255, 255, 0.9)",
          lineHeight: "1.5",
        }}
      >
        {children}
      </body>
    </html>
  );
}
