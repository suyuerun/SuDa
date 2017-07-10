const router = require('koa-router')()
var Users = require('../models/UserModel'); 
var sequelize =require('../models/ModelHeader')(); 
var ShopUserModel = require('../models/ShopUserModel');
router.prefix('/users')

router.get('/', async function (ctx, next) {
  let loginbean = ctx.session.loginbean;
  if(loginbean){
  	//--------查询shop------------------------
  	let uid=loginbean.id;
  	let sql = 'select id,shopname nicheng from shops where id= ?';
  	let rs = await sequelize.query(sql,{replacements: [uid]});
  	await ctx.render('shops/shopIndex', {rs:rs[0]});
  }else{
  	ctx.redirect('/shopLogin.html');
  }
  
});
router.get('/bar', function (ctx, next) {
  ctx.body = 'this is a users/bar response'
})

router.post('/login', async function (ctx, next) {
	console.log('11111111111111111111')
	let rs = await new Promise(function(resolve,reject){
		ShopUserModel.findOne({where:{email:ctx.request.body.email,pwd:ctx.request.body.pwd}}).then(function(rs){
			if(rs!=null){
				let loginbean=new Object();
				loginbean.id = rs.id;
				loginbean.nicheng = rs.nicheng;
				loginbean.role = rs.role;
				loginbean.msgnum = rs.msgnum;
				ctx.session.loginbean=loginbean;
				//ctx.redirect('/admin/index');
				resolve(1);
			}else{
				resolve(2);
			}
		});
	})
	if(rs==1){
		ctx.status = 301;
		ctx.redirect('./');
		//ctx.body='登陆成功';
	}else{
		ctx.body='email/密码错误';
	}
  	
})
module.exports = router
