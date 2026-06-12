import {useState} from "react";
import styled from "styled-components";

function SelectNumber({onSelectNumber}) {
    const [selectNumber, setSelectNumber] = useState();

    const arayNumber = [1, 2, 3, 4, 5, 6];

    //function to handle number select
    const handleNumberSelect = (number) => {
        setSelectNumber(number);
        onSelectNumber(number);
        //calling onSelectNumber prop with the selected number
    };

    return (
        // using map function to display 6 button
        <NumberSelector>
            <div className="numContainer">
                {arayNumber.map((value, i) => (
                    <Box key={i} onClick={() => handleNumberSelect(value)} isSelected={value == selectNumber}>
                        {value}
                    </Box>
                ))}
            </div>
            <p>Select Numbers</p>
        </NumberSelector>
    );
}

export default SelectNumber;

const NumberSelector = styled.div`
    .numContainer {
        display: flex;
        gap: 24px;
    }
    p {
        font-size: 24px;
        font-weight: 700;
        float: right;
        margin-top: 30px;
    }
`;

const Box = styled.div`
    cursor: pointer;
    height: 50px;
    width: 50px;
    border: 1px solid black;
    font-weight: 700;
    font-size: 24px;
    display: grid;
    place-items: center;
    background-color: ${(props) => (props.isSelected ? "black" : "white")};
    color: ${(props) => (props.isSelected ? "white" : "black")};
`;
