import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CGPA Calculator — Full System Architecture',
  description: 'Cross-device CGPA tracking and planning app with customizable assessment weights, grading scales, HSTU Civil preset, target GPA simulator, and analytics.',
  openGraph: {
    title: 'CGPA Calculator',
    description: 'Cross-device CGPA tracking and planning app with customizable assessment weights, grading scales, HSTU Civil preset, target GPA simulator, and analytics.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CGPA Calculator',
    description: 'Cross-device CGPA tracking and planning app with customizable assessment weights, grading scales, HSTU Civil preset, target GPA simulator, and analytics.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className="h-full bg-slate-50 antialiased selection:bg-slate-900 selection:text-white">
      <body className="min-h-full flex flex-col font-sans text-slate-900 bg-slate-50 antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
