import styled from "styled-components";
import dice from "../assets/dice.png";

function Home({toggle}) {
    return (
        <Container>
            <div>
                <img src={dice} />
            </div>
            <div className="headerContent">
                <h1>Dice Game</h1>
                <Button onClick={toggle}>Play Now</Button>
            </div>
        </Container>
    );
}

export default Home;

const Container = styled.div`
    max-width: 1180px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 auto;
    height: 100vh;

    .headerContent h1 {
        font-size: 96px;
        white-space: nowrap;
    }
`;

const Button = styled.button`
    min-width: 220px;
    padding: 10px 18px;
    background: black;
    border-radius: 5px;
    color: white;
    font-size: 16px;
    cursor: pointer;

    &:hover {
        background-color: lightslategrey;
        border-radius: 10px;
    }
`;
