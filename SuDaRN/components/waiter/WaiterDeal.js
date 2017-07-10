import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Button
} from 'react-native';
import {BodyLayout} from '../public/Style'
import {getHttp} from '../../common/HttpBean'
import OrderList from './OrderList'

export default class WaiterDeal extends Component {
	constructor(){
		super();
		this.state={};
		this.state.num=1;
		this.state.dishArr=[];
		this.state.remark='';
	}
	createNew(item){
		// alert(item.id); //dishid
		// alert(item.dishname);
		// alert(this.state.remark);
		// alert(this.state.num);
		// alert('桌号:'+this.props.tablenum);
		getHttp('dish/newDishMenu?dishid='+item.id+'&tableid='+this.props.tableid+'&dishname='+item.dishname+'&remark='+this.state.remark+'&num='+this.state.num+'&price='+item.price,function(response){
			response.text().then(function(rs){
				alert(rs);
			});
		});
	}
	findDish(){
		let self =this;
		getHttp('dish/getDishForKeys?dishkey='+this.state.dishkey,function(response){
			 response.json().then(function(rs){
			 	let dishArr=[];
			 	let len = rs.length;
			 	if(len>0){
			 		//alert(rs[0].dishname);
			 		for(let i=0;i<len;i++){
			 			dishArr.push(
			 				<View key={i} style={[Layout.row]}>
			 					<Text style={[Layout.column,Layout.columnText]}>{rs[i].dishname}</Text>
			 					<TextInput  style={[Layout.input,{width:48}]}
		          				onChangeText={(num) => self.setState({num})} defaultValue='1'
		          				keyboardType="number-pad"
		          				/>
		          				<Text style={[Layout.column,Layout.columnText]}>份</Text>

			 					<Text style={[Layout.column,Layout.textBtn]}>
			 						加入已有单
			 					</Text>
			 					<Text onPress={()=>{self.createNew(rs[i]);}} style={[Layout.column,Layout.textBtn]}>
			 						新单
			 					</Text>
			 				</View>
			 			);
			 			dishArr.push(
			 				<View key={i+'_a'}>
			 				<TextInput  style={[Layout.input]} placeholder='点菜备注说明'
		          				onChangeText={(remark) => self.setState({remark})}
		          				/>
			 				</View>
			 			);
			 		}
			 		self.setState({dishArr:dishArr});
			 	}else{
			 		//alert('无此关键词');
			 		self.setState({dishArr:[]});
			 	}
			 })
		});
	}
	render() {
		//this.setState({tablenum:this.props.tablenum});
	    return (
	    	<View style={[BodyLayout.body,{alignItems:'center'}]}>
				<Text>{this.props.tablenum}</Text>
				<View style={{flexDirection:'row'}}>
					<TextInput style={[Layout.input,{width:'60%'}]} placeholder='请输入菜品速查关键词'
		          				onChangeText={(dishkey) => this.setState({dishkey})}
		          			/>
		            <Text style={[Layout.textBtn]} onPress={()=>{this.findDish()}}> 搜菜 </Text>
		         </View>
		         <View style={[Layout.table]}>
		         	{this.state.dishArr}
		         </View>
		         <OrderList tableid={this.props.tableid}/>
	        </View>
	    )
	}

}

let Layout = StyleSheet.create({
	input:{
		borderWidth: 1,
	    marginLeft: 5,
	    paddingLeft: 5,
	    borderColor: '#CCC',
	    borderRadius: 4,
	    width:'80%',
	    margin:6,
	  	backgroundColor:'#fff',
	  	height:36,
	},
	textBtn:{
		backgroundColor:'green',
		marginTop:6,
		height:33,
		color:'#fff',
		padding:6,
		fontSize:15
	},
	table:{
		flexDirection:'column'
	},
	row:{
		flexDirection:'row'
	},
	column:{
		margin:3,
	},
	columnText:{
		fontSize:18,
		padding:6
	}
})