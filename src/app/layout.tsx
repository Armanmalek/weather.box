import type { Metadata } from 'next';
import Link from 'next/link';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Weather.box',
  description: 'Weather Dot Box Application',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        {/* Header */}
        <header className="bg-[rgb(37,36,34)] text-white p-4">
          <div className="container mx-auto">
            <Link href="/">
              <h1 className="text-3xl font-bold">Weather.box</h1>
            </Link>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-grow container mx-auto p-4">{children}</main>

        {/* Footer */}
        <footer className="bg-gray-800 text-white p-4">
          <div className="container mx-auto flex justify-center space-x-6">
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="mailto:hello@my.box"
              className="flex items-center space-x-2 hover:text-gray-400"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="24"
                viewBox="0 0 25 24"
                fill="none"
              >
                <title>Email</title>
                <path
                  d="M20.666 4H4.66602C3.56602 4 2.67602 4.9 2.67602 6L2.66602 18C2.66602 19.1 3.56602 20 4.66602 20H20.666C21.766 20 22.666 19.1 22.666 18V6C22.666 4.9 21.766 4 20.666 4ZM20.666 8L12.666 13L4.66602 8V6L12.666 11L20.666 6V8Z"
                  fill="currentColor"
                />
              </svg>
              <span>Email</span>
            </a>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://twitter.com/boxdomains"
              className="flex items-center space-x-2 hover:text-gray-400"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <title>X</title>
                <path
                  d="M1.63283 2.25L9.67669 13.0054L1.58203 21.75H3.40381L10.4907 14.094L16.2167 21.75H22.4163L13.9198 10.3896L21.4543 2.25H19.6325L13.1058 9.30105L7.83242 2.25H1.63283ZM4.31189 3.59193H7.16L19.7368 20.4079H16.8887L4.31189 3.59193Z"
                  fill="#BFBFBF"
                />
              </svg>
              <span>X</span>
            </a>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://discord.gg/boxdomains"
              className="flex items-center space-x-2 hover:text-gray-400"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 127.14 96.36"
                preserveAspectRatio="xMidYMid meet"
              >
                <path
                  d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z"
                  fill="currentColor"
                />
              </svg>
              <span>Discord</span>
            </a>
          </div>
        </footer>
      </body>
    </html>
  );
}
