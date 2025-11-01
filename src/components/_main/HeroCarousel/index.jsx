"use client";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { fetchCarouselItems } from "src/services";
import HeroCarouselSkeleton from "src/components/skeletons/HeroCarouselSkeleton";
import { Button } from "@mui/material";

const FALLBACK_BANNERS = [
  {
    id: 1,
    image: "/images/home-banner.jpg",
    title: "Every box is a",
    highlight: "new adventure",
    description: "Discover amazing products curated just for you",
    buttonText: "GET STARTED",
    buttonLink: "/influencer",
  },
];

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [bannerItems, setBannerItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadBanners = useCallback(async () => {
    try {
      const response = await fetchCarouselItems();

      if (response?.success && Array.isArray(response.data) && response.data.length > 0) {
        const validBanners = response.data.filter(
          (banner) => banner?.image && banner?.title
        );
        setBannerItems(validBanners.length > 0 ? validBanners : FALLBACK_BANNERS);
      } else {
        setBannerItems(FALLBACK_BANNERS);
      }
    } catch (error) {
      console.error("Error fetching banners:", error);
      setBannerItems(FALLBACK_BANNERS);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBanners();
  }, [loadBanners]);

  useEffect(() => {
    if (bannerItems.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerItems.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [bannerItems.length]);

  const nextSlide = () => {
    if (bannerItems.length <= 1) return;
    setCurrentSlide((prev) => (prev + 1) % bannerItems.length);
  };

  const prevSlide = () => {
    if (bannerItems.length <= 1) return;
    setCurrentSlide((prev) => (prev - 1 + bannerItems.length) % bannerItems.length);
  };

  const goToSlide = (index) => {
    if (bannerItems.length <= 1) return;
    setCurrentSlide(index);
  };

  if (isLoading) return <HeroCarouselSkeleton />;

  if (bannerItems.length === 0)
    return (
      <div className="position-relative w-100" style={{ height: "400px", backgroundColor: "#e9ecef" }}>
        <div className="d-flex justify-content-center align-items-center h-100">
          <p className="text-secondary">No banners available</p>
        </div>
      </div>
    );

  return (
    <div className="position-relative rounded-4 w-100 mt-5" style={{ height: "400px", overflow: "hidden" }}>
      <div className="h-100 w-100 d-flex transition-slide" style={{ transform: `translateX(-${currentSlide * 100}%)`, transition: "transform 0.5s ease-in-out" }}>
        {bannerItems.map((banner, index) => (
          <div key={banner._id || banner.id || index} className="flex-shrink-0 w-100 h-100 position-relative">
            <Image
              src={banner.image || "/placeholder.svg"}
              alt={banner.title || "Banner image"}
              fill
              className="object-fit-cover"
              priority={index === 0}
            />
            <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-50"></div>

            {/* Overlay content */}
            {(banner.title || banner.highlight || banner.description || banner.buttonText) && (
              <div className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-start p-4 text-white" style={{ maxWidth: "600px" }}>
                {(banner.title || banner.highlight) && (
                  <h1 className="display-5 fw-bold mb-3">
                    {banner.title && <span>{banner.title} </span>}
                    {banner.highlight && <span className="text-info">{banner.highlight}</span>}
                  </h1>
                )}
                {banner.description && <p className="lead mb-3">{banner.description}</p>}
                {banner.buttonText && banner.buttonLink && (
                  <Link href={banner.buttonLink} passHref legacyBehavior>
                    <Button variant="light">
                      {banner.buttonText} <span className="ms-2">→</span>
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Carousel controls */}
      {bannerItems.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="btn btn-dark rounded-pill opacity-75"
            style={{
              width: "50px",
              height: "50px",
              position: "absolute",
              top: "80%",      // 80% from top
              left: "20px",    // 20px from left
              transform: "translateY(-50%)", // center vertically relative to top
            }}
            aria-label="Previous slide"
          >
            ‹
          </button>

          <button
            onClick={nextSlide}
            className="btn btn-dark rounded-pill opacity-75"
            style={{
              width: "50px",
              height: "50px",
              position: "absolute",
              top: "80%",       // 80% from top
              right: "20px",    // 20px from right
              transform: "translateY(-50%)",
            }}
            aria-label="Next slide"
          >
            ›
          </button>

          {/* Indicators */}
          <div className="position-absolute bottom-0 start-0 mb-3 ms-3 d-flex gap-2">
            {bannerItems.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`rounded-pill ${index === currentSlide ? "bg-info" : "bg-light"} border-0`}
                style={{ width: "30px", height: "5px" }}
                aria-label={`Go to slide ${index + 1}`}
              ></button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
