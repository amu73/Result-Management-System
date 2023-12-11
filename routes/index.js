var express = require('express');
var path = require('path');
var mysql= require('mysql2');

var con=mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "result_management_system"
});

con.connect(function(err){
  if(err) throw err;
  console.log('database connected successfully');
});
// var con = require('./database');

var router = express.Router();
router.use(express.static(__dirname+"./public/"));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Login page', message:req.flash('message')});
});
//logout 
router.get('/logout', function(req, res, next){
  // request.session.destroy();
  req.flash('message','Logout successfully');

  res.redirect("/");
});

//back
router.get('/back', function(request, response, next){
  // request.session.destroy();
  response.redirect("/dashboard");
});
//teacherlogin 
router.get('/teacherLogin',(req,res)=>{
  con.query(
      'SELECT * FROM teacher_login',
      (error, results) => {
        console.log(results);
      res.render('teacher.ejs',{title:"Teacher Login",message:req.flash('message')});
      }
    );
})
router.post('/teacherLogin',function(req,res){
  var user_email = req.body.user_email;
  var user_password = req.body.user_password;
  if(user_email && user_password){
    con.query(
      'SELECT * FROM teacher_login where user_email=? and user_password = ?',[user_email,user_password],function(error, results,fields){
        if(results.length >0){ 
          //test   
          req.flash('message','Login successfully');
          res.redirect('/dashboard');              
        }
        else{    
          req.flash('message','Invalid details, Please enter correct credential');           
            res.redirect('/teacherLogin');
        }
        res.end();
      })
  }
  else{
    req.flash('message','Enter email and password first');           
            res.redirect('/teacherLogin');
  }
})

//student dashboard
router.get('/dashboard',function(req, res, next) {
  var getQuery="select * from student_record";
  con.query(getQuery,function(err,result){
    if(err) throw err;
    res.render('student_dashboard', { title: 'Student Records', records:result,message:req.flash('message')});

    // res.render('student_dashboard', { title: 'Student Records', records:result,success:'' });
 });
});

router.post('/dashboard', function(req, res, next) {
 
    var Roll_No= req.body.Roll_No;
    var Name= req.body.Name;
    var DOB= req.body.DOB;
    var Score= req.body.Score;

    var insertQuery='insert into student_record (Roll_No,Name,DOB,Score) VALUES (?,?,?,?)';

    var query=mysql.format(insertQuery,[Roll_No,Name,DOB,Score]);
    con.query(query,function(err,response){
      if(err) throw err;
      var getQuery="select * from student_record";
      con.query(getQuery,function(err,result){

      if(err) throw err;
      res.render('student_dashboard', { title: 'Student Records', records:result,success:'Record Inserted Successfully',success:'',message:flash('message') });
 
  });
});
});
//edit records
router.get('/edit/:id', function(req, res, next) {
  var id=req.params.id;
   var Roll_No= req.body.Roll_No;
    var Name= req.body.Name;
    var DOB= req.body.DOB;
    var Score= req.body.Score;
  var getQuery="select * from student_record where id=?";
  var query=mysql.format(getQuery,id);
  con.query(query,function(err,result){
      if(err) throw err;
      var string=JSON.stringify(result);
      var json =  JSON.parse(string);     
  res.render('edit', { title: 'Update Students Records', records:json,success:'Records updated successfully' });
  });
});

// update records
router.post('/update/', function(req, res, next) {
  var Roll_No= req.body.Roll_No;
  var Name= req.body.Name;
  var DOB= req.body.DOB;
  var Score= req.body.Score;
  var id= req.body.id;
  var updateQuery='UPDATE student_record SET Roll_No=? ,Name=?,DOB=?,Score=? where id=?';
  var query=mysql.format(updateQuery,[Roll_No,Name,DOB,Score,id]);
  
  con.query(query,function(err,response){
      if(err) throw err;
 
    req.flash('message','Records updated successfully');
        res.redirect('/dashboard');  

  });
});


//delete 
router.get('/delete/:id', function(req, res, next) {
  var id=req.params.id;
  var deleteQuery="delete from student_record where id=?";
  var query=mysql.format(deleteQuery,id);
   con.query(query,function(err){

       if(err) throw err;
       req.flash('message','Data deleted successfully')

      res.redirect('/dashboard');
  });
});

