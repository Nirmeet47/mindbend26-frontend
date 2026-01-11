import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mindbend.svnit.ac.in'
  
  // Generate OpenGraph image for social sharing
  const ogImageData = {
    title: 'Mindbend 2026 - SVNIT Surat',
    subtitle: "Gujarat's Largest Techno-Managerial Fest",
    stats: '15,000+ Participants | ₹7L+ Prizes | April 6-8, 2025',
    theme: 'Ecogenesis: Bharat\'s Journey from Roots to Revolution'
  }

  // Return a dynamic OpenGraph image response
  return new Response(
    JSON.stringify(ogImageData),
    {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    }
  )
}