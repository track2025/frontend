"use client"
import dynamic from "next/dynamic"
import { Container, Typography } from "@mui/material"
import WhyUs from "src/components/_main/home/whyUs"
import TopBanners from "src/components/_main/home/topBanners"
import Head from "next/head"
import HeroCarousel from "src/components/_main/HeroCarousel"
import { useProgressiveLoading } from "src/hooks/useProgressiveLoading"

// Dynamic imports
const Categories = dynamic(() => import("src/components/_main/home/categories"))
const BestSellingProducs = dynamic(() => import("src/components/_main/home/bestSelling"))
const Banner = dynamic(() => import("src/components/_main/home/banner"))
const Brands = dynamic(() => import("src/components/_main/home/brands"))
const TopCollection = dynamic(() => import("src/components/_main/home/top"))
const Shops = dynamic(() => import("src/components/_main/home/shop"))
const Testimonials = dynamic(() => import("src/components/_main/home/testimonials"))
const FeaturedProducts = dynamic(() => import("src/components/_main/home/featured"))

export default function IndexPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Lap Snaps",
    description: "High-Quality Vehicle Photography from Race Tracks and Motorsport Events Worldwide",
    url: "https://lapsnaps.com",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://lapsnaps.com/search?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
    publisher: {
      "@type": "Organization",
      name: "Lap Snaps",
      logo: {
        "@type": "ImageObject",
        url: "https://lapsnaps.com/logo.png",
      },
    },
  }

  const { isLoading } = useProgressiveLoading(
    ["hero"],
    800
  );

  return (
    <>
      <Head>
        <title>Lap Snaps | High-Quality Vehicle Photography from Race Tracks Worldwide</title>
        <meta
          name="description"
          content="Discover professional motorsport photography from race tracks worldwide. Browse vehicle photos, track day images, and racing event galleries from top photographers."
        />
        <meta
          name="keywords"
          content="motorsport photography, race track photos, vehicle photography, track day images, racing events, car photography, motorsport images"
        />
        <link rel="canonical" href="https://lapsnaps.com" />
        <meta property="og:title" content="Lap Snaps | High-Quality Vehicle Photography" />
        <meta property="og:description" content="Professional motorsport photography from race tracks worldwide" />
        <meta property="og:url" content="https://lapsnaps.com" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://lapsnaps.com/opengraph-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Lap Snaps | High-Quality Vehicle Photography" />
        <meta name="twitter:description" content="Professional motorsport photography from race tracks worldwide" />
        <meta name="twitter:image" content="https://lapsnaps.com/opengraph-image.png" />
      </Head>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      <div style={{ maxWidth: "100%", overflow: "hidden" }}>
        <video
          autoPlay
          muted
          loop
          playsInline
          aria-label="Lap Snaps motorsport photography showcase video"
          style={{
            width: "100%",
            height: "500px",
            objectFit: "cover",
          }}
        >
          <source src="/images/lapsnaps.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      <Typography
        variant="h1"
        component="h1"
        sx={{
          textAlign: "center",
          fontSize: {
            xs: "1rem",
            sm: "1rem",
            md: "1.5rem",
          },
          fontWeight: 600,
          mt: 4,
        }}
      >
        Welcome to Lap Snaps — High-Quality Vehicle Photography
      </Typography>

      <TopBanners />
      
      <Banner />

      <Container maxWidth="xl">
        <FeaturedProducts />
      </Container>






      <Container maxWidth="xl">



        <TopCollection />

        <WhyUs />

        {/* <Categories /> */}

        {/* <Shops /> */}
      </Container>

      <div className="flex flex-col lg:flex-row gap-6 ">
        <div className="w-full lg:w-2/3 xl:w-3/4">
          <HeroCarousel loading={isLoading("hero")} />
        </div>
      </div>

      {/* <Testimonials /> */}

      <Container maxWidth="xl">
        <Brands />
      </Container>
    </>
  )
}
