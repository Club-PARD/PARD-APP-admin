import styled from "styled-components";

export const Nav = styled.nav`
    display: flex;
    flex-direction: column;

    padding-top: 20px;

    color: white;
    background: var(--black-card, #2a2a2a);
`;

export const HRLight = styled.hr`
    width: 91%;
    margin-top: 27px;
    border: 0.5px dotted #d9d9d9;
    margin-bottom: 10px;
    margin-left: 10px;
`;

export const Ul = styled.ul`
    list-style-type: none;
    padding: 0;
`;
