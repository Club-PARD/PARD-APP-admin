import { Icon, MenuLink, NavItemContent } from "./NavItemComponents";

// Nav Item Component
export const NavItem = ({ path, pathname, iconSrc, label, exact }) => {
    // isActive : 현재 경로가 NavItem과 일치하는지 확인하는 값
    const isActive = exact ? pathname === path : pathname.startsWith(path);
    

    return (
        <li>
            <MenuLink to={path}>
                <NavItemContent $active={isActive}>
                    <Icon src={iconSrc} />
                    {label}
                </NavItemContent>
            </MenuLink>
        </li>
    );
};
