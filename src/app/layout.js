import { Space_Grotesk } from "next/font/google";
import "./globals.css";

const grotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
});


export const metadata = {
  title: "Kiara",
  description: "A customer service bot for a website", //type your description about the chatbot here
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={grotesk.className}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        
      </head>
      <body
        className="bg-black"
      >
        {children}
      </body>
    </html>
  );
}
