import { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Workshops - Mindbend 2026',
    description: 'Learn cutting-edge technologies in hands-on workshops at Mindbend 2026. AI/ML, blockchain, IoT, web development, mobile apps, and more. Industry experts as instructors. Feb 27-Mar 1, 2026.',
    keywords: [
      'workshops mindbend',
      'technology workshops gujarat',
      'AI ML workshop',
      'blockchain workshop',
      'IoT workshop',
      'web development workshop',
      'mobile app workshop',
      'programming workshop',
      'tech skills training',
      'hands-on learning',
      'industry experts',
      'certificate workshops',
    ],
    openGraph: {
      title: 'Technology Workshops - Mindbend 2026 | SVNIT Surat',
      description: 'Master new technologies with industry experts. AI/ML, blockchain, IoT, web dev & more. Hands-on workshops with certificates.',
      images: ['/images/workshop_img.png'],
    },
    twitter: {
      title: 'Technology Workshops - Mindbend 2026',
      description: 'Learn from industry experts | AI/ML | Blockchain | IoT | Web Dev | Certificates | Feb 27-Mar 1, 2026',
    }
  }
}