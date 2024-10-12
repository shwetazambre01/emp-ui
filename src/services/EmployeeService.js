
import axios from 'axios';

const API_URL = 'http://localhost:8081/api/employees'; 

const EmployeeService = {
    getAllEmployees: () => axios.get(`${API_URL}/Allemployee`),
    getEmployeeById: (empId) => axios.get(`${API_URL}/${empId}`),
    createEmployee: (employee) => axios.post(`${API_URL}/save`, employee),
    updateEmployee: (empId, employee) => axios.put(`${API_URL}/${empId}`, employee),
    deleteEmployee: (empId) => axios.delete(`${API_URL}/${empId}`),
};

export default EmployeeService;
