import React from 'react';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
// next
import { useRouter } from 'next-nprogress-bar';
// material
import typography from 'src/theme/typography';
import { Link, Stack } from '@mui/material';
import NextLink from 'next/link';
// components
import MenuDesktopPopover from 'src/components/popover/menudesktop';

// ----------------------------------------------------------------------

MenuDesktopItem.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  data: PropTypes.array.isRequired,
  item: PropTypes.object.isRequired,
  pathname: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onOpen: PropTypes.func.isRequired,
  isHome: PropTypes.bool,
  isOffset: PropTypes.bool.isRequired,
  scrollPosition: PropTypes.any,
  data: PropTypes.array.isRequired
};

function MenuDesktopItem({ ...props }) {
  const { item, pathname, isHome, isOpen, isOffset, onOpen, scrollPosition, onClose, isLoading, data } = props;
  const { title, path, isDropdown } = item;
  const anchorRef = React.useRef(null);
  const isActive = pathname === path;

  if (isDropdown) {
    return (
      <>
        <Link
          ref={anchorRef}
          className={` ${isOffset && isHome && 'offset'}`}
          id="composition-button"
          aria-controls={isOpen ? 'composition-menu' : undefined}
          aria-expanded={isOpen ? 'true' : undefined}
          aria-haspopup="true"
          onClick={onOpen}
          sx={{
            display: 'flex',
            cursor: 'pointer',
            alignItems: 'center',
            ...typography.subtitle2,
            color: 'text.primary',
            textDecoration: 'none',
            fontWeight: 500,
            transition: '.2s ease-in',
            cursor: 'pointer',
            '&:hover': {
              color: 'primary.main',
              textDecoration: 'none'
            },
            '&.offset': {
              color: 'text.primary'
            },
            '&.active': {
              color: 'primary.main'
            },
            '& .link-icon': {
              ml: 0.5,
              fontSize: 16
            }
          }}
        >
          <>
            {title}

            {isOpen ? (
              <KeyboardArrowUpRoundedIcon className="link-icon" />
            ) : (
              <KeyboardArrowDownRoundedIcon className="link-icon" />
            )}
          </>
        </Link>
        <MenuDesktopPopover
          isOpen={isOpen}
          scrollPosition={scrollPosition}
          onClose={onClose}
          isLoading={isLoading}
          data={data}
        />
      </>
    );
  }

  return (
    <Link
      component={NextLink}
      key={title}
      href={path}
      name={title}
      className={` ${isActive && 'active'}`}
      sx={{
        ...typography.subtitle2,
        color: 'text.primary',
        textDecoration: 'none',
        fontWeight: 500,
        transition: '.2s ease-in',
        cursor: 'pointer',
        '&:hover': {
          color: 'primary.main',
          textDecoration: 'none'
        },
        '&.offset': {
          color: 'text.primary'
        },
        '&.active': {
          color: 'primary.main'
        },
        '& .link-icon': {
          ml: 0.5,
          fontSize: 16
        }
      }}
    >
      {title}
    </Link>
  );
}

export default function MenuDesktop({ ...props }) {
  const { isOffset, isHome, navConfig, isLeft, categories } = props;

  const { pathname } = useRouter();

  const [open, setOpen] = useState(false);
  const router = useRouter();

  const [scrollPosition, setPosition] = useState(0);
  React.useLayoutEffect(() => {
    function updatePosition() {
      setPosition(window.pageYOffset);
    }
    window.addEventListener('scroll', updatePosition);
    updatePosition();
    return () => window.removeEventListener('scroll', updatePosition);
  }, []);

  useEffect(() => {
    if (open) {
      handleClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Stack
      gap={2}
      direction="row"
      sx={{
        ...(isLeft && {
          ml: 0
        })
      }}
    >
      {navConfig.map((links) => (
        <MenuDesktopItem
          scrollPosition={scrollPosition}
          key={Math.random()}
          data={categories}
          item={links}
          isLoading={false}
          pathname={pathname}
          isOpen={open}
          onOpen={handleOpen}
          onClose={handleClose}
          isOffset={isOffset}
          isHome={isHome}
          router={router}
        />
      ))}
    </Stack>
  );
}

MenuDesktop.propTypes = {
  isLeft: PropTypes.bool,
  isHome: PropTypes.bool,
  categories: PropTypes.array.isRequired,
  isOffset: PropTypes.bool.isRequired,
  navConfig: PropTypes.array.isRequired
};
