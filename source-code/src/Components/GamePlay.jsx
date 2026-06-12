import {useState} from "react";
import RollDice from "./RollDice";
import SelectNumber from "./SelectNumber";
import TotalScore from "./TotalScore";
import styled from "styled-components";

function GamePlay() {
    const [totalScore, setTotalScore] = useState(0);

    const [selectedNumber, setSelectedNumber] = useState(null);

    const [showAlert, setShowAlert] = useState(false); // State for displaying alert

    const handleRollDice = (rolledNumber) => {
        console.log("Rolled Number:", rolledNumber);

        // Check if a number is selected
        if (selectedNumber !== null) {
            // Check if selected number matches the rolled number
            if (selectedNumber === rolledNumber) {
                console.log("Matched!");
                // Add the rolled number to the total score
                setTotalScore(totalScore + rolledNumber);
            } else {
                console.log("Not Matched!");
                // Deduct 2 points for a wrong guess
                setTotalScore(Math.max(0, totalScore - 2));
            }
        } else {
            setShowAlert(true); // show alret message to user if number is not selected
        }
    };

    // function to handle select number event
    const handleSelectNumber = (number) => {
        console.log("Updated Total Score:", totalScore);
        console.log("Selected Number:", number);
        setSelectedNumber(number);
    };

    // Reset the total score to 0
    const handleResetScore = () => {
        setTotalScore(0);
    };

    return (
        <div>
            {showAlert && (
                <AlertConatiner>
                    Please select a number first!
                    <button onClick={() => setShowAlert(false)}>Close</button>
                </AlertConatiner>
            )}
            <Container>
                <div className="header-section">
                    <TotalScore score={totalScore} />
                    <SelectNumber onSelectNumber={handleSelectNumber} />
                </div>
                <RollDice onRoll={handleRollDice} resetScore={handleResetScore} />
            </Container>
        </div>
    );
}

export default GamePlay;

const AlertConatiner = styled.div`
    background-color: aliceblue;
    font-weight: 500;
    text-align: center;
    button {
        background-color: black;
        color: white;
        padding: 2px;
        width: 60px;
        border-radius: 10px;
        margin-left: 3px;
        cursor: pointer;
    }
`;

const Container = styled.div`
    .header-section {
        display: flex;
        max-width: 1280px;
        height: 151px;
        margin: 0 auto;
        justify-content: space-between;
        align-items: center;
        margin-top: 60px;
    }
`;
