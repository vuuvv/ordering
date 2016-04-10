var express = require('express');
var router = express.Router();
var login = require('../auth/authentication').login;
var SMS = require('../models/sms');
var api = require('../api/sms');

router.get('/send', login, function(req, res) {
	res.render('sms/send');
});

router.post('/send', login, function(req, res) {
	var mobile = req.body.mobile;
	var templateId = "6344";
	if (!mobile) {
		res.flash('请填写电话号码');
		return res.redirect('/send');
	}
	api.sendSMSTemplate(mobile, templateId, function(resp) {
		var sms = new SMS({
			mobile: mobile,
			status: "-1",
			templateId: templateId,
			date: new Date()
		});
		if (resp.success) {
			sms.sendId = resp.data.obj;
			sms.save();
			req.flash('success', '短信发送中');
		} else {
			sms.status = "-2";
			sms.error = JSON.stringify(resp);
			sms.save();
			req.flash('danger', '发送错误');
		}
		res.redirect('/sms');
	});
});

router.get('/', login, function(req, res) {
	var sms = SMS.
		find().
		sort('-date').
		exec(function(err, items) {
			console.log(items);
			res.render('sms/list', { items: items });
		});
});

router.param('smsid', function(req, res, next, value) {
	SMS.findById(value, function(err, sms) {
		req.sms = sms;
		next();
	});
});

router.get('/item/:smsid', function(req, res) {
	if (!req.sms) {
		res.send({success: false, message: '无效的短信id'})
	} else {
		console.log(req.sms);
		api.getSMSStatus(req.sms.sendId, function(resp) {
			if (resp.success) {
				var status = resp.data.obj[0].status;
				req.sms.status = status;
				SMS.update({_id: req.sms._id}, {$set: {status: status}}, function(err, sms) {
					res.send({success: true, sms: req.sms});
				});
			} else {
				res.send(resp);
			}
		})
	}
});

module.exports = router;
