"use client";
import Footer from '@/components/homepageComp/Footer';
import ComingSoon from '@/components/layoutComp/ComingSoon'
import Navbar from '@/components/layoutComp/Navbar';
import React from 'react'

function page() {
  return (
    <>
        <Navbar />
        <ComingSoon pageName='Campus Ambassador Page'/>
        <Footer />
    </>
)
}

export default page