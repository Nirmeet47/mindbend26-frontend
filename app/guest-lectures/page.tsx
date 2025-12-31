"use client";
import Footer from '@/components/homepageComp/Footer';
import ComingSoon from '@/components/layoutComp/ComingSoon'
import Navbar from '@/components/layoutComp/Navbar';
import React from 'react'

function page() {
  return (
    <>
        <Navbar />
        <ComingSoon pageName='Guest lectures Page'/>
        <Footer />
    </>
)
}

export default page