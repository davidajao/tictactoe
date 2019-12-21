import React from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, TouchableWithoutFeedback} from 'react-native';
import { AuthSession } from 'expo';

const DeviceWidth = Dimensions.get('window').width;

export default class App extends React.Component {
   
  lrdiagonal = 0;
  rldiagonal = 0;
  XRowCount= [0,0,0];
  XColCount= [0,0,0];
  ORowCount= [0,0,0];
  OColCount= [0,0,0];

  state = {
    turn: '',
    plays: 0,
    board: [
      ['','',''],
      ['','',''],
      ['','','']
    ],
    winner: '',
    tie: false,
   }

  //method to reset to start after someone wins or game ends in a tie
  reset(){
    this.lrdiagonal = 0;
    this.rldiagonal = 0;
    this.XRowCount= [0,0,0];
    this.XColCount= [0,0,0];
    this.ORowCount= [0,0,0];
    this.OColCount= [0,0,0];

    this.setState({
      turn: 'X',
      plays: 0,
      board: [
        ['','',''],
        ['','',''],
        ['','','']
      ],
      winner: '',
      tie: false
    })
  }



  checkForTie(){
    var count = this.state.plays;
    count++;  //increment plays to check if game is over
    this.setState({plays: count});

    if(this.state.plays == 8){
      //Tie game over
      this.setState({tie:true});
    }
  }



  checkForWin(row, col){

    //diagonal wins check
    if(row == col){

      //see if middle cell is filled
      if(row==1 && col==1){
        //if middle is filled increment both diagonal counters
        (this.state.board[row][col] == 'X')   ?   this.lrdiagonal++   :   this.lrdiagonal--;  
        (this.state.board[row][col] == 'X')   ?   this.rldiagonal++   :   this.rldiagonal--;
      }
      else{
        //if not cell, adjust LR diagonal counters
        (this.state.board[row][col] == 'X')   ?   this.lrdiagonal++   :   this.lrdiagonal--;
      } 
      if (this.lrdiagonal == 3) { 
        //X WINS by LR diagonal! 
        this.setState({winner:'X'});
      }
      if (this.lrdiagonal == -3) { 
        //O WINS by LR diagonal
        this.setState({winner:'O'});
      }
    }

    
    //RIGHT TO LEFT DIAGONAL CHECK
    if((row == 0 && col==2) || (row == 2 && col==0)) {

      (this.state.board[row][col] == 'X')   ?   this.rldiagonal++   :   this.rldiagonal--;

      if (this.rldiagonal == 3) { 
        //X WINS RL Diagonal! 
        this.setState({winner:'X'});
      }
      if (this.rldiagonal == -3) { 
        //O WINS by RL diagonal! 
        this.setState({winner:'O'});
      }
    }

    //check for wins across columns and rows
    if(this.state.turn == 'X'){
      this.XRowCount[row]++;
      this.XColCount[col]++;

      if (this.XRowCount[row] == 3 || this.XColCount[col] == 3 ){
        //X WINS!!
        this.setState({winner:'X'});
      }
    }

    else{
      this.ORowCount[row]++;
      this.OColCount[col]++;

      if (this.ORowCount[row] == 3 || this.OColCount[col] == 3 ){
        //O WINS!!
        this.setState({winner:'O'});
      }
    }
  }




  play = (rowNo, colNo)=>{
    
    this.state.board[rowNo][colNo]=this.state.turn; //update state with value X or O
    

    this.checkForWin(rowNo, colNo);
    this.checkForTie();

    //alternate turns between X and O
    if (this.state.turn == 'X') {this.setState({turn: 'O'})}
    else {this.setState({turn: 'X'})}

    this.forceUpdate();
  }

  componentDidMount(){
    //initialize to X for game start
    {if (this.state.turn == '') {this.setState({turn: 'X'})}   }
  }


