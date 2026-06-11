import './globals.css';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'License Base',
  description: '資格学習を継続しやすくする学習支援プラットフォーム'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
