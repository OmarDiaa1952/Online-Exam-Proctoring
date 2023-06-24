import React from "react";
import TableProp from "./TableProp";

function Table({ title, perf }) {
    return (
        <div className="container">
            <h2 style={{ textAlign: "center" }}>{title}</h2>
            <ul className="responsive-table">
                <li className="table-header">
                    <div className="col col-1">Property</div>
                    <div className="col col-2">Value</div>
                </li>
                <TableProp
                    name={"Feature extraction"}
                    value={perf?.feature_extraction}
                />
                <TableProp name={"Encoding"} value={perf?.encoding} />
                <TableProp name={"Decoding"} value={perf?.decoding} />
                <TableProp name={"Total time"} value={perf?.total_time} />
                <TableProp name={"WER"} value={perf?.wer} />
            </ul>
        </div>
    );
}

export default Table;
