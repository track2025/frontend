// mui
import { Container } from "@mui/material"

// component import
import AboutUs from "src/components/_main/about"

// Next.js dynamic import
import dynamic from "next/dynamic"

// skeleton component import
import HeaderBreadcrumbsSkeleton from "src/components/skeletons/breadcrumbs"

// Dynamically importing the HeaderBreadcrumbs component with a fallback to a skeleton loader while loading
const HeaderBreadcrumbs = dynamic(() => import("src/components/headerBreadcrumbs"), {
  loading: () => <HeaderBreadcrumbsSkeleton />,
})

export const metadata = {
  title: "About Us | Lap Snaps - Professional Motorsport Photography",
  description:
    "Learn about Lap Snaps, your trusted source for high-quality motorsport photography from race tracks and events worldwide.",
  keywords: "about lap snaps, motorsport photography, race track photography, about us",
  openGraph: {
    title: "About Us | Lap Snaps",
    description: "Learn about Lap Snaps and our mission to deliver professional motorsport photography.",
    url: "https://lapsnaps.com/about",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us | Lap Snaps",
    description: "Learn about Lap Snaps and our mission to deliver professional motorsport photography.",
  },
  alternates: {
    canonical: "https://lapsnaps.com/about",
  },
}

export default function Page() {
  const aboutPageSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About Lap Snaps",
    description:
      "Learn about Lap Snaps, your trusted source for high-quality motorsport photography from race tracks and events worldwide",
    url: "https://lapsnaps.com/about",
    mainEntity: {
      "@type": "Organization",
      "@id": "https://lapsnaps.com/#organization",
      name: "Lap Snaps",
      alternateName: "LapSnaps",
      url: "https://lapsnaps.com",
      logo: {
        "@type": "ImageObject",
        url: "https://lapsnaps.com/logo.png",
        width: 250,
        height: 60,
      },
      description:
        "Professional motorsport and race track photography marketplace connecting photographers with motorsport enthusiasts worldwide",
      foundingDate: "2020",
      slogan: "High-Quality Vehicle Photography from Race Tracks Worldwide",
      knowsAbout: [
        "Motorsport Photography",
        "Race Track Photography",
        "Vehicle Photography",
        "Track Day Photography",
        "Racing Event Photography",
      ],
      areaServed: {
        "@type": "Place",
        name: "Worldwide",
      },
      sameAs: [
        "https://www.facebook.com/lapsnaps",
        "https://www.instagram.com/lapsnaps",
        "https://twitter.com/lapsnaps",
      ],
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "Customer Service",
        email: "support@lapsnaps.com",
        availableLanguage: ["English"],
      },
    },
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://lapsnaps.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "About Us",
        item: "https://lapsnaps.com/about",
      },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutPageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <Container maxWidth="xl">
        <HeaderBreadcrumbs
          heading="About Us"
          links={[
            {
              name: "Home",
              href: "/",
            },
            {
              name: "About us",
            },
          ]}
        />
        <AboutUs />
      </Container>
    </>
  )
}