  render(){

    const row0 = this.state.board[0].map((val, index) =>
    <TouchableOpacity disabled={(val!='') ? true : false} key={index} style={styles.box}  onPress={()=>{this.play(0,index)} } > 
        <Text style={styles.font}> {val} </Text> 
    </TouchableOpacity>
    );

    const row1 = this.state.board[1].map((val, index) =>
    <TouchableOpacity disabled={(val!='') ? true : false} key={index} style={styles.box}  onPress={()=>{this.play(1,index)}} > 
        <Text style={styles.font}> {val} </Text> 
    </TouchableOpacity>
    );

    const row2 = this.state.board[2].map((val, index) =>
    <TouchableOpacity disabled={(val!='') ? true : false} key={index} style={styles.box}  onPress={()=>{this.play(2,index)}} > 
        <Text style={styles.font}> {val} </Text> 
    </TouchableOpacity>
    );


    return (
      <View style={styles.container}>

          <Text style={styles.title}> David's TicTacToe</Text>

          <Text style={styles.turn}> Turn: {this.state.turn}</Text>

          <View style={styles.row}>
            {row0}
          </View>

          <View style={styles.row}>
            {row1}
          </View>
    
          <View style={styles.row}>
            {row2}
          </View>

            {/* draw lines for vertical columns on win */}
            {(this.XColCount[0] == 3 || this.OColCount[0] == 3) ? <View style={[ styles.line, {transform: [{ translateX: -125}] } ]}></View>    :  null}
            {(this.XColCount[1] == 3 || this.OColCount[1] == 3) ? <View style={ styles.line }></View>    :  null}
            {(this.XColCount[2] == 3 || this.OColCount[2] == 3) ? <View style={[ styles.line, {transform: [{ translateX: 125}] } ]}></View>     :  null}

            {/* draw lines for horizontal columns on win */}
            {(this.XRowCount[0] == 3 || this.ORowCount[0] == 3) ? <View style={[ styles.line, {transform: [ {rotate: '90deg'}, {translateX: -125} ]} ]}></View>    :  null}
            {(this.XRowCount[1] == 3 || this.ORowCount[1] == 3) ? <View style={[ styles.line, {transform: [ {rotate: '90deg'} ]} ]}></View>     :  null}
            {(this.XRowCount[2] == 3 || this.ORowCount[2] == 3) ? <View style={[ styles.line, {transform: [ {rotate: '90deg'}, {translateX: 125} ]} ]}></View>     : null}

            {/* draw lines for horizontals on win */}
            {(this.rldiagonal == 3 || this.rldiagonal == -3) ? <View style={[ styles.diag, {transform: [ {rotate: '45deg'}, {translateX: -3} ]} ]} ></View>    :  null}
            {(this.lrdiagonal == 3 || this.lrdiagonal == -3) ? <View style={[ styles.diag, {transform: [ {rotate: '-45deg'}, {translateX: 3} ]} ]} ></View>    :  null}

            {this.state.winner == 'X'  ?  <Text style={styles.win}>Player X wins ! </Text>     :     null }
            {this.state.winner == 'O'  ?  <Text style={styles.win}>Player O wins ! </Text>     :     null }
            
            {/*if its a tie*/}
            {(this.state.tie == true && this.state.winner=='') ?  <Text style={styles.tie}>TIE GAME ! </Text>     :     null }

          <TouchableOpacity style={styles.reset} onPress={()=>{this.reset()}}>
            <Text style={styles.resetText}>Restart</Text>
          </TouchableOpacity>
      </View>
      );
    }
  }
  

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 25,
    position: 'absolute',
    top: 50,
    color: 'white'
  },
  row:{
    flexDirection: 'row',
  },
  box:{
    width: DeviceWidth*0.3, 
    height: DeviceWidth*0.3, 
    marginBottom:1, 
    marginLeft: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    borderColor: 'black'
  },
  font: {
    fontSize: 100,
    color: 'black'
  },
  reset:{
    width: 150,
    height: 50,
    borderRadius: 10,
    backgroundColor: 'gray',
    marginTop: 90,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetText:{
    color: 'white',
    fontSize: 30,
  },
  win:{
    height: '95%',
    width: '95%',
    backgroundColor: 'transparent',
    position: 'absolute',
    fontSize: 30,
    paddingTop: 510,
    paddingLeft: 120,
    borderRadius: 15,
    borderColor: 'green',
    color: 'green',
    fontWeight: 'bold'
  },
  tie:{
    height: '95%',
    width: '95%',
    backgroundColor: 'transparent',
    position: 'absolute',
    fontSize: 35,
    paddingTop: 510,
    paddingLeft: 120,
    borderRadius: 15,
    borderColor: 'green',
    color: 'white',
    fontWeight: 'bold'
  },
  turn:{
    color: 'white',
    fontSize: 25,
  },
  line:{
    top: 130,
    backgroundColor: 'green',
    width: 6,
    height: 365,
    position: 'absolute',
  },
  diag: {
    top: 60,
    backgroundColor: 'green',
    width: 6,
    height: 510,
    position: 'absolute',
  }
});
