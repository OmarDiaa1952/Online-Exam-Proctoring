import React from "react";

function TableProp({ name, value }) {
    let coloredValue;
    if (value && name !== "WER") coloredValue = calc(value);
    else if (value >= 0 && name === "WER") coloredValue = wer(value);
    else if (value === undefined) coloredValue = "NA";
    else coloredValue = 0;

    return (
        <li className="table-row">
            <div className="col col-1" data-label="Property">
                {name}
            </div>
            <div className="col col-2" data-label="Value">
                {coloredValue}
            </div>
        </li>
    );
}

export default TableProp;

function calc(value) {
    if (value < 1)
        return <span style={{ color: "green" }}>{~~(value * 1000)}ms</span>;
    else if (value < 5)
        return (
            <span style={{ color: "orange" }}>{~~(value * 100) / 100}s</span>
        );
    else return <span style={{ color: "red" }}>{~~(value * 100) / 100}s</span>;
}

function wer(value) {
    let color;
    if (value === 0) color = "green";
    else if (value < 10) color = "orange";
    else color = "red";
    console.log(value);
    return <span style={{ color }}>{~~(value * 100) / 100}%</span>;
}
