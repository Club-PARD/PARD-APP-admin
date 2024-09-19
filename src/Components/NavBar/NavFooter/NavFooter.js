import { Icon, MenuLink, NavItemContent } from "../NavItem/NavItemComponents";
import { DisplayDiv } from "./NavFooterComponents";
export const NavFooter = () => {
    return (
        <li>
            <DisplayDiv
                onClick={() => window.open(
                    "https://www.notion.so/we-pard/Pay-it-Forward-IT-ac8ea82c7313469ead747a89a5c9d3" +
                            "cb?pvs=4",
                    "_blank"
                )}>
                <NavItemContent>
                    <Icon
                        src={require("../../../Assets/img/NotionIcon.png")}
                        width={24}
                        height={24}
                        $right={14}/>
                    <MenuLink as="div">공식 노션 바로가기</MenuLink>
                </NavItemContent>
            </DisplayDiv>
        </li>
    )
}

