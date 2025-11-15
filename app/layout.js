import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "AKTU Result 2025 – Check AKTU Result by Roll Number",
  description:
    "Fastest AKTU Result checker. Enter only roll number — no DOB or verification required. Get your AKTU, UPTU, and B.Tech results instantly.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>

        {/* Canonical URL */}
        <link rel="canonical" href="https://aakturesult.netlify.app/" />

        {/* Basic SEO */}
        <meta
          name="keywords"
          content="aktu result, aktu roll number result, aktu result 2025, uptu result, aktu results without dob, aktu one view alternative"
        />
        <meta name="author" content="AKTU Result Tool" />
        <meta name="robots" content="index, follow" />

        {/* OG Tags */}
        <meta property="og:title" content="AKTU Result 2025 – Check by Roll Number Only" />
        <meta
          property="og:description"
          content="Get AKTU results instantly with only roll number. No DOB or verification required."
        />
        <meta property="og:url" content="https://aakturesult.netlify.app/" />
        <meta property="og:type" content="website" />

        {/* Twitter Meta */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AKTU Result 2025 – Roll Number Checker" />
        <meta
          name="twitter:description"
          content="Check AKTU/UPTU results instantly with only roll number."
        />

        {/* Mobile Meta */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />

        {/* Google Tag Manager */}
        <script>
          {`
            (function(w,d,s,l,i){
              w[l]=w[l]||[];
              w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});
              var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s), dl=l!='dataLayer'?'&l='+l:'';
              j.async=true;
              j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
              f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-MCM9XVSL');
          `}
        </script>
        {/* End GTM */}

      </head>

      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>

        {/* GTM NoScript */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-MCM9XVSL"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>
        {/* End GTM */}

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
          theme="colored"
        />

        {children}
      </body>
    </html>
  );
}
