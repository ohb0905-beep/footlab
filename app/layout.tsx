import type {Metadata} from 'next';
import { Plus_Jakarta_Sans, Noto_Sans_KR, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-plus-jakarta',
});

const notoSansKr = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-noto-kr',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-jetbrains',
});

export const metadata: Metadata = {
  title: '풋볼랩 코리아 (FootballLab KR) - 유럽 축구 빅데이터 분석 플랫폼',
  description: '피치 위 전술 지표(xG, xA, PPDA)와 구단 재정·지배구조(PSR, 주급 비율, 감가상각) 및 시대 보정 Z-스코어를 통합 분석하는 FotMob 스타일 유럽 축구 빅데이터 플랫폼',
  openGraph: {
    title: '풋볼랩 코리아 (FootballLab KR) - 유럽 축구 빅데이터 분석 플랫폼',
    description: '피치 위 전술 지표(xG, xA, PPDA)와 구단 재정·지배구조(PSR, 주급 비율, 감가상각) 및 시대 보정 Z-스코어를 통합 분석하는 FotMob 스타일 유럽 축구 빅데이터 플랫폼',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '풋볼랩 코리아 (FootballLab KR) - 유럽 축구 빅데이터 분석 플랫폼',
    description: '피치 위 전술 지표(xG, xA, PPDA)와 구단 재정·지배구조(PSR, 주급 비율, 감가상각) 및 시대 보정 Z-스코어를 통합 분석하는 FotMob 스타일 유럽 축구 빅데이터 플랫폼',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="ko" className={`${plusJakarta.variable} ${notoSansKr.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased selection:bg-[#10B981]/20 selection:text-[#10B981]" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
