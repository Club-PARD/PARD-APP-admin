// 변수 : 필터 옵션
export const options = [
    "전체",
    "기획파트",
    "디자인파트",
    "웹파트",
    "iOS파트",
    "서버파트"
];

export const PartList = [
    "기획파트",
    "디자인파트",
    "웹파트",
    "iOS파트",
    "서버파트"
];

export const attendanceList = [
    { name: "OT", desc: "OT" },
    { name: "SEMINAR_1", desc: "1차 세미나" },
    { name: "SEMINAR_2", desc: "2차 세미나" },
    { name: "SEMINAR_3", desc: "3차 세미나" },
    { name: "SEMINAR_4", desc: "4차 세미나" },
    { name: "SEMINAR_5", desc: "5차 세미나" },
    { name: "SEMINAR_6", desc: "6차 세미나" },
    { name: "UNION_SEMINAR_1", desc: "연합세미나 1" },
    { name: "UNION_SEMINAR_2", desc: "연합세미나 2" },
    { name: "IDEA_PITCH", desc: "아이디어 피칭" },
    { name: "FINAL_MEETING", desc: "종강총회" }
];

export const member = [
    "ROLE_YB",
    "ROLE_OB",
    "ROLE_ADMIN"
];

export const memberFillter = [
    "ALL",
    "ROLE_YB",
    "ROLE_OB",
    "ROLE_ADMIN"
];

export const handleChangeRoleName = (role) => {
    switch (role) {
        case "ROLE_ADMIN":
            return "운영진";
            break;
        case "ROLE_YB":
            return "파디";
            break;
        case "ROLE_OB":
            return "파도";
            break;
        case "ALL" :
            return "전체";
            break;
        default:
            break;
    }
}

export function getPartName(part) {
    switch (part) {
        case "기획파트":
            return "기획";
        case "iOS파트":
            return "iOS";
        case "서버파트":
            return "서버";
        case "웹파트":
            return "웹";
        case "디자인파트":
            return "디자인";
        case "앱":
            return "앱";
        default:
            return part;
    }
}