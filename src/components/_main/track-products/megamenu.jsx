"use client";

import React, { useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import "bootstrap/dist/css/bootstrap.min.css";

const MegaMenu = ({ categories }) => {
    const [activeMenu, setActiveMenu] = useState(null);
    const timeoutRef = useRef(null);
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleMouseEnter = (idx) => {
        clearTimeout(timeoutRef.current);
        setActiveMenu(idx);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => setActiveMenu(null), 200);
    };

    const handleSubCategorySelect = (categorySlug, subCategorySlug) => {
        // Build new query string with slugs
        const params = new URLSearchParams(searchParams.toString());
        params.set("category", categorySlug);
        params.set("subcategory", subCategorySlug);

        // Navigate using slugs
        router.push(`?${params.toString()}`);
    };

    return (
        <nav
            className="navbar navbar-expand-lg bg-white border-bottom shadow-sm position-relative"
            onMouseLeave={handleMouseLeave}
        >
            <div className="container-fluid">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0 d-flex align-items-center">
                    {categories.map((category, idx) => (
                        <li
                            key={category._id || idx}
                            className={`nav-item dropdown mx-3 ${activeMenu === idx ? "active" : ""}`}
                            onMouseEnter={() => handleMouseEnter(idx)}
                        >
                            <a
                                className="nav-link fw-bold text-uppercase dropdown-toggle"
                                href="#"
                                role="button"
                            >
                                {category.name}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Dropdown section */}
            {activeMenu !== null && categories[activeMenu]?.subCategories?.length > 0 && (
                <div
                    className="dropdown-menu border-0 rounded-0 py-3 shadow-sm d-block"
                    style={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        width: "100%",
                        backgroundColor: "#fff",
                        borderTop: "2px solid #d32f2f",
                        zIndex: 1050,
                        transition: "opacity 0.2s ease-in-out",
                    }}
                    onMouseEnter={() => handleMouseEnter(activeMenu)}
                    onMouseLeave={handleMouseLeave}
                >
                    <div className="container-fluid py-2">
                        <div className="row g-0"> {/* Remove gutter between columns */}
                            {(() => {
                                const subCategories = categories[activeMenu].subCategories;
                                const totalColumns = Math.ceil(subCategories.length / 5);

                                return Array.from({ length: totalColumns }).map((_, colIndex) => {
                                    const startIndex = colIndex * 5;
                                    const endIndex = startIndex + 5;
                                    const columnItems = subCategories.slice(startIndex, endIndex);

                                    return (
                                        <div key={`col-${colIndex}`} className="col-auto"> {/* Use col-auto for tight fit */}
                                            <div className="d-flex flex-column px-3"> {/* Add horizontal padding instead */}
                                                {columnItems.map((sub, itemIndex) => (
                                                    <a
                                                        key={sub._id || itemIndex}
                                                        href="#"
                                                        className="text-dark text-decoration-none d-block py-1"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            handleSubCategorySelect(
                                                                categories[activeMenu].slug,
                                                                sub.slug
                                                            );
                                                        }}
                                                    >
                                                        {sub.name}
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                });
                            })()}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default MegaMenu;
