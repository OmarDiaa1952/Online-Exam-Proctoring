import useMic from "../hooks/useMic";

function Mic() {
    const { init, stop } = useMic(onCheating);

    function onCheating(text) {
        console.log(text);
    }
    const text = "What is the chemical symbol for oxygen";

    return (
        <div style={{ textAlign: "center" }}>
            <h1>Cheating detection</h1>
            <h2>{text}</h2>
            <button onClick={() => init(text)}>Start</button>
            <button onClick={stop}>Stop</button>
        </div>
    );
}

export default Mic;
