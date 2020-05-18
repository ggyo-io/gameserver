import React from 'react'
import './chessboardjs/chessboard-1.0.0.css'
import { Chessboard }  from './chessboardjs/chessboard-1.0.0'

export default class GGBoard extends React.Component {

    componentDidMount() {
        const ruyLopez = 'r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R';
        this.board = Chessboard(this.el, ruyLopez);
    }
    componentWillUnmount() {
        // destroy?
    }

    render() {
        const props = { style: { ...this.props.style } }
      if (this.props.width) {
        props.style.width = this.props.width
      }
      if (this.props.height) {
        props.style.height = this.props.height
      }
      return <div ref={el => this.el = el} {...props} />
    }
}