//add records
// router.get('/add',(req,res)=>{ 
//   res.render('add_record.ejs',{title:" Add record",success:'',message:req.flash('message'),warning: req.flash('warning')});
//   // res.render('add_record.ejs', { title: 'Add Records',success:'Record Inserted Successfully' });
// })
// router.post('/add',function(req,res){
//   var Roll_No = req.body.Roll_No;
//   var Name = req.body.Name;
//   var DOB = req.body.DOB;
//   var Score = req.body.Score;
//   console.log(req.body);
//   if(Roll_No && Name && DOB && Score){
//     con.connect(function(error){
//       if(error) throw error;
      
//       var sql = "Insert into student_record(Roll_No,Name,DOB,Score) VALUES(?,?,?,?)";
//       con.query(sql,[Roll_No,Name,DOB,Score],function(error,result){
        
//           if(error) throw error;
//           // res.send('Records added successfully '+result.insertId);
          
//           req.flash('message','Records added successfully');

//           res.render('add_record.ejs', { title: 'Add Records',success:'Record Added Successfully',message:req.flash('message'),warning: req.flash('warning')});

//       })
//   });
//   }
//   else{
//     req.flash('warning','Please enter all details first')
//     res.redirect('/add'); 
//   }  
// })
  
//Student Login

router.get('/studentLogin',(req,res)=>{ 
  con.query(
    'SELECT * FROM student_record',
    (error, results) => {
      console.log(results);
      res.render('studentLogin.ejs',{title:" Login Page",message:req.flash('message')});
      // res.redirect('/studentLogin');
    }
  );   
})

router.post('/studentLogin',function(req,res){
  var Roll_No = req.body.Roll_No;
  var DOB = req.body.DOB;
  if(Roll_No && DOB){
    con.query(
      'SELECT * FROM student_record where DOB=? and Roll_No = ?',[DOB,Roll_No],function(error, results,fields){
         if(results.length >0){
           console.log('result page success');
           console.log(results);
             // res.render("result.ejs");
           req.flash('message','Login successfully');
           res.render('viewResult.ejs',{title:" Result Page",records:results,message:req.flash('message')});
         }
         else{
           // console.log('result page fail');
           req.flash('message','Invalid credential')
           res.redirect('/studentLogin');
         }
         res.end();
      })
  }
   else{
    req.flash('message','Please enter details first')
    res.redirect('/studentLogin'); 
  }   
       
})
//view results
router.get('/results', function(req,res){
 
  res.render('viewResult.ejs',{title:" Result Page,records:results,success:''"});


});
//add records
router.get('/add',(req,res)=>{ 
  res.render('add_record.ejs',{title:" Add record",success:'',message:req.flash('message'),warning: req.flash('warning')});
})
router.post('/add',function(req,res){
  var Roll_No = req.body.Roll_No;
  var Name = req.body.Name;
  var DOB = req.body.DOB;
  var Score = req.body.Score;
  console.log(req.body);

  if(Roll_No && Name && DOB && Score){
    con.query('select Roll_No from student_record where Roll_No = ?',[Roll_No],(error,results)=>{
      if(error) throw error;
      if(results.length > 0){
        req.flash('warning','This Roll no already exists,please enter another roll no');
        res.render('add_record.ejs', { title: 'Add Records',success:'Record Added Successfully',message:req.flash('message'),warning: req.flash('warning')});

      }
      else{
        var sql = "Insert into student_record(Roll_No,Name,DOB,Score) VALUES(?,?,?,?)";
      con.query(sql,[Roll_No,Name,DOB,Score],function(error,result){
        
          if(error) throw error;
          
          req.flash('message','Records added successfully');
          res.render('add_record.ejs', { title: 'Add Records',success:'Record Added Successfully',message:req.flash('message'),warning: req.flash('warning')});

      })

      }
      
    })
  }
  else{
    req.flash('warning','Please enter all details first')
    res.redirect('/add'); 
  }  
})

module.exports = router;
