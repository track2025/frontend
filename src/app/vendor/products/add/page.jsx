'use client';

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

// components
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import AddProduct from 'src/components/_admin/products/addProduct';

// api
import * as api from 'src/services';

export default function Page() {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isVendor, setIsVendor] = useState(false);
  
  const { isAuthenticated, user } = useSelector(({ user }) => user);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, brandsRes] = await Promise.all([
          api.getAllCategories(),
          api.getAllBrandsByAdmin()
        ]);
        
        setCategories(categoriesRes?.data || []);
        setBrands(brandsRes?.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!isAuthenticated || user?.role === 'vendor') {
      setIsVendor(true);
    }
  }, [isAuthenticated, user]);

  if (isLoading) {
    return <div>Loading...</div>; // Replace with your loading component
  }

  return (
    <div>
      <HeaderBreadcrumbs
        admin
        heading="Product List"
        links={[
          {
            name: 'Dashboard',
            href: '/'
          },
          {
            name: 'Products',
            href: `/${isVendor ? 'vendor' : 'admin'}/products`
          },
          {
            name: 'Add Product'
          }
        ]}
      />
      <AddProduct brands={brands} categories={categories} isVendor={isVendor} pricing={{defaultCurrency: user?.defaultCurrency, defaultPrice: user?.defaultPrice}} />
    </div>
  );
}