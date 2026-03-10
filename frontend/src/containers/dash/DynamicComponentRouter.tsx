import React from 'react';
import SecureStorage from '../../utils/SecureStorage';
import { getOrderedNavigationItems } from '../../utils/navigationUtils';
import { getSashaktUserRouteItems } from '../../config/sashaktUserNavigation';

import BranchScreening from '../../components/Panels/BranchScreening/screening';
import DiscrepancyTracker from '../../components/Panels/DiscrepancyTracker/filter';
import DiscrepancyManager from '../../components/Panels/DiscrepancyManager/filter';
import DiscrepancyManagerCustomerLink from '../../components/Panels/DiscrepancyManagerLink/filter';
import DiscrepancyManagerCustomerUpload from '../../components/Panels/DiscrepancyManagerUpload/filter';
import Zipnach from '../../components/Panels/Zipnach/filter';
import ZipnachReport from '../../components/Panels/ZipnachTracker/filter';
import ROMEnachValidation from '../../components/Panels/EnachValidation/filter';
import PaymentMandate from '../../components/Panels/PaymentMandate';
import PIVC from '../../components/Panels/PIVC/filter';
import BranchScan from '../../components/Panels/BranchScan';
import AdminRaiseRequest from '../../components/Panels/AdminRequest/AdminRaiseRequest';
import MailRoomStatusFilter from '../../components/Panels/MailRoom/Status/filter';
import MedicalStatus from '../../components/Panels/Nml/MedicalStatus/index';
import BimaRakshakHome from '../../components/Panels/BimaRakshak/BimaRakshakHome';
import ProposalReport from '../../components/Panels/ProposalReport/filter';
import OpsDocs from '../../components/Panels/OpsDocs/index';
import MobileValidation from '../../components/Panels/MobileValidation';
import DigitalSignature from '../../components/Panels/DigitalSignature';
import EmailValidation from '../../components/Panels/EmailValidation';
import BankValidation from '../../components/Panels/BankValidation';
import PanVerification from '../../components/Panels/PanVerification';
import AmedementFormA from '../../components/Panels/Form/PolicyAmedmentFormA';
import AmedementFormB from '../../components/Panels/Form/PolicyAmedmentFormB';
import NMLHome from '../../components/Panels/Nml/Home/index';
import NmlOne from '../../components/Panels/Nml/Home/Nml_one';
import MedicalSchedulingForm from '../../components/Panels/Nml/ScheduleMedical/index';
import NFLHome from '../../components/Panels/Nfl/index';
import UserManagement from '../../components/Panels/UserManagement/Index';
import Intermediary from '../../components/Panels/Intermediary-Salessupport';
import Intermediarydops from '../../components/Panels/Intermediary-dops/index';
import BTSPOCAdminRequest from '../../components/Panels/AdminRequest/BTSPOCAdminRequest';
import TATReport from '../../components/Panels/TATReport';
import AdminApprovedTicket from '../../components/Panels/AdminRequest/AdminView/approvedTickets';
import AdminTicketView from '../../components/Panels/AdminRequest/AdminView/adminTicketView';
import ReleaseManager from '../../components/Admin/ReleaseManager';
import SpeedBizTicketDashboard from '../../components/Panels/SpeedBizTicketDashboard/index';
import SpeedbizReport from '../../components/Panels/SpeedBizTicketDashboard/Reports/index';
import SashaktUsers from '../../components/Panels/SashaktUsers/Index';
import BulkExperianReport from '../../components/Panels/CibilScore/BulkExperianReport';
import COPSQCSuper from '../../components/Panels/COPSQC-Super/index';
import COPSQCUser from '../../components/Panels/COPSQC-User/index';
import PolicyCover from '../../components/Panels/PolicyCover';
const componentMap: Record<string, React.ComponentType> = {
  'Screening': BranchScreening,
  'Discrepancy-Tracker': DiscrepancyTracker,
  'Discrepancy-QC': DiscrepancyManager,
  'Discrepancy Customer Link': DiscrepancyManagerCustomerLink,
  'Discrepancy Customer Upload': DiscrepancyManagerCustomerUpload,
  'ACH Mandate': Zipnach,
  'ACH MIS Report': ZipnachReport,
  'Physical Enach': ROMEnachValidation,
  'Payment Mandate': PaymentMandate,
  'VPIVC': PIVC,
  'Branch Scan & Index': BranchScan,
  'Raise Admin Request': AdminRaiseRequest,
  'Mail Room Status': MailRoomStatusFilter,
  'Medical Status': MedicalStatus,
  'Medical Status drop': MedicalStatus,
  'Bimarakshak': BimaRakshakHome,
  'Proposal Report': ProposalReport,
  'OPS Repository': OpsDocs,
  'Mobile Authentication': MobileValidation,
  'Digital Signature': DigitalSignature,
  'Email Authentication': EmailValidation,
  'Bank Authentication': BankValidation,
  'Pan Validation': PanVerification,
  'Amendment Form A': AmedementFormA,
  'Amendment Form B': AmedementFormB,
  'NML': NMLHome,
  'NML1': NmlOne,
  'Schedule Medical': MedicalSchedulingForm,
  'NFL': NFLHome,
  'User Management': UserManagement,
  'Intermediary': Intermediary,
  'Intermediary Dashboard': Intermediarydops,
  'My Assigned Tickets': BTSPOCAdminRequest,
  'Admin Ticket Report': TATReport,
  'Admin Approved Ticket': AdminApprovedTicket,
  'Admin Ticket': AdminTicketView,
  'Dashboard': ReleaseManager,
  'SpeedBiz Ticket Dashboard': SpeedBizTicketDashboard,
  'Reports': SpeedbizReport,
  'Sashakt Users': SashaktUsers,
  'bulk-experian-report':BulkExperianReport,
  'COPSQC Super' : COPSQCSuper,
  'COPSQC User' : COPSQCUser,
  'policy-cover': PolicyCover,
};

const DynamicComponentRouter: React.FC = () => {
  const user: any = SecureStorage.getItem('user');
  const modulePermissions = user?.modulePermissions || [];

  if (modulePermissions.length === 0) {
    return <div>No access permissions found</div>;
  }

  const navigationItems = getSashaktUserRouteItems().map(item => ({
    ...item,
    name: '',
    icon: null
  }));

  const orderedItems = getOrderedNavigationItems(navigationItems);

  if (orderedItems.length === 0) {
    return <div>No accessible modules found</div>;
  }

  const firstAvailablePermission = orderedItems[0].permission;
  const ComponentToRender = componentMap[firstAvailablePermission];

  if (!ComponentToRender) {
    return <div>Component not found for permission: {firstAvailablePermission}</div>;
  }

  return <ComponentToRender />;
};

export default DynamicComponentRouter;
