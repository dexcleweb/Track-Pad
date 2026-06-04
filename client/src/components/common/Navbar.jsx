import { useEffect, useMemo, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, Moon, ShoppingBag, Sun, X, LayoutDashboard } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const isDark = theme === "dark";
  const isAdmin = user?.role === "ADMIN";

  const navItems = useMemo(() => {
    const items = [
      { to: "/", label: "Home" },
      { to: "/products", label: "Products" },
    ];

    if (user) {
      items.push(
        { to: "/my-purchases", label: "My Purchases" },
        { to: "/counselling", label: "Counselling" }
      );
    }

    if (isAdmin) {
      items.push({
        to: "/admin",
        label: "Admin",
        admin: true,
      });
    }

    if (!user) {
      items.push({ to: "/login", label: "Login" });
    }

    return items;
  }, [user, isAdmin]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  const handleLogout = () => {
    logout();
    closeMenu();
  };

  const navLinkStyle = ({ isActive }) => ({
    color: isActive
      ? isDark
        ? "#f5d800"
        : "#5f4600"
      : isDark
      ? "#b6aa61"
      : "#806b24",
    background: isActive
      ? isDark
        ? "rgba(245, 216, 0, 0.12)"
        : "rgba(180, 140, 0, 0.1)"
      : "transparent",
  });

  return (
    <header
      className={`gv-navbar ${scrolled ? "gv-navbar-scrolled" : ""}`}
      data-theme-mode={theme}
    >
      <div className="gv-nav-inner">
        <Link to="/" className="gv-logo" onClick={closeMenu}>
          Habit-Hive
        </Link>

        <nav className="gv-desktop-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={item.admin ? "gv-nav-link gv-admin-link" : "gv-nav-link"}
              style={navLinkStyle}
            >
              {item.admin && <LayoutDashboard size={14} />}
              {item.label}
            </NavLink>
          ))}

          {user && (
            <button className="gv-logout-btn" onClick={logout}>
              Logout
            </button>
          )}

          <Link to="/products" className="gv-shop-btn">
            <ShoppingBag size={15} />
            Shop
          </Link>

          <button
            className="gv-icon-btn"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {isDark ? <Sun size={17} /> : <Moon size={17} />}
          </button>
        </nav>

        <div className="gv-mobile-actions">
          <button
            className="gv-icon-btn"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {isDark ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          <button
            className="gv-menu-btn"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="gv-mobile-menu">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              onClick={closeMenu}
              className={
                item.admin ? "gv-mobile-link gv-admin-link" : "gv-mobile-link"
              }
              style={navLinkStyle}
            >
              {item.admin && <LayoutDashboard size={14} />}
              {item.label}
            </NavLink>
          ))}

          {user && (
            <button className="gv-mobile-logout" onClick={handleLogout}>
              Logout
            </button>
          )}

          <Link to="/products" className="gv-mobile-shop" onClick={closeMenu}>
            <ShoppingBag size={16} />
            Shop Products
          </Link>
        </div>
      )}

      <style>{`
        .gv-navbar {
          position: sticky;
          top: 0;
          z-index: 100;
          font-family: Inter, "DM Sans", system-ui, sans-serif;
          background: var(--gv-nav-bg);
          border-bottom: 1px solid transparent;
          transition: 0.25s ease;
        }

        .gv-navbar[data-theme-mode="dark"] {
          --gv-nav-bg: rgba(8, 18, 12, 0.96);
          --gv-border: rgba(245, 216, 0, 0.14);
          --gv-text-soft: #b6aa61;
          --gv-icon-bg: rgba(245, 216, 0, 0.08);
          --gv-icon-border: rgba(245, 216, 0, 0.22);
          --gv-shadow: rgba(0, 0, 0, 0.28);
        }

        .gv-navbar[data-theme-mode="light"] {
          --gv-nav-bg: rgba(255, 253, 240, 0.96);
          --gv-border: rgba(150, 115, 0, 0.16);
          --gv-text-soft: #806b24;
          --gv-icon-bg: rgba(160, 120, 0, 0.06);
          --gv-icon-border: rgba(160, 120, 0, 0.2);
          --gv-shadow: rgba(87, 69, 0, 0.09);
        }

        .gv-navbar-scrolled {
          backdrop-filter: blur(18px);
          border-bottom-color: var(--gv-border);
          box-shadow: 0 12px 32px var(--gv-shadow);
        }

        .gv-nav-inner {
          width: min(1180px, 92%);
          height: 68px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        .gv-logo {
          font-size: 1.38rem;
          font-weight: 950;
          letter-spacing: -0.045em;
          background: linear-gradient(120deg, #f5d800, #22c55e 55%, #e6a800);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-decoration: none;
          white-space: nowrap;
        }

        .gv-desktop-nav {
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .gv-nav-link,
        .gv-mobile-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          text-decoration: none;
          font-weight: 750;
          letter-spacing: -0.015em;
          transition: 0.2s ease;
        }

        .gv-nav-link {
          font-size: 0.86rem;
          padding: 7px 12px;
          border-radius: 999px;
        }

        .gv-admin-link {
          border: 1px solid rgba(34, 197, 94, 0.22);
        }

        .gv-nav-link:hover,
        .gv-mobile-link:hover {
          transform: translateY(-1px);
          background: rgba(34, 197, 94, 0.11) !important;
          color: #22c55e !important;
        }

        .gv-logout-btn,
        .gv-mobile-logout {
          border: 1px solid var(--gv-icon-border);
          background: transparent;
          color: var(--gv-text-soft);
          cursor: pointer;
          font-weight: 750;
          transition: 0.2s ease;
        }

        .gv-logout-btn {
          border-radius: 999px;
          padding: 7px 12px;
          font-size: 0.86rem;
        }

        .gv-shop-btn,
        .gv-mobile-shop {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          border-radius: 999px;
          background: linear-gradient(135deg, #f5d800, #22c55e);
          color: #08120c;
          font-weight: 900;
          text-decoration: none;
          box-shadow: 0 8px 24px rgba(34, 197, 94, 0.22);
          transition: 0.2s ease;
        }

        .gv-shop-btn {
          margin-left: 6px;
          padding: 8px 16px;
          font-size: 0.86rem;
        }

        .gv-icon-btn,
        .gv-menu-btn {
          width: 38px;
          height: 38px;
          border-radius: 999px;
          border: 1px solid var(--gv-icon-border);
          background: var(--gv-icon-bg);
          color: #22c55e;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: 0.2s ease;
        }

        .gv-menu-btn {
          border-radius: 13px;
        }

        .gv-mobile-actions {
          display: none;
          align-items: center;
          gap: 8px;
        }

        .gv-mobile-menu {
          width: min(1180px, 92%);
          margin: 0 auto;
          padding: 10px 0 18px;
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        .gv-mobile-link,
        .gv-mobile-logout,
        .gv-mobile-shop {
          width: 100%;
          padding: 12px 14px;
          border-radius: 14px;
          font-size: 0.94rem;
          text-align: left;
        }

        .gv-mobile-logout {
          border: 1px solid var(--gv-icon-border);
        }

        .gv-mobile-shop {
          margin-top: 5px;
        }

        @media (max-width: 820px) {
          .gv-desktop-nav {
            display: none;
          }

          .gv-mobile-actions {
            display: flex;
          }

          .gv-logo {
            font-size: 1.3rem;
          }
        }

        @media (min-width: 821px) {
          .gv-mobile-menu {
            display: none;
          }
        }
      `}</style>
    </header>
  );
};

export default Navbar;