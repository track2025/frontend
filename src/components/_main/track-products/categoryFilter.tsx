'use client';
import React, { useState, useEffect } from 'react';
import { Box, useTheme, Stack, IconButton, Tooltip } from '@mui/material';
import { createGradient } from 'src/theme/palette';
import CloseIcon from '@mui/icons-material/Close';
import { useRouter, useSearchParams } from 'next/navigation';

import * as api from 'src/services';

interface CategoryFilterProps {
    categories: Array<{
        _id: string;
        name: string;
        slug: string;
        cover?: { url: string };
    }>;
    onProductsChange?: (products: any[]) => void; // callback to update parent ProductListing
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ categories, onProductsChange }) => {
    const theme = useTheme();
    const router = useRouter();
    const searchParams = useSearchParams();

    const [activeCategory, setActiveCategory] = useState<string | null>(null);

    // Sync with URL params on component mount and when searchParams change
    useEffect(() => {
        const categoryParam = searchParams.get('category');
        setActiveCategory(categoryParam);

        // If there's a category in URL, fetch products for it
        if (categoryParam) {
            fetchCategoryProducts(categoryParam);
        }
    }, [searchParams]);

    if (!categories || categories.length === 0) return null;

    const fetchCategoryProducts = async (slug: string) => {
        try {
            const res = await api.getPhysicalProductsByCategory('', slug, '');
            console.log("Res Data:", res);
            onProductsChange?.(res.data || []);
        } catch (err) {
            console.error(err);
        }
    };

    const handleCategoryClick = async (slug: string) => {
        console.log("Clicked category:", slug);

        // Update URL with category parameter
        const params = new URLSearchParams(searchParams.toString());

        if (slug) {
            params.set('category', slug);
        } else {
            params.delete('category');
        }

        // Remove other conflicting params if needed
        params.delete('subcategory'); // Remove subcategory when category changes

        const queryString = params.toString();
        router.push(`?${queryString}`, { scroll: false });
    };

    const handleClearFilter = () => {
        console.log("Clearing category filter");

        // Remove category from URL
        const params = new URLSearchParams(searchParams.toString());
        params.delete('category');

        const queryString = params.toString();
        router.push(queryString ? `?${queryString}` : '', { scroll: false });

        // Optionally reset products to initial state
        onProductsChange?.([]);
    };

    return (
        <Box
            sx={{
                width: '100%',
                p: 1,
                borderRadius: 1,
                background: createGradient(theme.palette.primary.main, theme.palette.primary.dark),
                overflowX: 'auto',
            }}
        >
            <Stack direction="row" alignItems="center" spacing={1}>
                {/* Clear Filter Button - Only show when a category is active */}
                {activeCategory && (
                    <Tooltip title="Clear category filter">
                        <IconButton
                            onClick={handleClearFilter}
                            size="small"
                            sx={{
                                color: 'white',
                                backgroundColor: 'rgba(255,255,255,0.2)',
                                '&:hover': {
                                    backgroundColor: 'rgba(255,255,255,0.3)',
                                },
                            }}
                        >
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                )}

                {/* Categories */}
                {categories.map((cat, index) => (
                    <React.Fragment key={cat._id}>
                        <Box
                            onClick={() => handleCategoryClick(cat.slug)}
                            sx={{
                                px: 1,
                                py: 0.5,
                                cursor: 'pointer',
                                whiteSpace: 'nowrap',
                                textAlign: 'center',
                                color: activeCategory === cat.slug ? 'primary.main' : 'white',
                                backgroundColor: activeCategory === cat.slug ? 'white' : 'transparent',
                                fontWeight: activeCategory === cat.slug ? 'bold' : 'normal',
                                '&:hover': {
                                    backgroundColor: activeCategory === cat.slug ? 'white' : 'primary.dark',
                                },
                                borderRadius: 1,
                                transition: 'all 0.2s ease',
                            }}
                        >
                            {cat.name}
                        </Box>

                        {index < categories.length - 1 && (
                            <Box
                                sx={{
                                    width: '1px',
                                    bgcolor: 'rgba(255,255,255,0.5)',
                                    mx: 0.5,
                                }}
                            />
                        )}
                    </React.Fragment>
                ))}
            </Stack>
        </Box>
    );
};

export default CategoryFilter;