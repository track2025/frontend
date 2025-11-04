"use client";
import React, { useState, useEffect } from "react";
import {
    Box,
    Container,
    Breadcrumbs,
    Link,
    Typography
} from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useSearchParams, useRouter } from "next/navigation";
import MegaMenu from "./megamenu";
import TrackProductsClient from "./trackProductsClient";
import Banner from "./Banner";

const MegaMenuClient = ({ categories, filters }) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedSubCategory, setSelectedSubCategory] = useState(null);

    // ✅ Update state from query params on mount or when params change
    useEffect(() => {
        const categoryParam = searchParams.get("category");
        const subCategoryParam = searchParams.get("subcategory");

        if (categoryParam) setSelectedCategory(categoryParam);
        if (subCategoryParam) setSelectedSubCategory(subCategoryParam);
    }, [searchParams]);

    // ✅ When user clicks a subcategory in MegaMenu
    const handleSelectSubCategory = (category, subCategory) => {
        setSelectedCategory(category);
        setSelectedSubCategory(subCategory);

        + router.replace(`?category=${category}&subcategory=${subCategory}`, { scroll: false });
    };

    return (
        <Box>

            <Banner />

            <MegaMenu
                categories={categories}
                onSelectSubCategory={handleSelectSubCategory}
            />

            <Container maxWidth="xl">
                {/* ✅ Dynamic Breadcrumbs */}
                <Box sx={{ my: 3 }}>
                    <Breadcrumbs
                        separator={<NavigateNextIcon fontSize="small" />}
                        aria-label="breadcrumb"
                        maxItems={3} // 👈 limits visible items
                        itemsBeforeCollapse={1} // 👈 show 1 item before the "..."
                        itemsAfterCollapse={1} // 👈 show 1 item after the "..."
                        sx={{
                            fontSize: { xs: '0.85rem', md: '1rem' }, // adjust font size
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                        }}
                    >
                        <Link underline="hover" color="inherit" href="/">
                            Home
                        </Link>

                        <Link underline="hover" color="inherit" href="/track-products">
                            Track Products
                        </Link>

                        {selectedCategory && (
                            <Link
                                underline="hover"
                                color="inherit"
                                className="text-capitalize"
                                href={`/track-products?category=${encodeURIComponent(selectedCategory)}`}
                            >
                                {selectedCategory.replace(/-/g, " ")}
                            </Link>
                        )}

                        {selectedSubCategory && (
                            <Typography color="text.primary" className="text-capitalize">
                                {selectedSubCategory.replace(/-/g, " ")}
                            </Typography>
                        )}
                    </Breadcrumbs>
                </Box>


                {/* ✅ Product Listing */}
                <TrackProductsClient
                    filters={filters}
                    categories={categories}
                    selectedCategory={selectedCategory}
                    selectedSubCategory={selectedSubCategory}
                />
            </Container>
        </Box>
    );
};

export default MegaMenuClient;
