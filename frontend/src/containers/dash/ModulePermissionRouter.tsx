import React from 'react';
import { Navigate } from 'react-router-dom';
import SecureStorage from '../../utils/SecureStorage';
import { getOrderedNavigationItems } from '../../utils/navigationUtils';

// Import navigation items definition
const getNavigationItems = () => [
  { id: 'screening', path: '/dashboard/SashaktUser', permission: 'Screening' },
  { id: 'discrepancy-tracker', path: '/dashboard/SashaktUser/discrepancy-tracker', permission: 'Discrepancy-Tracker' },
  { id: 'discrepancy-qc', path: '/dashboard/SashaktUser/discrepancy-manager', permission: 'Discrepancy-QC' },
  { id: 'discrepancy-customer-link', path: '/dashboard/SashaktUser/discrepancy-customer-link', permission: 'Discrepancy Customer Link' },
  { id: 'discrepancy-customer-upload', path: '/dashboard/SashaktUser/discrepancy-customer-upload', permission: 'Discrepancy Customer Upload' },
  { id: 'ach-mandate', path: '/dashboard/SashaktUser/zipnach', permission: 'ACH Mandate' },
  { id: 'ach-mis-report', path: '/dashboard/SashaktUser/zipnach-tracker', permission: 'ACH MIS Report' },
  { id: 'physical-enach', path: '/dashboard/SashaktUser/enach-validation', permission: 'Physical Enach' },
  { id: 'payment-mandate', path: '/dashboard/SashaktUser/payment-mandate', permission: 'Payment Mandate' },
  { id: 'vpivc', path: '/dashboard/SashaktUser/pivc', permission: 'VPIVC' },
  { id: 'branch-scan', path: '/dashboard/SashaktUser/branchScan', permission: 'Branch Scan & Index' },
  { id: 'raise-admin-request', path: '/dashboard/SashaktUser/raise-admin-request', permission: 'Raise Admin Request' },
  { id: 'ops-data-correction', path: '/dashboard/SashaktUser/ops-data-correction', permission: 'Ops Data Correction' },
  { id: 'mail-room-status', path: '/dashboard/SashaktUser/mail-room-status', permission: 'Mail Room Status' },
  { id: 'medical-status', path: '/dashboard/SashaktUser/MedicalStatus', permission: 'Medical Status' },
  { id: 'bimarakshak', path: '/dashboard/SashaktUser/bimarakshak', permission: 'Bimarakshak' },
  { id: 'proposal-report', path: '/dashboard/SashaktUser/proposal-report', permission: 'Proposal Report' },
  { id: 'ops-repository', path: '/dashboard/SashaktUser/opsdocs', permission: 'OPS Repository' },
  { id: 'mobile-auth', path: '/dashboard/SashaktUser/mobile', permission: 'Mobile Authentication' },
  { id: 'digital-signature', path: '/dashboard/SashaktUser/digital-signature', permission: 'Digital Signature' },
  { id: 'email-auth', path: '/dashboard/SashaktUser/email', permission: 'Email Authentication' },
  { id: 'bank-auth', path: '/dashboard/SashaktUser/bank', permission: 'Bank Authentication' },
  { id: 'pan-verification', path: '/dashboard/SashaktUser/pan-verification', permission: 'Pan Validation' },
  { id: 'amendment-form-a', path: '/dashboard/SashaktUser/amedment-form-A', permission: 'Amendment Form A' },
  { id: 'amendment-form-b', path: '/dashboard/SashaktUser/amedment-form-B', permission: 'Amendment Form B' },
  { id: 'nml', path: '/dashboard/SashaktUser/NML', permission: 'NML' },
  { id: 'nml1', path: '/dashboard/SashaktUser/NML1', permission: 'NML1' },
  { id: 'schedule-medical', path: '/dashboard/SashaktUser/scheduling', permission: 'Schedule Medical' },
  { id: 'uw-medical-status', path: '/dashboard/SashaktUser/medical-status', permission: 'Medical Status drop' },
  { id: 'nfl', path: '/dashboard/SashaktUser/financial', permission: 'NFL' },
  { id: 'Cibil Score', path: '/dashboard/SashaktUser/cibil-score', permission: 'CIBIL Score' },
  { id: 'user-management', path: '/dashboard/SashaktUser/user-management', permission: 'User Management' },
  { id: 'intermediary', path: '/dashboard/SashaktUser/intermediary', permission: 'Intermediary' },
  { id: 'intermediary-dashboard', path: '/dashboard/SashaktUser/intermediary-dashboard', permission: 'Intermediary Dashboard' },
  { id: 'sashakt-users', path: '/dashboard/SashaktUser/sashakt-users', permission: 'Sashakt Users' },
  { id: 'speedbiz-dashboard', path: '/dashboard/SashaktUser/speedbiz-dashboard', permission: 'SpeedBiz Ticket Dashboard' },
  { id: 'my-assigned-tickets', path: '/dashboard/SashaktUser/assigned-admin-request', permission: 'My Assigned Tickets' },
  { id: 'admin-ticket-report', path: '/dashboard/SashaktUser/admin-ticket-report', permission: 'Admin Ticket Report' },
  { id: 'admin-approved-ticket', path: '/dashboard/SashaktUser/admin-approved-ticket', permission: 'Admin Approved Ticket' },
  { id: 'admin-ticket', path: '/dashboard/SashaktUser/admin-ticket', permission: 'Admin Ticket' },
  { id: 'release-manager', path: '/dashboard/SashaktUser/release-manager', permission: 'Dashboard' },
  { id: 'speedbiz-dashboard', path: '/dashboard/SashaktUser/speedbiz-dashboard', permission: 'Dashboard' },
  { id: 'speedbiz-reports', path: '/dashboard/SashaktUser/speedbiz-reports', permission: 'Reports' },
  { id: 'customer-details', path: '/dashboard/SashaktUser/customer-details', permission: 'Customer Details' },
  { id: 'aob-dashboard', path: '/dashboard/SashaktUser/aob/dashboard', permission: 'AOB Dashboard' },
  { id: 'aob-pan-validation', path: '/dashboard/SashaktUser/aob/pan-validation', permission: 'AOB PAN Validation' },
  { id: 'aob-application-form', path: '/dashboard/SashaktUser/aob/applications/new', permission: 'AOB Create Application' },
  { id: 'aob-application-list', path: '/dashboard/SashaktUser/aob/applications', permission: 'AOB View Applications' },
  { id: 'aob-documents', path: '/dashboard/SashaktUser/aob/documents', permission: 'AOB Documents' },
  { id: 'aob-payments', path: '/dashboard/SashaktUser/aob/payments', permission: 'AOB Payments' },
  { id: 'aob-qc', path: '/dashboard/SashaktUser/aob/qc', permission: 'AOB QC' },
  { id: 'aob-training', path: '/dashboard/SashaktUser/aob/training', permission: 'AOB Training' },
  { id: 'aob-agents', path: '/dashboard/SashaktUser/aob/agents', permission: 'AOB Agents' },
  { id: 'bulk-experian-report', path: '/dashboard/SashaktUser/bulk-experian-report', permission: 'bulk-experian-report' },
  { id: 'copsqc-super', path: '/dashboard/SashaktUser/copsqc-super', permission: 'COPSQCSuper' },
  { id: 'copsqc-user', path: '/dashboard/SashaktUser/copsqc-user', permission: 'COPSQCUser' },
  { id: 'policy-cover', path: '/dashboard/SashaktUser/policy-cover', permission: 'Policy Cover' },
];

interface ModulePermissionRouterProps {
  path: string;
  query: string;
}

const ModulePermissionRouter: React.FC<ModulePermissionRouterProps> = ({ path, query }) => {
  const user: any = SecureStorage.getItem('user');
  const modulePermissions = user?.modulePermissions || [];

  const getDefaultRoute = () => {
    if (modulePermissions.length === 0) {
      return '/dashboard/SashaktUser/no-access';
    }

    const navigationItems = getNavigationItems().map(item => ({
      ...item,
      name: '',
      icon: null
    }));

    const orderedItems = getOrderedNavigationItems(navigationItems);
    console.log(orderedItems, 'orderedItems');
    if (orderedItems.length > 0) {
      return orderedItems[0].path;
    }

    return '/dashboard/SashaktUser';
  };
  console.log('path Suryash', path)
  const targetPath = path.split('/').length === 2 ? getDefaultRoute() : path;

  return <Navigate to={`${targetPath}${query}`} replace />;
};

export default ModulePermissionRouter;