import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, Phone } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

interface NavItemProps {
  label: string;
  path: string;
  onClick?: () => void;
  hasDropdown?: boolean;
  children?: React.ReactNode;
  isActive?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({
  label,
  path,
  onClick,
  hasDropdown,
  children,
  isActive
}) => {
  if (hasDropdown) {
    return (
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger
              style={{ fontWeight: 400 }}
              className={cn(
                "bg-transparent hover:bg-gray-100/60 text-[15px] font-normal py-2 px-3.5 rounded-full transition-all duration-200 text-gray-800 hover:text-[#ED276E]",
                isActive ? "text-[#ED276E] font-medium" : ""
              )}
            >
              {label}
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] bg-white/95 backdrop-blur-2xl rounded-2xl border border-gray-100 shadow-2xl">
                {children}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    );
  }

  return (
    <Link
      href={path}
      style={{ fontWeight: 400 }}
      className={cn(
        "bg-transparent hover:bg-gray-100/60 min-h-[38px] gap-2 whitespace-nowrap px-3.5 py-2 rounded-full transition-all duration-200 text-[15px] font-normal flex items-center text-gray-800 hover:text-[#ED276E]",
        isActive ? "text-[#ED276E] font-medium" : ""
      )}
      onClick={onClick}
    >
      {label}
    </Link>
  );
};

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, href, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          ref={ref}
          href={href || '#'}
          className={cn(
            "block select-none space-y-1 rounded-xl p-3.5 leading-none no-underline outline-none transition-all duration-200 hover:bg-pink-50/60 border border-transparent hover:border-pink-100/50 group",
            className
          )}
          {...props}
        >
          <div className="text-base font-semibold text-gray-900 group-hover:text-[#ED276E] transition-colors">{title}</div>
          <p className="line-clamp-2 text-xs leading-relaxed text-gray-500 mt-1">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = () => setIsMenuOpen(false);

  const serviceDropdownItems = [
    {
      title: 'Painting Services',
      description: 'From interiors to exteriors, flawless finishes that last.',
      path: '/services/painting'
    },
    {
      title: 'Customized Painting',
      description: 'Personalised art, murals, and creative wall concepts.',
      path: '/services/customized-painting'
    },
    {
      title: 'Wall Decor',
      description: 'Stylish wall treatments, textures, stencils, and wallpapers.',
      path: '/services/wall-decor'
    },
    {
      title: 'Wood Services',
      description: 'Coating, polishing, and carpentry for timeless woodwork.',
      path: '/services/wood-services'
    }
  ];

  const navItems = [
    {
      label: 'Services',
      path: '/services/painting',
      hasDropdown: true,
      children: serviceDropdownItems.map((item, index) => (
        <ListItem
          key={index}
          href={item.path}
          title={item.title}
        >
          {item.description}
        </ListItem>
      ))
    },
    {
      label: 'Products',
      path: '/products'
    },
    {
      label: 'Budget Calculator',
      path: '/paint-budget-calculator'
    },
    {
      label: 'Colour Visualisers',
      path: '/colour-visualiser'
    },
    {
      label: 'Enquiry',
      path: '/enquiry'
    },
    {
      label: 'About',
      path: '/about'
    },
    {
      label: 'Blog',
      path: '/blog'
    }
  ];

  return (
    <div className={cn(
      "fixed left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ease-out",
      "w-[94%] sm:w-[92%] lg:w-max lg:max-w-[95vw] mx-auto mt-3 sm:mt-2 lg:mt-3.5",
      "bg-white/85 backdrop-blur-xl",
      "border border-gray-200/80",
      "shadow-[0_8px_30px_rgba(0,0,0,0.08)]",
      "rounded-full",
      isScrolled ? "bg-white/95 backdrop-blur-2xl shadow-[0_12px_36px_rgba(0,0,0,0.12)] border-gray-300/80" : ""
    )}>
      <div className="flex flex-nowrap items-center gap-3 justify-between lg:justify-center lg:gap-6 px-5 py-2 lg:px-7 lg:py-2.5 w-auto">
        <Link href="/" className="group flex-shrink-0 flex items-center gap-2">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/ebe74153cda349e3ba80a6039bb1465f/e26e09b75bb9c4ab63f78d15296ed43e8713cb0b?placeholderIfAbsent=true"
            alt="HomeGlazer Logo"
            className="aspect-[2.6] object-contain w-24 lg:w-28 transition-all duration-300 group-hover:scale-105"
          />
        </Link>

        {/* Burger menu for mobile/tablet */}
        <button
          className="lg:hidden p-2 rounded-full bg-gray-100/80 hover:bg-gray-200 transition-all duration-200 text-gray-800"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        {/* Navigation for desktop */}
        <nav className="hidden lg:inline-flex gap-1 justify-center my-auto w-auto whitespace-nowrap">
          {navItems.map((item, index) => (
            <NavItem
              key={index}
              label={item.label}
              path={item.path}
              hasDropdown={item.hasDropdown}
              children={item.children}
              isActive={router.pathname === item.path || (item.path !== '/' && router.pathname.startsWith(item.path))}
            />
          ))}
        </nav>

        {/* Phone number - NO background, clean text & icon */}
        <a
          href="tel:+919717256514"
          style={{ fontWeight: 400 }}
          className="hidden lg:flex items-center gap-2 text-[15px] font-normal text-gray-800 hover:text-[#ED276E] transition-colors flex-shrink-0 pl-2"
          aria-label="Call us"
        >
          <Phone size={16} className="text-[#ED276E]" /> +91 97172 56514
        </a>
      </div>

      {/* Mobile menu overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[99999] top-[75px] lg:hidden transition-all duration-300">
          <div className="bg-white border border-gray-200 rounded-3xl mx-4 mt-3 shadow-2xl max-h-[75vh] overflow-hidden">
            <div className="h-full overflow-y-auto p-5 space-y-3">
              <nav className="flex flex-col gap-2">
                <div className="w-full">
                  <details className="w-full group">
                    <summary style={{ fontWeight: 400 }} className="py-3 px-5 bg-gray-50 rounded-2xl border border-gray-100 hover:bg-gray-100 transition-all duration-200 flex items-center justify-between cursor-pointer font-normal text-gray-800 text-base">
                      <span>Services</span>
                      <ChevronDown className="group-open:rotate-180 transition-transform duration-200 text-[#ED276E]" size={18} />
                    </summary>
                    <div className="pl-2 flex flex-col gap-2 mt-2">
                      {serviceDropdownItems.map((item, index) => (
                        <Link
                          key={index}
                          href={item.path}
                          onClick={closeMenu}
                          style={{ fontWeight: 400 }}
                          className="py-2.5 px-4 text-sm bg-white rounded-xl border border-gray-100 hover:bg-pink-50/50 hover:text-[#ED276E] transition-all duration-200 w-full font-normal text-gray-700 flex items-center justify-between"
                        >
                          <span>{item.title}</span>
                          <span className="text-xs text-gray-400 font-normal">Explore →</span>
                        </Link>
                      ))}
                    </div>
                  </details>
                </div>

                {[
                  { label: 'Products', path: '/products' },
                  { label: 'Budget Calculator', path: '/paint-budget-calculator' },
                  { label: 'Colour Visualisers', path: '/colour-visualiser' },
                  { label: 'Enquiry', path: '/enquiry' },
                  { label: 'About Us', path: '/about' },
                  { label: 'Blog & Articles', path: '/blog' }
                ].map((nav, nIdx) => (
                  <Link
                    key={nIdx}
                    href={nav.path}
                    onClick={closeMenu}
                    style={{ fontWeight: 400 }}
                    className="py-3 px-5 bg-gray-50 rounded-2xl border border-gray-100 hover:bg-gray-100 text-gray-800 font-normal text-base transition-all duration-200 w-full flex items-center justify-between"
                  >
                    <span>{nav.label}</span>
                    <span className="text-xs text-[#299dd7] font-medium">View</span>
                  </Link>
                ))}

                <a
                  href="tel:+919717256514"
                  style={{ fontWeight: 400 }}
                  className="mt-3 w-full border border-[#ED276E] text-[#ED276E] hover:bg-[#ED276E] hover:text-white py-3.5 px-5 rounded-2xl font-normal text-center flex items-center justify-center gap-2 transition-all text-sm"
                >
                  <Phone size={16} /> Call +91 97172 56514
                </a>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
