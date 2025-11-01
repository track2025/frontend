'use client';
import React, { useState } from 'react';
import CategoryFilter from './categoryFilter';
import FilterChips from './search-params-list';
import ProductListing from '.';

interface Props {
    filters: any[];
    categories: any[];
}

export default function TrackProductsClient({ filters, categories }: Props) {
    const [products, setProducts] = useState<any[]>([]);
    

    return (
        <div className='mt-4'>
            <CategoryFilter categories={categories} onProductsChange={setProducts} />
            <FilterChips />
            <ProductListing filters={filters} initialProducts={products} />
        </div>
    );
}
