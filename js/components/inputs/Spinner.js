import React, {Component} from 'react';
var Spinner = require('react-native-spinkit');
import LoadingSpinnerOverlay from 'react-native-smart-loading-spinner-overlay'

export default class SpinnerComp extends Component{
    
    constructor(props){
        super(props);
        this.state ={
            visible: this.props.visible
        }
    }

    componentWillReceiveProps(nextProps, nextState){
        
        const {visible} = nextProps;
        if(visible)
            this._modalLoadingSpinnerOverLay.show()
        else
            this._modalLoadingSpinnerOverLay.hide()
        this.setState({visible})
    }

    render(){
        return( <LoadingSpinnerOverlay
                    ref={ component => this._modalLoadingSpinnerOverLay = component }>
                    <Spinner isVisible={true} type='CircleFlip' color='#e3e3e3'/>
                </LoadingSpinnerOverlay>
        );
    }
}