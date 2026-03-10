import React from 'react';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import TimelineIcon from '@mui/icons-material/Timeline';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import CameraFrontIcon from '@mui/icons-material/CameraFront';
import BuildIcon from '@mui/icons-material/Build';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import SummarizeIcon from '@mui/icons-material/Summarize';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';
import ScannerIcon from '@mui/icons-material/Scanner';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import PersonIcon from '@mui/icons-material/Person';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ListAltIcon from '@mui/icons-material/ListAlt';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PaymentIcon from '@mui/icons-material/Payment';
import SchoolIcon from '@mui/icons-material/School';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ReportIcon from '@mui/icons-material/Report';
import CreditScoreIcon from '@mui/icons-material/CreditScore';
import BusinessIcon from '@mui/icons-material/Business';
import PublicIcon from '@mui/icons-material/Public';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
export interface NavigationItem {
  id: string;
  name: string;
  path: string;
  icon: React.ReactNode;
  permission: string;
  children?: NavigationItem[];
}

export const SASHAKT_USER_NAVIGATION_ITEMS: NavigationItem[] = [
  {
    id: 'screening',
    name: 'Screening',
    path: '/dashboard/SashaktUser',
    icon: <CameraFrontIcon />,
    permission: 'Screening'
  },
  {
    id: 'discrepancy',
    name: 'Discrepancy',
    path: '',
    icon: <TimelineIcon />,
    permission: 'Discrepancy-Tracker',
    children: [
      {
        id: 'discrepancy-tracker',
        name: 'Discrepancy-Tracker',
        path: '/dashboard/SashaktUser/discrepancy-tracker',
        icon: null,
        permission: 'Discrepancy-Tracker'
      },
      {
        id: 'discrepancy-qc',
        name: 'Discrepancy-QC',
        path: '/dashboard/SashaktUser/discrepancy-manager',
        icon: null,
        permission: 'Discrepancy-QC'
      },
      {
        id: 'discrepancy-customer-link',
        name: 'Discrepancy Customer Link',
        path: '/dashboard/SashaktUser/discrepancy-customer-link',
        icon: null,
        permission: 'Discrepancy Customer Link'
      },
      {
        id: 'discrepancy-customer-upload',
        name: 'Discrepancy Customer Upload',
        path: '/dashboard/SashaktUser/discrepancy-customer-upload',
        icon: null,
        permission: 'Discrepancy Customer Upload'
      }
    ]
  },
  {
    id: 'mandate',
    name: 'Mandate',
    path: '',
    icon: <CurrencyExchangeIcon />,
    permission: 'ACH Mandate',
    children: [
      {
        id: 'ach-mandate',
        name: 'ACH Mandate',
        path: '/dashboard/SashaktUser/zipnach',
        icon: null,
        permission: 'ACH Mandate'
      },
      {
        id: 'ach-mis-report',
        name: 'ACH MIS Report',
        path: '/dashboard/SashaktUser/zipnach-tracker',
        icon: null,
        permission: 'ACH MIS Report'
      }
    ]
  },
  {
    id: 'physical-enach',
    name: 'Physical Enach',
    path: '/dashboard/SashaktUser/enach-validation',
    icon: <ListAltIcon />,
    permission: 'Physical Enach'
  },
  {
    id: 'customer-details',
    name: 'Customer Details',
    path: '/dashboard/SashaktUser/customer-details',
    icon: null,
    permission: 'Customer Details'
  },
  {
    id: 'payment-mandate',
    name: 'Payment Mandate',
    path: '/dashboard/SashaktUser/payment-mandate',
    icon: <ListAltIcon />,
    permission: 'Payment Mandate'
  },
  {
    id: 'vpivc',
    name: 'VPIVC',
    path: '/dashboard/SashaktUser/pivc',
    icon: <i className="icon-self-service"></i>,
    permission: 'VPIVC'
  },
  {
    id: 'branch-scan',
    name: 'Branch Scan & Index',
    path: '/dashboard/SashaktUser/branchScan',
    icon: <ScannerIcon />,
    permission: 'Branch Scan & Index'
  },
  {
    id: 'raise-admin-request',
    name: 'Raise Admin Request',
    path: '/dashboard/SashaktUser/raise-admin-request',
    icon: <ScannerIcon />,
    permission: 'Raise Admin Request'
  },
  {
    id: 'ops-data-correction',
    name: 'Ops Data Correction',
    path: '/dashboard/SashaktUser/ops-data-correction',
    icon: <BuildIcon />,
    permission: 'Ops Data Correction'
  },
  {
    id: 'mail-room',
    name: 'Mail Room',
    path: '',
    icon: <TimelineIcon />,
    permission: 'Mail Room Status',
    children: [
      {
        id: 'mail-room-status',
        name: 'Status',
        path: '/dashboard/SashaktUser/mail-room-status',
        icon: null,
        permission: 'Mail Room Status'
      }
    ]
  },
  {
    id: 'medical-status',
    name: 'Medical Status',
    path: '/dashboard/SashaktUser/MedicalStatus',
    icon: <MedicalServicesIcon />,
    permission: 'Medical Status'
  },
  {
    id: 'bimarakshak',
    name: 'Bimarakshak',
    path: '/dashboard/SashaktUser/bimarakshak',
    icon: <CameraFrontIcon />,
    permission: 'Bimarakshak'
  },
  {
    id: 'proposal-report',
    name: 'Proposal Report',
    path: '/dashboard/SashaktUser/proposal-report',
    icon: <DocumentScannerIcon />,
    permission: 'Proposal Report'
  },
  {
    id: 'bulk-experian-report',
    name: 'Bulk Experian Report',
    path: '/dashboard/SashaktUser/bulk-experian-report',
    icon: <DocumentScannerIcon />,
    permission: 'bulk-experian-report'
  },
  {
    id: 'dops-upload-download',
    name: 'Dops Upload & Download',
    path: '/dashboard/SashaktUser/dops-upload-download',
    icon: <DocumentScannerIcon />,
    permission: 'Dops Upload & Download'
  },
  {
    id: 'ops-repository',
    name: 'OPS Repository',
    path: '/dashboard/SashaktUser/opsdocs',
    icon: <BuildIcon />,
    permission: 'OPS Repository'
  },
  {
    id: 'authentication',
    name: 'Authentication',
    path: '',
    icon: <VerifiedUserIcon />,
    permission: 'Mobile Authentication',
    children: [
      {
        id: 'mobile-auth',
        name: 'Mobile Authentication',
        path: '/dashboard/SashaktUser/mobile',
        icon: null,
        permission: 'Mobile Authentication'
      },
      {
        id: 'digital-signature',
        name: 'Digital Signature',
        path: '/dashboard/SashaktUser/digital-signature',
        icon: null,
        permission: 'Digital Signature'
      },
      {
        id: 'email-auth',
        name: 'Email Authentication',
        path: '/dashboard/SashaktUser/email',
        icon: null,
        permission: 'Email Authentication'
      },
      {
        id: 'bank-auth',
        name: 'Bank Authentication',
        path: '/dashboard/SashaktUser/bank',
        icon: null,
        permission: 'Bank Authentication'
      },
      {
        id: 'pan-verification',
        name: 'PAN Verification',
        path: '/dashboard/SashaktUser/pan-verification',
        icon: null,
        permission: 'Pan Validation'
      }
    ]
  },
  {
    id: 'amendment-forms',
    name: 'Amendment Forms',
    path: '',
    icon: <SummarizeIcon />,
    permission: 'Amendment Form A',
    children: [
      {
        id: 'amendment-form-a',
        name: 'Amendment Form A',
        path: '/dashboard/SashaktUser/amedment-form-A',
        icon: null,
        permission: 'Amendment Form A'
      },
      {
        id: 'amendment-form-b',
        name: 'Amendment Form B',
        path: '/dashboard/SashaktUser/amedment-form-B',
        icon: null,
        permission: 'Amendment Form B'
      }
    ]
  },
  {
    id: 'uw-medical',
    name: 'Medical',
    path: '',
    icon: <MedicalServicesIcon />,
    permission: 'NML',
    children: [
      {
        id: 'nml',
        name: 'NML',
        path: '/dashboard/SashaktUser/NML',
        icon: null,
        permission: 'NML'
      },
      {
        id: 'nml1',
        name: 'NML 1',
        path: '/dashboard/SashaktUser/NML1',
        icon: null,
        permission: 'NML1'
      },
      {
        id: 'schedule-medical',
        name: 'Schedule Medical',
        path: '/dashboard/SashaktUser/scheduling',
        icon: null,
        permission: 'Schedule Medical'
      },
      {
        id: 'uw-medical-status',
        name: ' Medical Status',
        path: '/dashboard/SashaktUser/medical-status',
        icon: null,
        permission: 'Medical Status drop'
      }
    ]
  },
  {
    id: 'uw-financial',
    name: 'Financial',
    path: '',
    icon: <AccountBalanceIcon />,
    permission: 'NFL',
    children: [
      {
        id: 'nfl',
        name: 'NFL',
        path: '/dashboard/SashaktUser/financial',
        icon: null,
        permission: 'NFL'
      }
    ]
  },
  {
    id: 'Cibil Score',
    name: 'CIBIL Score',
    path: '/dashboard/SashaktUser/cibil-score',
    icon: <CreditScoreIcon />,
    permission: 'Cibil Score'
  },
  {
    id: 'btspoc-management',
    name: 'BTSPOC Management',
    path: '/dashboard/SashaktUser/btspoc-management',
    icon: <BusinessIcon />,
    permission: 'BTSPOC Management'
  },
  {
    id: 'zone-management',
    name: 'Zone Management',
    path: '/dashboard/SashaktUser/zone-management',
    icon: <PublicIcon />,
    permission: 'Zone Management'
  },
  {
    id: 'digital-card',
    name: 'Digital Card',
    path: '/dashboard/SashaktUser/digital-card',
    icon: <CardMembershipIcon />,
    permission: 'Digital Card'
  },
  {
    id: 'cops-qc-super',
    name: 'COPSQCSuper',
    path: '/dashboard/SashaktUser/cops-qc-super',
    icon: <SupervisorAccountIcon />,
    permission: 'COPSQCSuper'
  },
  {
    id: 'cops-qc-user',
    name: 'COPSQCUser',
    path: '/dashboard/SashaktUser/cops-qc-user',
    icon: <SupervisorAccountIcon />,
    permission: 'COPSQCUser'
  },
  {
    id: 'user-management',
    name: 'User Management',
    path: '/dashboard/SashaktUser/user-management',
    icon: <PersonIcon />,
    permission: 'User Management'
  },
  {
    id: 'intermediary',
    name: 'Intermediary Onboarding',
    path: '/dashboard/SashaktUser/intermediary',
    icon: <PersonIcon />,
    permission: 'Intermediary'
  },
  {
    id: 'intermediary-dashboard',
    name: 'Intermediary Dashboard',
    path: '/dashboard/SashaktUser/intermediary-dashboard',
    icon: <PersonIcon />,
    permission: 'Intermediary Dashboard'
  },
  {
    id: 'sashakt-users',
    name: 'Sashakt Users',
    path: '/dashboard/SashaktUser/sashakt-users',
    icon: <PersonIcon />,
    permission: 'Sashakt Users'
  },
  {
    id: 'copsqc-super',
    name: 'COPSQCSuper',
    path: '/dashboard/SashaktUser/copsqc-super',
    icon: <PersonIcon />,
    permission: 'COPSQCSuper'
  },
  {
    id: 'speedbiz-dashboard',
    name: 'SpeedBiz Ticket Dashboard',
    path: '/dashboard/SashaktUser/speedbiz-dashboard',
    icon: <PersonIcon />,
    permission: 'SpeedBiz Ticket Dashboard'
  },
  {
    id: 'reports',
    name: 'Reports',
    path: '',
    icon: <ReportIcon />,
    permission: 'Reports',
    children: [
      {
        id: 'speedbiz-reports',
        name: 'SpeedBiz Reports',
        path: '/dashboard/SashaktUser/speedbiz-reports',
        icon: null,
        permission: 'Reports'
      },
      {
        id: 'tat-report',
        name: 'TAT Report',
        path: '/dashboard/SashaktUser/tat-report',
        icon: null,
        permission: 'TAT Report'
      },
      {
        id: 'medical-report',
        name: 'Medical Report',
        path: '/dashboard/SashaktUser/medical-report',
        icon: null,
        permission: 'Medical Report'
      }
    ]
  },
  {
    id: 'admin-tickets',
    name: 'Admin Tickets',
    path: '',
    icon: <AdminPanelSettingsIcon />,
    permission: 'My Assigned Tickets',
    children: [
      {
        id: 'my-assigned-tickets',
        name: 'My Assigned Tickets',
        path: '/dashboard/SashaktUser/assigned-admin-request',
        icon: null,
        permission: 'My Assigned Tickets'
      },
      {
        id: 'admin-ticket-report',
        name: 'Admin Ticket Report',
        path: '/dashboard/SashaktUser/admin-ticket-report',
        icon: null,
        permission: 'Admin Ticket Report'
      },
      {
        id: 'admin-approved-ticket',
        name: 'Admin Approved Ticket',
        path: '/dashboard/SashaktUser/admin-approved-ticket',
        icon: null,
        permission: 'Admin Approved Ticket'
      },
      {
        id: 'admin-ticket',
        name: 'Admin Ticket',
        path: '/dashboard/SashaktUser/admin-ticket',
        icon: null,
        permission: 'Admin Ticket'
      }
    ]
  },
  {
    id: 'release-manager',
    name: 'Release Manager',
    path: '/dashboard/SashaktUser/release-manager',
    icon: <BuildIcon />,
    permission: 'Dashboard'
  },
  {
    id: 'aob-dashboard',
    name: 'AOB Dashboard',
    path: '/dashboard/SashaktUser/aob/dashboard',
    icon: <AnalyticsIcon />,
    permission: 'AOB Dashboard'
  },
  {
    id: 'aob-applications',
    name: 'AOB Applications',
    path: '',
    icon: <AssignmentIcon />,
    permission: 'AOB Applications',
    children: [
      {
        id: 'aob-pan-validation',
        name: 'PAN Validation',
        path: '/dashboard/SashaktUser/aob/pan-validation',
        icon: null,
        permission: 'AOB PAN Validation'
      },
      {
        id: 'aob-application-form',
        name: 'New Application',
        path: '/dashboard/SashaktUser/aob/applications/new',
        icon: null,
        permission: 'AOB Create Application'
      },
      {
        id: 'aob-application-list',
        name: 'Application List',
        path: '/dashboard/SashaktUser/aob/applications',
        icon: null,
        permission: 'AOB View Applications'
      }
    ]
  },
  {
    id: 'aob-documents',
    name: 'AOB Documents',
    path: '/dashboard/SashaktUser/aob/documents',
    icon: <DocumentScannerIcon />,
    permission: 'AOB Documents'
  },
  {
    id: 'aob-payments',
    name: 'AOB Payments',
    path: '/dashboard/SashaktUser/aob/payments',
    icon: <PaymentIcon />,
    permission: 'AOB Payments'
  },
  {
    id: 'aob-qc',
    name: 'AOB Quality Control',
    path: '/dashboard/SashaktUser/aob/qc',
    icon: <VerifiedUserIcon />,
    permission: 'AOB QC'
  },
  {
    id: 'aob-training',
    name: 'AOB Training',
    path: '/dashboard/SashaktUser/aob/training',
    icon: <SchoolIcon />,
    permission: 'AOB Training'
  },
  {
    id: 'aob-agents',
    name: 'AOB Agent Management',
    path: '/dashboard/SashaktUser/aob/agents',
    icon: <PersonAddIcon />,
    permission: 'AOB Agents'
  },
  {
    id: 'policy-cover',
    name: 'Policy Cover',
    path: '/dashboard/SashaktUser/policy-cover',
    icon: null,
    permission: 'Policy Cover'
  },
];

// Flatten navigation items for routing purposes (without icons)
export const getSashaktUserRouteItems = () => {
  const flattenItems = (items: NavigationItem[]): Array<{ id: string; path: string; permission: string }> => {
    return items.reduce((acc, item) => {
      if (item.children) {
        acc.push(...flattenItems(item.children));
      } else if (item.path) {
        acc.push({ id: item.id, path: item.path, permission: item.permission });
      }
      return acc;
    }, [] as Array<{ id: string; path: string; permission: string }>);
  };

  return flattenItems(SASHAKT_USER_NAVIGATION_ITEMS);
};
