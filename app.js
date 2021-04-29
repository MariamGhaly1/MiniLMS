const Joi = require('joi');
const express = require('express');    
const app = express();   

app.use(express.urlencoded({extended: true}));

const courses = [
    {id:1, name:"course1", code: "cse432", description:"4th year course"},
];

const students = [
    {id:1, name:"Mariam", code: "1234567", grade:"senior"},
];

app.use(express.json()); 

app.get('/' , (req , res)=>{
    res.send('<h1>Mini Mini LMS<h1>');
 });

 app.get ('/web/courses/create' , (req, res ) => { 
    ret = res.sendFile ('form-course.html', {root: __dirname});
});

app.get ('/web/students/create' , (req, res ) => { 
    ret = res.sendFile ('form-student.html', {root: __dirname});
});

app.get('/api/courses', (req, res) =>{
    if(courses.length === 0) 
        return res.send('NO COURSES YET!');
    res.send(courses);
});

app.get('/api/students', (req, res) =>{
    if(students.length === 0) 
        return res.send('NO STUDENTS YET!');
    res.send(students);
});



app.post('/api/courses', (req, res)=> {
    
    const result = validateCourse(req.body);

    if(result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }


    const course = {
        id: courses.length + 1,
        name: req.body.name,
        code: req.body.code,
        description: req.body.description,
    };
    courses.push(course);
    res.send(course);
});

app.post('/api/students', (req, res)=> {
    
    const result = validateStudent(req.body);

    if(result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }


    const student = {
        id: students.length + 1,
        name: req.body.name,
        code: req.body.code,
        grade: req.body.grade,
    };
    students.push(student);
    res.send(student);
});

app.get('/api/courses/:id',(req,res)=>{

    const course =  courses.find(c=>c.id===parseInt(req.params.id));
    if(!course){
         res.status(404).send('The course with the id was not found.');
         return;
    }
    res.send(course);
 });

 app.get('/api/students/:id',(req,res)=>{

    const student =  students.find(c=>c.id===parseInt(req.params.id));
    if(!student){
         res.status(404).send('The student with the id was not found.');
         return;
    }
    res.send(student);
 });

 app.put('/api/courses/:id',(req,res)=>{

    const course =  courses.find(c=>c.id===parseInt(req.params.id));
    if(!course){
         res.status(404).send('The course with the id was not found ');
         return;
    }

    const {error}= validateCourse(req.body);

    if(error){          
         res.status(400).send(error.details[0].message);
         return;
    }
    course.name =req.body.name;   
    course.code=req.body.code;
    course.description=req.body.description;
    res.send(course); 
});

app.put('/api/students/:id',(req,res)=>{

    const student =  students.find(c=>c.id===parseInt(req.params.id));
    if(!student){
         res.status(404).send('The student with the id was not found ');
         return;
    }


    const {error}= validateStudent(req.body);

    if(error){          
         res.status(400).send(error.details[0].message);
         return;
    }
    student.name =req.body.name;   
    student.code =req.body.code;
    student.grade = req.body.grade;
    res.send(student); 

});

app.delete('/api/students/:id',(req,res)=>{


    const student =  students.find(c=>c.id===parseInt(req.params.id));
    if(!student){
         res.status(404).send('The student with this id was not found.');
         return;
    }

    const index =students.indexOf(student);
    students.splice(index,1);
    res.send(student); 

});

app.delete('/api/courses/:id',(req,res)=>{


    const course =  courses.find(c=>c.id===parseInt(req.params.id));
    if(!course){
         res.status(404).send('The course with this id was not found.');
         return;
    }

    const index =courses.indexOf(course);
    courses.splice(index,1);
    res.send(course); 

});






function validateCourse(course){

    const schema = { 
        name: Joi.string().min(5).required(),
        code: Joi.string().regex(/^[A-Z]{3}[0-9]{3}$/).required(),
        description: Joi.string(),
    };
    return Joi.validate(course,schema);
}

function validateStudent(student){

    const schema = { 
        name: Joi.string().regex(/^[A-Za-z -']*$/).required(), 
        code: Joi.string().min(7).max(7).required(),
        grade: Joi.string(),
    };
    return Joi.validate(student,schema);
}




const host = '0.0.0.0';
const port = process.env.PORT || 3000 ; 
app.listen(port,host , ()=> console.log(`Listening on port ${port}...`));
