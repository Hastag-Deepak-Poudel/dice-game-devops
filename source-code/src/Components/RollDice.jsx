import styled from "styled-components";
import {useState} from "react";
import dice_1 from "../assets/Dice/dice_1.png";
import dice_2 from "../assets/Dice/dice_2.png";
import dice_3 from "../assets/Dice/dice_3.png";
import dice_4 from "../assets/Dice/dice_4.png";
import dice_5 from "../assets/Dice/dice_5.png";
import dice_6 from "../assets/Dice/dice_6.png";

function RollDice({onRoll, resetScore}) {
    const [rolledNumber, setRolledNumber] = useState(1);

    const [showRules, setShowRules] = useState(false);

    // creating a function to genrate random number between 1 to 6 for dice
    function getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }

    //function to roll the dice
    const handelRoll = () => {
        const randomNumber = getRandomNumber(1, 7);
        setRolledNumber(randomNumber);
        onRoll(randomNumber);
    };

    // Function to get the image source based on the rolled dice number
    function getImageSource(rolledNumber) {
        switch (rolledNumber) {
            case 1:
                return dice_1;
            case 2:
                return dice_2;
            case 3:
                return dice_3;
            case 4:
                return dice_4;
            case 5:
                return dice_5;
            case 6:
                return dice_6;
            default:
                return null;
        }
    }
    // Call the reset function passed from the GamePlay component
    const handleResetScoreClick = () => {
        resetScore();
    };

    // function to show rules
    const handelShowRules = () => {
        setShowRules(!showRules); // Toggle the value of showRules
    };
    return (
        <RollDiceContainer>
            <div className="RollDice" onClick={handelRoll}>
                <img src={getImageSource(rolledNumber)} alt={`Dice ${rolledNumber}`} />
            </div>
            <p>Click on dice to roll</p>
            <button className="reset-btn" onClick={handleResetScoreClick}>
                Reset Score
            </button>
            <button className="rules-btn" onClick={handelShowRules}>
                Show Rules
            </button>
            {showRules && (
                <ul className="show-rules">
                    <li>Select the number first from select number section</li>
                    <li>then click on dice to roll</li>
                    <li>your dice number should match with selected number</li>
                    <li>for each match as number will be rewarded</li>
                    <li>for each wrong 2 points will be deducted</li>
                </ul>
            )}
        </RollDiceContainer>
    );
}

export default RollDice;

const RollDiceContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 48px;

    .RollDice {
        cursor: pointer;
    }

    .reset-btn {
        width: 150px;
        height: 44px;
        border-radius: 5px;
        border: 2px solid black;
        pad: 10px 18px;
        background-color: white;
        margin: 15px;
        font-weight: 600;
        font-size: 18px;
        cursor: pointer;
    }

    .rules-btn {
        width: 150px;
        height: 44px;
        border-radius: 5px;
        border: 2px solid black;
        pad: 10px 18px;
        background-color: black;
        color: white;
        margin: 15px;
        font-weight: 600;
        font-size: 18px;
        cursor: pointer;
    }

    .show-rules {
        border: 1px solid black;
        background-color: wheat;
        margin-bottom: 5px;
    }
`;
