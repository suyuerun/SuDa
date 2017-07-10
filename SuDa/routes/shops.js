var router = require('koa-router')();
var Users = require('../models/UserModel');
var ShopModel = require('../models/ShopModel');
var formidable = require('formidable');
var sequelize =require('../models/ModelHeader')(); 
var ShopUserModel = require('../models/ShopUserModel');
var MenuModel = require('../models/MenuModel');
router.prefix('/shops')


router.get('/', async function (ctx, next) {
	
  let loginbean = ctx.session.loginbean;
  console.log('loginbean='+loginbean.uname);
  if(loginbean){
  	  ctx.state = {
	    loginbean: loginbean,
	  };
	  let rs = await ShopUserModel.findAll({where:{shopid:loginbean.shopid}});
	  await ctx.render('shops/shopIndex', {rs:rs});
  }else{
  	ctx.redirect('/');
  }
  
})

router.post('/login', async function (ctx, next) {
  	  let rs = await ShopUserModel.findOne({where:{email:ctx.request.body.email,pwd:ctx.request.body.pwd}});
    	   console.log('rs='+rs.uname);
  	  // console.log(rs);
  	  if(rs){
  	  let loginbean = new Object();
		  loginbean.id = rs.id;
		  loginbean.nicheng = rs.nicheng;
		  loginbean.shoprole = rs.role;
		  loginbean.shopid = rs.shopid;
		  loginbean.uname = rs.uname;
		  ctx.session.loginbean=loginbean;
		  //ctx.body='登陆成功';
		  ctx.redirect('./');
  	  }else{
  	  	  ctx.body='账号/密码错误';
  	  }
	  
			
	  // await ctx.render('index', {
	  // });
})

router.post('/addClerk', async function (ctx, next) {
	let loginbean = ctx.session.loginbean;
  	if((typeof(loginbean.shoprole)!='undefined')&&loginbean.shoprole==0){
		try{
			ctx.request.body.shopid=loginbean.shopid;
			let creaters = await ShopUserModel.create(ctx.request.body);
			ctx.redirect('./');
		}catch(err){
			if(err.errors[0].path=='shopemailuniq'){
				ctx.body='账号重复';
			}else{
				ctx.body = '数据库错误';
			}
		}
	}else{
		ctx.redirect('/');
	}
	
})

router.get('/menu', async function (ctx, next) {
	let loginbean = ctx.session.loginbean;
	ctx.state = {
	    loginbean: loginbean,
	  };
  	if(loginbean){
  		let rs = await MenuModel.findAll({where:{shopid:loginbean.shopid}});
  		await ctx.render('shops/menu', {rs:rs});
  	}
})


router.post('/addMenu', async function (ctx, next) {
	let loginbean = ctx.session.loginbean;
	ctx.state = {
	    loginbean: loginbean,
	  };
  	if(loginbean){
  		ctx.request.body.shopid=loginbean.shopid;
  		let creaters = await MenuModel.create(ctx.request.body);

  		ctx.redirect('./menu');
  	}
})

module.exports = router;
