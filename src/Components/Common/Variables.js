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

export const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
        month: '2-digit',
        day: '2-digit'
    };
    return date
        .toLocaleDateString('ko-KR', options)
        .replace('.', '월 ')
        .replace('.', '일')
        .replace(' ', '');
};

// 토글 점수 리스트
export const ScoreList = [
    "주요 행사 MVP (+5점)",
    "세미나 파트별 MVP (+3점)",
    "스터디 개최 및 수료 (+5점)",
    "스터디 참여및 수료 (+3점)",
    "파드 소통 인증 (+1점)",
    "디스콰이엇 회고 (+3점)",
    "세미나 지각 벌점 (1점)",
    "세미나 결석 벌점 (2점)",
    "과제 지각 벌점 (0.5점)",
    "과제 미제출 (1점)",
    "벌점 조정",
];