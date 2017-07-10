import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Alert,
  Button
} from 'react-native';
import {getHttp} from '../../common/HttpBean'
import Storage from '../../common/Storage'
import RadioModal from 'react-native-radio-master'

let thisa;
export default class OrderList extends Component {
	constructor(){
		super();
		this.state={};
		this.state.orderArr=[];
		this.state.radioBtn={backgroundColor:'blue'};
		
		this.aa=33;
		thisa=this;
	}
	getOrderList(tableid){
		this.setState({flag:false});
		let self = this;
		getHttp('dish/getOrderList?tableid='+tableid,function(response){
			response.json().then(function(rs){
				let orderArr=[];
				for(let orderid in rs){
					let dishRs = rs[orderid];	//每个单号对应的菜品数组
					let dishArr = [];
					for(let key in dishRs){
						dishArr.push(
							<View key={key} style={[Layout.row]}>
								<Text  style={[Layout.column,Layout.columnText]}>{dishRs[key].dishname}</Text>
								<Text  style={[Layout.column,Layout.columnText]}>{dishRs[key].num}</Text>
								<Text  style={[Layout.column,Layout.columnText]}>确定</Text>
								<Text  style={[Layout.column,Layout.columnText]}>删除</Text>
							</View>
						);
					}
					orderArr.push(
						<View key={orderid} style={[Layout.orderView]}>
							<Text style={[self.state.radioBtn]} onPress={self.addDish.bind(this)}>加菜</Text>
							{dishArr}
						</View>
					);
				}

				self.setState({orderArr:orderArr});

			});
		});
	}
	
	componentWillMount(){
		this.getOrderList(this.props.tableid);
	}

	addDish(event){
		thisa.refs.tt.setNativeProps({style:{backgroundColor:'red'}});
		//alert(document.gsetNativePropsetElementById(event.nativeEvent.target));
	}

	render() {
		
	    return (
	    	<View ref='tt' style={[Layout.table]}>
				{this.state.orderArr}
	        </View>
	    )
	}
}

const Layout = StyleSheet.create({
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
	},
	orderView:{
		borderStyle:'solid',
		borderColor:'#000',
		borderWidth:1,
		margin:3,
	},
	radioBtn:{
		backgroundColor:'blue'
	},
	radioBtn1:{
		backgroundColor:'red'
	}
})