import { createRouter, createWebHistory } from 'vue-router';
import { getCurrentUser } from '../services/authService';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/login',
    redirect: '/'
  },
  {
    path: '/admin/employees',
    name: 'AdminEmployees',
    component: () => import('../views/admin/EmployeeList.vue'),
    meta: { requiresAuth: true, roles: ['admin'] }
  },
  {
    path: '/admin/leave-requests',
    name: 'AdminLeaveRequests',
    component: () => import('../views/admin/AdminLeaveRequests.vue'),
    meta: { requiresAuth: true, roles: ['admin'] }
  },
  {
    path: '/manager/employees',
    name: 'ManagerEmployees',
    component: () => import('../views/manager/ManagerEmployeeList.vue'),
    meta: { requiresAuth: true, roles: ['manager'] }
  },
  {
    path: '/manager/team-requests',
    name: 'ManagerTeamRequests',
    component: () => import('../views/manager/ManagerLeaveRequests.vue'),
    meta: { requiresAuth: true, roles: ['manager'] }
  },
  {
    path: '/user/profile',
    name: 'UserProfile',
    component: () => import('../views/user/UserProfile.vue'),
    meta: { requiresAuth: true, roles: ['employee', 'manager', 'admin'] }
  },
  {
    path: '/user/leave',
    name: 'UserLeave',
    component: () => import('../views/user/MyLeaveRequests.vue'),
    meta: { requiresAuth: true, roles: ['employee'] }
  },
  {
    path: '/manager/leave-approval',
    name: 'ManagerLeaveApproval',
    component: () => import('../views/manager/LeaveApprovals.vue'),
    meta: { requiresAuth: true, roles: ['manager'] }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const user = getCurrentUser();
  if (to.meta.requiresAuth) {
    if (!user) {
      next('/login');
    } else {
      if (to.meta.roles) {
        if (to.meta.roles.includes(user.role)) {
          next();
        } else {
          next(false);
        }
      } else {
        next();
      }
    }
  } else {
    next();
  }
});

export default router;
