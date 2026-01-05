import api from './api';
import { getEmployeesByManagerId } from './employeeService';

// Mock data
// IDs from employeeService:
// 4: John Doe (Manager: Alice/2)
// 5: Jane Smith (Manager: Emily/3)
// 6: Bob Johnson (Manager: Alice/2)
let leaveRequests = [
    { id: 1, userId: 4, userName: 'John Doe', type: 'Annual', startDate: '2023-12-01', endDate: '2023-12-05', status: 'Pending', days: 5 },
    { id: 2, userId: 5, userName: 'Jane Smith', type: 'Sick', startDate: '2023-11-20', endDate: '2023-11-22', status: 'Approved', days: 3 },
    { id: 3, userId: 6, userName: 'Bob Johnson', type: 'Annual', startDate: '2023-12-10', endDate: '2023-12-15', status: 'Pending', days: 6 },
    { id: 4, userId: 5, userName: 'Jane Smith', type: 'Annual', startDate: '2023-12-20', endDate: '2023-12-24', status: 'Pending', days: 5 },
    { id: 5, userId: 4, userName: 'John Doe', type: 'Sick', startDate: '2023-10-01', endDate: '2023-10-03', status: 'Approved', days: 16 },
    { id: 6, userId: 4, userName: 'John Doe', type: 'Annual', startDate: '2023-10-01', endDate: '2023-10-03', status: 'Approved', days: 4 }
];

export const getAllLeaves = async () => {
    return new Promise(resolve => setTimeout(() => resolve([...leaveRequests]), 300));
};

export const getLeavesByUserId = async (userId) => {
    return new Promise(resolve => setTimeout(() => resolve(leaveRequests.filter(l => l.userId === userId)), 300));
};

export const createLeaveRequest = async (request) => {
    return new Promise(resolve => {
        setTimeout(() => {
            const status = request.type === 'Sick' ? 'Approved' : 'Pending';
            const newRequest = { ...request, id: leaveRequests.length + 1, status };
            leaveRequests.push(newRequest);
            resolve(newRequest);
        }, 300);
    });
};

export const updateLeaveStatus = async (id, status) => {
    return new Promise(resolve => {
        setTimeout(() => {
            const index = leaveRequests.findIndex(l => l.id === id);
            if (index !== -1) {
                leaveRequests[index].status = status;
                resolve(leaveRequests[index]);
            } else {
                resolve(null);
            }
        }, 300);
    });
};

export const getPendingLeaves = async () => {
    return new Promise(resolve => setTimeout(() => resolve(leaveRequests.filter(l => l.status === 'Pending')), 300));
};

export const getLeavesByManagerId = async (managerId) => {
    const myEmployees = await getEmployeesByManagerId(managerId);
    const myEmployeeIds = myEmployees.map(e => e.id);
    return new Promise(resolve => setTimeout(() => resolve(leaveRequests.filter(l => myEmployeeIds.includes(l.userId))), 300));
};

export const getPendingLeavesByManagerId = async (managerId) => {
    const myEmployees = await getEmployeesByManagerId(managerId);
    const myEmployeeIds = myEmployees.map(e => e.id);
    return new Promise(resolve => setTimeout(() => resolve(leaveRequests.filter(l => myEmployeeIds.includes(l.userId) && l.status === 'Pending')), 300));
};
