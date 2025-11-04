"use client";

import React, { useState, useRef } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useTheme } from "@mui/material/styles";

const MegaMenu = ({ categories, onSelectSubCategory }) => {
    const theme = useTheme();
    const [activeMenu, setActiveMenu] = useState(null);
    const timeoutRef = useRef(null);
    const scrollRef = useRef(null);

    const handleMouseEnter = (idx) => {
        clearTimeout(timeoutRef.current);
        setActiveMenu(idx);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => setActiveMenu(null), 200);
    };

    const handleSubCategorySelect = (categorySlug, subCategorySlug) => {
        onSelectSubCategory(categorySlug, subCategorySlug);
    };

    const scrollMenu = (direction) => {
        if (scrollRef.current) {
            const scrollAmount = 200;
            scrollRef.current.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth",
            });
        }
    };

    const primaryColor = theme.palette.primary.main;

    return (
        <nav
            className="navbar navbar-expand-lg bg-white border-bottom shadow-sm position-relative"
            onMouseLeave={handleMouseLeave}
        >
            <div className="container-fluid position-relative">
                <div className="overflow-hidden w-100 position-relative px-2">
                    <ul
                        ref={scrollRef}
                        className="navbar-nav flex-row flex-nowrap align-items-center w-100 mb-2 mb-lg-0"
                        style={{
                            overflowX: "auto",
                            scrollbarWidth: "none",
                            msOverflowStyle: "none",
                            whiteSpace: "nowrap",
                            scrollBehavior: "smooth",
                        }}
                    >
                        {/* Left Scroll Button */}
                        <li className="nav-item d-lg-none me-2 flex-shrink-0">
                            <button
                                onClick={() => scrollMenu("left")}
                                className="btn shadow-sm d-flex align-items-center justify-content-center"
                                style={{
                                    borderRadius: "50%",
                                    width: "44px",
                                    height: "44px",
                                    backgroundColor: primaryColor,
                                    color: "#fff",
                                }}
                            >
                                <IoIosArrowBack size={28} />
                            </button>
                        </li>

                        {/* Category Items */}
                        {categories.map((category, idx) => (
                            <li
                                key={category._id || idx}
                                className={`nav-item dropdown mx-3 flex-shrink-0 ${activeMenu === idx ? "active" : ""
                                    }`}
                                onMouseEnter={() => handleMouseEnter(idx)}
                            >
                                <a
                                    className="nav-link fw-semibold text-uppercase dropdown-toggle"
                                    href="#"
                                    role="button"
                                    style={{
                                        color:
                                            activeMenu === idx
                                                ? primaryColor
                                                : "#212529",
                                        transition: "color 0.2s ease",
                                    }}
                                >
                                    {category.name}
                                </a>
                            </li>
                        ))}

                        {/* Right Scroll Button */}
                        <li className="nav-item d-lg-none ms-2 flex-shrink-0">
                            <button
                                onClick={() => scrollMenu("right")}
                                className="btn shadow-sm d-flex align-items-center justify-content-center"
                                style={{
                                    borderRadius: "50%",
                                    width: "44px",
                                    height: "44px",
                                    backgroundColor: primaryColor,
                                    color: "#fff",
                                }}
                            >
                                <IoIosArrowForward size={28} />
                            </button>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Dropdown Section */}
            {activeMenu !== null &&
                categories[activeMenu]?.subCategories?.length > 0 && (
                    <div
                        className="dropdown-menu border-0 rounded-0 py-2 shadow-sm d-block"
                        style={{
                            position: "absolute",
                            top: "95%",
                            left: 0,
                            width: "100%",
                            backgroundColor: "#fff",
                            zIndex: 1050,
                            transition: "opacity 0.2s ease-in-out",
                        }}
                        onMouseEnter={() => handleMouseEnter(activeMenu)}
                        onMouseLeave={handleMouseLeave}
                    >
                        <div className="container-fluid py-2">
                            <div className="row g-0">
                                {(() => {
                                    const subCategories =
                                        categories[activeMenu].subCategories;
                                    const totalColumns = Math.ceil(
                                        subCategories.length / 5
                                    );

                                    return Array.from({
                                        length: totalColumns,
                                    }).map((_, colIndex) => {
                                        const startIndex = colIndex * 5;
                                        const endIndex = startIndex + 5;
                                        const columnItems =
                                            subCategories.slice(
                                                startIndex,
                                                endIndex
                                            );

                                        return (
                                            <div
                                                key={`col-${colIndex}`}
                                                className="col-auto"
                                            >
                                                <div className="d-flex flex-column px-3">
                                                    {columnItems.map(
                                                        (sub, itemIndex) => (
                                                            <a
                                                                key={
                                                                    sub._id ||
                                                                    itemIndex
                                                                }
                                                                href="#"
                                                                className="text-dark text-decoration-none d-block py-1"
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    handleSubCategorySelect(
                                                                        categories[
                                                                            activeMenu
                                                                        ].slug,
                                                                        sub.slug
                                                                    );
                                                                }}
                                                                style={{
                                                                    transition:
                                                                        "color 0.2s ease",
                                                                }}
                                                                onMouseEnter={(
                                                                    e
                                                                ) =>
                                                                (e.target.style.color =
                                                                    primaryColor)
                                                                }
                                                                onMouseLeave={(
                                                                    e
                                                                ) =>
                                                                (e.target.style.color =
                                                                    "#212529")
                                                                }
                                                            >
                                                                {sub.name}
                                                            </a>
                                                        )
                                                    )}
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
