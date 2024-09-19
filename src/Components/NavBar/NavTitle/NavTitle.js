import { Logo, TitleDiv, TitleText } from "./NavTitleComponents"

export const NavTitle = () => {
    return (
        <li>
            <TitleDiv>
                <Logo src={require("../../../Assets/img/Logo/Original.png")}/>
                <TitleText>관리자 페이지</TitleText>
            </TitleDiv>
        </li>
    )
}