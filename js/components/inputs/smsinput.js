import React, { Component } from 'react';
import { Image,Platform, Alert, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import { actions } from 'react-native-navigation-redux-helpers';
import { Container, Header, Title, Grid, Col, Card, Row, Content, CardItem,
  View, Text, Button, Icon, List, ListItem, InputGroup, Input } from 'native-base';
import Spinner from '../inputs/Spinner'

export default class EnterSMS extends Component{

    static propTypes = {
        onComplete : React.PropTypes.func,
        boxCount : React.PropTypes.number,
        onVerify : React.PropTypes.func,
        onSuccess: React.PropTypes.func,
        onFailure: React.PropTypes.func
    }

    constructor(props){
        super(props);
        this.state ={
            text: '',
            val_0: '',
            val_1: '',
            val_2: '',
            val_3: '',
            loading:false
        },

        this.boxes = Array(this.props.boxCount).fill().map((e,i)=>i);
        this.values = Array.from(Array(this.props.boxCount), () => 0)
        
    }

    static defaultProps ={
        boxCount: 4
    }

    onComplete(){
        
        // combine values
        let code = this.values.join('');

        this.props.onComplete && this.props.onComplete()
        // call onVerify if available
        this.onVerify(code)
    }

    onVerify(code){
        const {onComplete, onSuccess, onFailure} = this.props;
        
        if(this.props.onVerify){
            // call the function to verify
            this.props.onVerify(code)
                .then(()=>this.setState({loading: false}, onSuccess))
                .catch((err) => this.setState({loading:false},() => onFailure(err)))
        }
    }

    _onChangeText(index,text){
        
        this.values[index]=text;
        
        let key = 'val_'+(index+1);
        if(index <3)
            this[key]._root.focus()
        else{
            this.onComplete()
        }
    }
    
    componentWillReceiveProps(nextProps, nextState){
        
        if(this.state.loading && nextProps.status === 'received'){
            // sms is received so we can check the status of sms
            for(var i =0; i< nextProps.text.length; i++){
                this.values[i] = nextProps.text[i];
            }
            
            this.onComplete()
        }
    }

    onKeyPress(index, e){
        
        let key1 = "val_" + index
        
        this[key1]._root.clear()

        if(index > 0 && e.nativeEvent.key == "Backspace"){
            
            let key = 'val_'+(index-1);    
            
            this[key]._root.focus()
        }
    }

    renderBoxes(){
        
        let rows = _.map(this.boxes, (i) => (
            
        <Col style={styles.numberbox} key={i}>
             
                <Input
                  style={{textAlign:'center', fontSize: 40,fontFamily: 'worksans-light',}}
                  placeholder="-"
                  maxLength={2}
                  keyboardType='numeric'
                  ref={(val) => {this['val_'+i] = val;}}
                  onFocus={() => {this['val_'+i]._root.clear()}}
                  onChangeText={this._onChangeText.bind(this,parseInt(i)) }
                  autoFocus={i===0?true: false}
                  onKeyPress={(e) => this.onKeyPress.bind(this,parseInt(i))(e) }
                />
                <View style={{backgroundColor:'black',height:1,marginLeft:5,marginRight:5}} />
             
      </Col>
      ));

        return (
          <Row>{rows}</Row>

        )}

    render(){
        return( <Grid>
                    {this.renderBoxes()}
                    <Spinner visible={this.state.loading} />
                </Grid>);
    }
}


const styles ={
    numberbox:{
        flex: 1,
        margin:14
    }
}