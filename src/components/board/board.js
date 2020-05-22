import React from "react"
import './styles/board.scss'
import {Player} from "../player/player"
import {ControlPanel} from "../control-panel/controlPanel"
import ReactResizeDetector from "react-resize-detector";

const MaxBoardSize = 600;
const ratio = .6;

const calculate = (value) => {
    return Math.ceil(value * ratio);
}

const getSizes = (props) => {
    const {width, height} = props;
    const boardSize = height < width ? Math.min(calculate(height), MaxBoardSize) : Math.min(calculate(width), MaxBoardSize)
    return {
        size: boardSize - 7,
        styleWidth: {width: `${boardSize}px`},
        styleHeight: {height: `${boardSize}px`}
    };
};

export const Board = (props) => {
    return (
        <ReactResizeDetector handleWidth handleHeight querySelector="#root">
            {({width, height}) =>
                <ResizableBoard {...props} width={width} height={height}/>
            }
        </ReactResizeDetector>
    )
}


const ResizableBoard = (props) => {
    const {Mode, RightPanel} = props
    const {size} = getSizes(props)
    const ModeWithProps = React.cloneElement(Mode, {calcWidth: () => size })
    const RightPanelWithProps = React.cloneElement(RightPanel, {size: size })

    return <React.Fragment>
        <div className='d-flex flex-fill justify-content-between'>
            <ControlPanel size={size}/>
            <div className="board-content d-flex flex-column">
                <Player/>
                <div className="position-relative border-warning p-1">
                    {ModeWithProps}
                </div>
                <Player/>
            </div>
            {RightPanelWithProps}
        </div>
    </React.Fragment>
}
