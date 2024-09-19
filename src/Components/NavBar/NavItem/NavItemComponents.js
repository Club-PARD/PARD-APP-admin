import { Link } from "react-router-dom";
import styled from "styled-components";

export const MenuLink = styled(Link)`
    text-decoration: none;
    display: block;
    width: 100%;
    color: var(--White, #fff);
    font-size: 18px;
    font-weight: 600;
    line-height: 24px;

    &:hover {
        background: #323553;
    }
`;

export const NavItemContent = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
    height: 58px;
    padding-left: 23px;
    background: ${(props) => (props.$active ? "linear-gradient(92deg, #5262F5 0%, #7B3FEF 100%)" : "transparent")};

    &:hover {
        background: #323553;
    }
`;

export const Icon = styled.img`
    width: 24px;
    height: 24px;
    margin-right: 14px;
`;
