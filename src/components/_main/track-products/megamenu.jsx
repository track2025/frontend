"use client";
import React, { useState, useRef, useEffect } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useTheme } from "@mui/material/styles";
import { Typography } from "@mui/material";

const MegaMenu = ({ categories, onSelectSubCategory }) => {
    const theme = useTheme();
    const [activeMenu, setActiveMenu] = useState(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);
    const timeoutRef = useRef(null);
    const scrollRef = useRef(null);
    const primaryColor = theme.palette.primary.main;

    let color = theme.palette.mode === "light" ? "#000" : "#fff";
    let backgroundColor = theme.palette.mode === "light" ? "#fff" : "#121212";


    // check scroll position to toggle arrows visibility
    const handleScroll = () => {
        const el = scrollRef.current;
        if (!el) return;
        const { scrollLeft, scrollWidth, clientWidth } = el;
        setShowLeftArrow(scrollLeft > 0);
        setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 5);
    };

    useEffect(() => {
        const el = scrollRef.current;
        if (el) el.addEventListener("scroll", handleScroll);
        handleScroll(); // initial check
        return () => el && el.removeEventListener("scroll", handleScroll);
    }, []);

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

    return (
        <nav
            className="navbar navbar-expand-lg border-bottom shadow-sm position-relative"
            onMouseLeave={handleMouseLeave}
            style={{
                borderBottomColor: "#ddd"
            }}
        >
            <div className="container-fluid position-relative">
                {/* Floating Scroll Buttons */}
                {showLeftArrow && (
                    <button
                        onClick={() => scrollMenu("left")}
                        className="btn shadow-sm border rounded-circle position-absolute start-0 top-50 translate-middle-y d-flex align-items-center justify-content-center"
                        style={{
                            zIndex: 10,
                            width: 36,
                            height: 36,
                            transform: "translateY(-50%)",
                        }}
                    >
                        <IoIosArrowBack size={22} style={{ color: primaryColor }} />
                    </button>
                )}
                {showRightArrow && (
                    <button
                        onClick={() => scrollMenu("right")}
                        className="btn shadow-sm border rounded-circle position-absolute end-0 top-50 translate-middle-y d-flex align-items-center justify-content-center"
                        style={{
                            zIndex: 10,
                            width: 36,
                            height: 36,
                            transform: "translateY(-50%)",
                        }}
                    >
                        <IoIosArrowForward size={22} style={{ color: primaryColor }} />
                    </button>
                )}

                <div className="overflow-hidden w-100 position-relative px-4">
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
                        {categories.map((category, idx) => (
                            <li
                                key={category._id || idx}
                                className={`nav-item dropdown mx-3 flex-shrink-0 ${activeMenu === idx ? "active" : ""}`}
                                onMouseEnter={() => handleMouseEnter(idx)}
                            >
                                <Typography
                                    type="button"
                                    className="nav-link fw-semibold text-uppercase dropdown-toggle bg-transparent border-0"
                                    style={{
<<<<<<< HEAD
                                        color: activeMenu === idx && primaryColor ,
=======
                                        color: activeMenu === idx ? primaryColor : color,
>>>>>>> 2025/11/11/changes-from-docs
                                        transition: "color 0.2s ease",
                                    }}
                                >
                                    {category.name}
                                </Typography>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Dropdown Section */}
            {activeMenu !== null &&
                categories[activeMenu]?.subCategories?.length > 0 && (
                    <div
                        className="dropdown-menu border-0 rounded-0 py-1 shadow-sm d-block"
                        style={{
                            position: "absolute",
                            top: "95%",
                            left: 0,
                            width: "100%",
<<<<<<< HEAD
                            backgroundColor: theme.palette.background.paper,
=======
                            backgroundColor:backgroundColor,
>>>>>>> 2025/11/11/changes-from-docs
                            zIndex: 1050,
                            transition: "opacity 0.2s ease-in-out",
                        }}
                        onMouseEnter={() => handleMouseEnter(activeMenu)}
                        onMouseLeave={handleMouseLeave}
                    >
                        <div className="container-fluid py-1 px-4">
                            <div className="row g-0">
                                {(() => {
                                    const subCategories = categories[activeMenu].subCategories;
                                    const totalColumns = Math.ceil(subCategories.length / 5);
                                    return Array.from({ length: totalColumns }).map((_, colIndex) => {
                                        const startIndex = colIndex * 5;
                                        const endIndex = startIndex + 5;
                                        const columnItems = subCategories.slice(startIndex, endIndex);

                                        return (
                                            <div key={`col-${colIndex}`} className="col-auto">
                                                <div className="d-flex flex-column px-3">
                                                    {columnItems.map((sub, itemIndex) => (
                                                        <button
                                                            key={sub._id || itemIndex}
                                                            type="button"
                                                            className="bg-transparent border-0 text-start text-decoration-none d-block py-1"
                                                            onClick={() =>
                                                                handleSubCategorySelect(
                                                                    categories[activeMenu].slug,
                                                                    sub.slug
                                                                )
                                                            }
                                                            style={{ transition: "color 0.2s ease", color }}
                                                            onMouseEnter={(e) =>
                                                                (e.target.style.color = primaryColor)
                                                            }
                                                            onMouseLeave={(e) =>
                                                                (e.target.style.color = "#212529")
                                                            }
                                                        >
                                                            {sub.name}
                                                        </button>
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
