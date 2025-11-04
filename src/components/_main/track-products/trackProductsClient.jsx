'use client';
import React, { useState } from 'react';
import ProductListing from '.';


export default function TrackProductsClient({ filters, categories, selectedCategory, selectedSubCategory }) {
    const [products, setProducts] = useState([]);


    return (
        <div className=''>
            {/* <FilterChips /> */}
            <ProductListing
                filters={filters}
                initialProducts={products}
                category={selectedCategory ? { slug: selectedCategory } : undefined}
                subCategory={selectedSubCategory ? { slug: selectedSubCategory } : undefined}
            />
        </div>
    );
}
