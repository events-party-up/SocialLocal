import React, {Component} from 'react';
import Svg,{
    Circle,
    Ellipse,
    G,
    LinearGradient,
    RadialGradient,
    Line,
    Path,
    Polygon,
    Polyline,
    Rect,
    Symbol,
    Use,
    Defs,
    Stop
} from 'react-native-svg';

export class googleIcon extends Component{
    render(){
        return(
            <Svg height="100"
                width="100">
            <Circle
                cx="50"
                cy="50"
                r="45"
                stroke="blue"
                strokeWidth="2.5"
                fill="green"
            />
            <Rect
                x="15"
                y="15"
                width="70"
                height="70"
                stroke="red"
                strokeWidth="2"
                fill="yellow"
            />
        </Svg>
        )
    }
}
