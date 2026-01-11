import { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Technical Events - Mindbend 2026',
    description: 'Compete in cutting-edge technical competitions at Gujarat\'s largest techfest. Coding, robotics, AI/ML, web development, app development, and more. Win from ₹7 lakh+ prize pool. Feb 27-Mar 1, 2026.',
    keywords: [
      'technical events mindbend',
      'coding competition gujarat',
      'robotics competition',
      'hackathon svnit',
      'programming contest',
      'AI ML competition',
      'web development contest',
      'app development',
      'tech competition india',
      'engineering events',
      'student coding contest',
      'technical fest gujarat',
    ],
    openGraph: {
      title: 'Technical Events - Mindbend 2026 | SVNIT Surat',
      description: 'Join cutting-edge technical competitions at Gujarat\'s biggest techfest. Coding, robotics, AI/ML & more. ₹7L+ prizes!',
      images: ['/images/tech_img.jpg'],
    },
    twitter: {
      title: 'Technical Events - Mindbend 2026',
      description: 'Cutting-edge technical competitions | Coding | Robotics | AI/ML | ₹7L+ prizes | Feb 27-Mar 1, 2026',
    }
  }
}