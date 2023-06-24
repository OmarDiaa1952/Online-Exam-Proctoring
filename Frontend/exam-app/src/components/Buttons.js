function Buttons({ hRecClick, hStopClick, hTransClick, isRec }) {
    return (
        <div className="btn-holder">
            <button onClick={hRecClick} disabled={isRec}>
                Record
            </button>
            <button onClick={hStopClick} disabled={!isRec}>
                Stop
            </button>
            <button onClick={hTransClick}>Clear</button>
        </div>
    );
}

export default Buttons;
