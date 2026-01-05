import api from './api';
import { addUser } from './authService';

// Mock data
let employees = [
    { id: 1, name: 'Admin User', email: 'admin@example.com', role: 'admin', position: 'Administrator', contractType: 'B2B', hours: 160, leaveBalance: 26, managerId: null },
    { id: 2, name: 'Manager Alice', email: 'alice@example.com', role: 'manager', position: 'Team Lead 1', contractType: 'UoP', hours: 160, leaveBalance: 26, managerId: null },
    { id: 3, name: 'Manager Emily', email: 'emily@example.com', role: 'manager', position: 'Team Lead 2', contractType: 'UoP', hours: 160, leaveBalance: 26, managerId: null },
    { id: 4, name: 'John Doe', email: 'john@example.com', role: 'employee', position: 'Developer', contractType: 'UoP', hours: 160, leaveBalance: 20, managerId: 2 },
    { id: 5, name: 'Jane Smith', email: 'jane@example.com', role: 'employee', position: 'Designer', contractType: 'UoP', hours: 160, leaveBalance: 20, managerId: 3 },
    { id: 6, name: 'Bob Johnson', email: 'bob@example.com', role: 'employee', position: 'QA Engineer', contractType: 'UoP', hours: 160, leaveBalance: 20, managerId: 2 }
];

export const getEmployees = async () => {
    return new Promise(resolve => setTimeout(() => resolve([...employees]), 300));
};

export const getEmployeeById = async (id) => {
    return new Promise(resolve => setTimeout(() => resolve(employees.find(e => e.id === id)), 300));
};

export const getManagers = async () => {
    return new Promise(resolve => setTimeout(() => resolve(employees.filter(e => e.role === 'manager')), 300));
};

export const getEmployeesByManagerId = async (managerId) => {
    return new Promise(resolve => setTimeout(() => resolve(employees.filter(e => e.managerId === managerId)), 300));
};

export const createEmployee = async (employee) => {
    return new Promise(resolve => {
        setTimeout(() => {
            const newEmployee = { ...employee, id: employees.length + 1, leaveBalance: 20 }; // Default balance
            employees.push(newEmployee);

            // Add to auth system
            addUser({
                id: newEmployee.id,
                email: newEmployee.email,
                password: 'password',
                role: newEmployee.role,
                name: newEmployee.name,
                changePasswordRequired: true
            });

            resolve(newEmployee);
        }, 300);
    });
};

export const updateEmployee = async (id, employee) => {
    return new Promise(resolve => {
        setTimeout(() => {
            const index = employees.findIndex(e => e.id === id);
            if (index !== -1) {
                employees[index] = { ...employees[index], ...employee };
                resolve(employees[index]);
            } else {
                resolve(null);
            }
        }, 300);
    });
};

export const deleteEmployee = async (id) => {
    return new Promise(resolve => {
        setTimeout(() => {
            employees = employees.filter(e => e.id !== id);
            resolve(true);
        }, 300);
    });
};
