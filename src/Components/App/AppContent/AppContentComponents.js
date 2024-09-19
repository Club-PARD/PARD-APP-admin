import styled from "styled-components";

export const AppContainer = styled.div `
    display: flex;
    min-height: 100vh;
`;

export const NavBarContainer = styled.div `
    min-width: 250px;
    background: var(--black-card, #2a2a2a);
`;

export const MainContent = styled.div `
    background-color: #fff;
    width: calc(100% - 250px);
`;
