import {useState} from "react";
import Home from "./Components/Home";
import GamePlay from "./Components/GamePlay";

function App() {
    // using state hook to change the home component when user click on play now button
    const [gamePlay, setGamePlay] = useState(false);

    // this function will toggle between home and gameplay component according to the value (true or false)
    const toggleGamePlay = () => {
        setGamePlay((prev) => !prev);
    };
    return <div>{gamePlay ? <GamePlay /> : <Home toggle={toggleGamePlay} />}</div>;
}

export default App;
