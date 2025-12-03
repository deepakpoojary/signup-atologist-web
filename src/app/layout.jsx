import { Poppins, Inter } from "next/font/google";
import "@/styles/global.scss";

// const poppins = Poppins({
//   subsets: ["latin"],
//   weight: ["300", "400", "500", "600", "700"],
//   display: "swap",
//   variable: "--font-poppins",
// });
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "600"], // Regular = 400, SemiBold = 600
  display: "swap",
  variable: "--font-inter",
});
export const metadata = {
  title: "Atologist Infotech - Sign Up",
  description: "Create your account at Atologist Infotech",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
