const Employee = require('../../model/Employee');

const getEmployees = async (req, res) => {
    const employees = await Employee.find();
    if(!employees) return res.status(204).json({"massage": "no employee found"});
    res.json(employees); 
}

const postEmployee = async (req, res) => {

    if (!req?.body?.firstname || !req?.body?.lastname) {
        res.status(400).json({"status": "firstname and lastname required"});
    }
    
    try{
        const newEmployee = new Employee({
            "firstname": req.body.firstname,
            "lastname": req.body.lastname, 
        });
        const result = await newEmployee.save();
        console.log(result);
        res.status(201).json({'success': `employee ${newEmployee} created`});

    }catch(err) {

        console.error(err);
    }
}

const updateEmployee = async (req, res) => {
    
    if(!req?.body?.id) {return res.status(400).json({"massage": "employee id is required"})}; 

    const employee = await Employee.findOne({_id: req.body.id}).exec();
    if (!employee) {
        return res.status(204).json({ "message": `no employee matches ID: ${req.body.id}` });
    }

    if (req.body?.firstname) employee.firstname = req.body.firstname;
    if (req.body?.lastname) employee.lastname = req.body.lastname;

    const result = await employee.save();
    console.log(result);
    res.json(result);
}
 
const deleteEmployee = async (req, res) => {

    if(!req?.body?.id) {return res.status(400).json({"massage": "employee id is required"})}; 

    const employee = await Employee.findOne({_id: req.body.id}).exec();
    if (!employee) {
        return res.status(204).json({ "message": `no employee matches ID: ${req.body.id}` });
    }
    const result = await Employee.deleteOne({ _id: req.body.id});

    res.json(result);
}

const getEmployee = async (req, res) => {

    if(!req?.params?.id) {return res.status(400).json({"massage": "employee id is required"})}; 

    const employee = await Employee.findOne({ _id: req.params.id}).exec();
    if (!employee) {
        return res.status(204).json({ "message": `no employee matches ID: ${req.params.id}` });
    }
    res.json(employee);
}


module.exports = { 
    getEmployees,
    postEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployee
};