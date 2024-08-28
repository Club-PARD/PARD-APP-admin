import styled from "styled-components";

const GenerationDropDown = ({ selectedGeneration, isDropDownGeneration, setIsDropDownGeneration, setSelectedGeneration }) => {
    // 기수 리스트 
    const GenerationList = [1, 2, 3, 4, 5];

    // 기수 변경 시 실행되는 핸들러
    const handleSelectGeneration = (generation) => {
        setSelectedGeneration(generation);
        sessionStorage.setItem('selectedGeneration', generation);
        setIsDropDownGeneration(false);
    }
    return (
        <DropdownGenerationBox>
            <SelectedGeneration><strong>{selectedGeneration}기</strong></SelectedGeneration>
            {
                isDropDownGeneration
                    ? <DropdownGenerationImg src={require("../../Assets/img/Polygon.png")} onClick={() => setIsDropDownGeneration(false)} />
                    : <DropdownGenerationImg src={require("../../Assets/img/PolygonDown.png")} onClick={() => setIsDropDownGeneration(true)} />

            }
            {isDropDownGeneration && 
                <DropdownGenerationListBox>
                    {
                        GenerationList.map((generation, index) => (
                            <DropdownGenerationItemBox key={index} onClick={() => handleSelectGeneration(generation)}>
                                <span>
                                    {generation}기
                                </span>
                            </DropdownGenerationItemBox>
                        ))

                    }
                </DropdownGenerationListBox>
            }
        </DropdownGenerationBox>
    )
}

export default GenerationDropDown;

const DropdownGenerationBox = styled.div`
    width: 100px;
    height : 35px;
    /* background-color: gray; */
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin : 0;
    padding : 0;
    position: relative;
    border: 1px solid var(--primary-blue, #5262f5);
    box-sizing: border-box;
    margin-left: 10px;
    background: var(--primary-blue-10, #eeeffe);
    border-radius: 4px;
    color: var(--primary-blue, #5262f5);
    z-index: 1;
`;

const DropdownGenerationListBox = styled.div`
    width: 100%;
    height : auto;
    top : 40px;
    position: absolute;
    background-color: white;
    color: var(--primary-blue, #5262f5);
`

const DropdownGenerationItemBox = styled.div`
    width: 100%;
    height : 30px;
    /* background-color: yellow; */
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid var(--primary-blue, #5262f5);
    box-sizing: border-box;
    margin-bottom: 0.5px;

    &:hover {
        box-shadow: 0px 4px 8px 0px rgba(0, 17, 170, 0.25);
    }
    &:active {
        box-shadow: 0px 4px 8px 0px rgba(0, 17, 170, 0.25) inset;
    }
`

const DropdownGenerationImg = styled.img`
    width: 15px;
    margin-right: 10px;
`;

const SelectedGeneration = styled.p`
    margin-left: 20px;
`;