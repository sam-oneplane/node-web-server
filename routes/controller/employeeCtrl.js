const fsPromises = require('fs').promises;
const path = require('path');

const data = {
    employees: require('../../data/employees.json'),
    setEmployees: function(dat) {this.employees = dat},
}

const updateDB =  () => {
    fsPromises.writeFile(
        path.join(__dirname, '..', '..', 'data', 'employees.json'),
        JSON.stringify(data.employees)
    )
} 

const getEmployees = (req, res) => {
    res.json(data.employees);
}

const postEmployee = async (req, res) => {
    const idx = data.employees.length - 1  ;
    const newEmployee = {
        id: data.employees[idx].id + 1 || 1,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
    }
    console.log(data.employees[idx].id + 1);
    if (!newEmployee.firstname || !newEmployee.lastname) {
        return res.status(400).json({'Msg' : 'required first and last name'});
    }

    data.setEmployees([...data.employees, newEmployee]);
    await updateDB();
    res.status(201).json(newEmployee);
}

const updateEmployee = async (req, res) => {
    const employee = data.employees.find(emp => emp.id === parseInt(req.body.id));
    if (!employee) {
        return res.status(400).json({ "message": `Employee ID ${req.body.id} not found` });
    }
    if (req.body.firstname) employee.firstname = req.body.firstname;
    if (req.body.lastname) employee.lastname = req.body.lastname;

    const filteredArray = data.employees.filter(emp => emp.id !== parseInt(req.body.id));
    const unsortedArray = [...filteredArray, employee];
    data.setEmployees(unsortedArray.sort((a, b) => a.id > b.id ? 1 : a.id < b.id ? -1 : 0));
    await updateDB();
    res.json(data.employees);
}
 
const deleteEmployee = async (req, res) => {
    const employee = data.employees.find(emp => emp.id === parseInt(req.body.id));
    if (!employee) {
        return res.status(400).json({ "message": `Employee ID ${req.body.id} not found` });
    }
    const filteredArray = data.employees.filter(emp => emp.id !== parseInt(req.body.id));
    data.setEmployees([...filteredArray]); 
    // set new id
    for(let i=0; i < data.employees.length; i++) {
        data.employees[i].id = i+1;
    }
    await updateDB();
    res.json(data.employees);
}

const getEmployee = (req, res) => {
    const employee = data.employees.find(emp => emp.id === parseInt(req.params.id));
    if (!employee) {
        return res.status(400).json({ "message": `Employee ID ${req.params.id} not found` });
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