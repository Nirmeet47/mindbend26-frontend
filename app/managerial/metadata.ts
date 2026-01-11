import { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Managerial Events - Mindbend 2026',
    description: 'Showcase your business acumen in managerial competitions at Gujarat\'s largest techfest. Case studies, business plan, marketing, finance, and strategy contests. Feb 27-Mar 1, 2026.',
    keywords: [
      'managerial events mindbend',
      'business competition gujarat',
      'case study competition',
      'business plan contest',
      'marketing competition',
      'finance contest',
      'strategy competition',
      'entrepreneurship contest',
      'management events',
      'mba competition',
      'business fest gujarat',
      'corporate challenge',
    ],
    openGraph: {
      title: 'Managerial Events - Mindbend 2026 | SVNIT Surat',
      description: 'Test your business skills in managerial competitions. Case studies, business plans, marketing & strategy contests.',
      images: ['/images/mng_img.avif'],
    },
    twitter: {
      title: 'Managerial Events - Mindbend 2026',
      description: 'Business competitions | Case studies | Marketing | Strategy | Entrepreneurship | Feb 27-Mar 1, 2026',
    }
  }
}