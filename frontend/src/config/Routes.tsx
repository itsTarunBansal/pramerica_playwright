import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from '../components/Login';
import AuthenticatedRoutes from './AuthenticatedRoutes';
import HasRole from './HasRole';
import SnackBar from "../components/SnackBar";
// import NotificationToast from "../components/Shared/NotificationToast";

import TATReport from '../components/Panels/TATReport';
import ProposalReport from '../components/Panels/ProposalReport/filter'
import DiscrepancyManager from '../components/Panels/DiscrepancyManager/filter'
import FilterTableHOC from '../components/Shared/FilterTable/FilterTableHOC';
import UserManagement from '../components/Panels/UserManagement/Index';
import BranchScreening from "../components/Panels/BranchScreening/screening";
import OpsDocs from '../components/Panels/OpsDocs/index';
import PIVC from '../components/Panels/PIVC/filter';
import AmedementFormA from '../components/Panels/Form/PolicyAmedmentFormA';
import AmedementFormB from '../components/Panels/Form/PolicyAmedmentFormB';
import Zipnach from '../components/Panels/Zipnach/filter';
import DiscrepancyTracker from '../components/Panels/DiscrepancyTracker/filter';
import EmailValidation from '../components/Panels/EmailValidation';
import MobileValidation from '../components/Panels/MobileValidation';
import BankValidation from '../components/Panels/BankValidation';
import DiscrepancyManagerCustomerLink from '../components/Panels/DiscrepancyManagerLink/filter';
import DigitalSignature from '../components/Panels/DigitalSignature';
import DiscrepancyManagerCustomerUpload from '../components/Panels/DiscrepancyManagerUpload/filter'
import QcDashboard from '../components/Panels/QcDashboard';
import BimaRakshakHome from '../components/Panels/BimaRakshak/BimaRakshakHome';
import BimaRakshakPolicyView from '../components/Panels/BimaRakshak/BimaRakshakHome/policyViewById';
import BimaRakshakGenerateReportView from '../components/Panels/BimaRakshak/BimaRakshakHome/Generatereport';
import GenAIDash from '../components/Panels/GenAI/Home/MainDashboard';
import GenAIMessage from '../components/Panels/GenAI/MessageHistoryTab/filter';
import GenAIChat from '../components/Panels/GenAI/ChatUI';
import GenAIHome from '../components/Panels/GenAI/Home/filter';
import EmployeeHome from '../components/Panels/EmployeeHome/index';
import HRMSHome from '../components/Panels/HRMSHome/index';
import Intermediary from '../components/Panels/Intermediary-Salessupport';
import ZipnachReport from '../components/Panels/ZipnachTracker/filter';
import MedicalReport from '../components/Panels/MedicalReport/index';
import MedicalReportView from "../components/Panels/MedicalReport/reportViewById";
import NMLReportView from "../components/Panels/NMLReport";
import Intermediarydops from '../components/Panels/Intermediary-dops/index';
import ROMEnachValidation from '../components/Panels/EnachValidation/filter'
// import CustomerReportDashboard from '../components/Panels/CustomerReport';
import NMLHome from '../components/Panels/Nml/Home/index';
import MedicalSchedulingForm from '../components/Panels/Nml/ScheduleMedical/index';
import MedicalStatus from '../components/Panels/Nml/MedicalStatus/index';
import NmlOne from '../components/Panels/Nml/Home/Nml_one';
import NFLHome from '../components/Panels/Nfl/index'
import PanVerification from '../components/Panels/PanVerification';
import BranchScan from '../components/Panels/BranchScan';
import AdminRaiseRequest from '../components/Panels/AdminRequest/AdminRaiseRequest';
import BTSPOCAdminRequest from '../components/Panels/AdminRequest/BTSPOCAdminRequest';
import FeatureLaunchBanner from '../components/Shared/FeatureLaunchBanner';
import ReleaseManager from '../components/Admin/ReleaseManager';
import LaunchDashboard from '../components/Admin/LaunchDashboard';
import LaunchModal from '../components/Shared/LaunchModal';
import LaunchNotificationProvider from '../components/Shared/LaunchNotificationProvider';
import PresentationLaunchPanel from '../components/Admin/PresentationLaunchPanel';
import ProtectedLaunchPage from '../components/Shared/ProtectedLaunchPage';
import WebSocketDebug from '../components/Shared/WebSocketDebug';
import AdminTicketView from '../components/Panels/AdminRequest/AdminView/adminTicketView';
import AdminApprovedTicket from '../components/Panels/AdminRequest/AdminView/approvedTickets';
import SpeedBizTicketDashboard from '../components/Panels/SpeedBizTicketDashboard/index';
import SpeedbizTicketbyId from '../components/Panels/SpeedBizTicketDashboard/viewTicket/viewTicket'
import SpeedbizReport from '../components/Panels/SpeedBizTicketDashboard/Reports/index';
import MailRoomStatusFilter from '../components/Panels/MailRoom/Status/filter';
import SashaktUserDash from '../containers/SashaktUser-Agent';
import PaymentMandate from '../components/Panels/PaymentMandate';
import LogViewer from '../components/Panels/LogViewer';
import COPSQCSuper from '../components/Panels/COPSQC-Super';
import COPSQCUser from '../components/Panels/COPSQC-User';
// import ROMEnachValidation from '..'
import DynamicComponentRouter from '../containers/dash/DynamicComponentRouter';
import EquitasCustomerFetch from '../components/Panels/CustomerDetails';
import BTSPOCManagement from '../components/Panels/AdminRequest/BTSPOCManagement';
import ZoneManagement from '../components/Panels/AdminRequest/ZoneManagement';
import { OpsDataCorrectionPanel } from '../components/Panels/OpsDataCorrection';
import SashaktUsersIndex from '../components/Panels/SashaktUsers/Index';
import CibilScore from '../components/Panels/CibilScore';
import BulkExperianReport from '../components/Panels/CibilScore/BulkExperianReport';
import DopsUploadDownload from '../components/Panels/DopsUploadDownload';
import Unauthorized from '../components/Unauthorized';
import SimpleRouteChecker from '../components/SimpleRouteChecker';
import PolicyCover from '../components/Panels/PolicyCover';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <SnackBar />
      {/* <NotificationToast /> */}

      <FeatureLaunchBanner onDismiss={() => console.log("Launched")} />
      {/* <LaunchNotificationProvider /> */}

      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="dashboard" element={<AuthenticatedRoutes />} />
        {/* <Route path="/launch/:role" element={<ProtectedLaunchPage />} /> */}
        <Route
          path="dashboard/SashaktUser/*"
          element={
            <HasRole role="SashaktUser">
              <SashaktUserDash>
                {/* <SimpleRouteChecker /> */}
                <Routes>
                  {/* <Route path="/" element={<BranchScreening />} /> */}
                  <Route path="/" element={<DynamicComponentRouter />} />
                  <Route path="unauthorized" element={<Unauthorized />} />
                  <Route path="email" element={<EmailValidation />} />
                  <Route path="mobile" element={<MobileValidation />} />
                  <Route path="bank" element={<BankValidation />} />
                  <Route path="digital-signature" element={<DigitalSignature />} />
                  <Route path="proposal-report" element={<ProposalReport />} />
                  <Route path="discrepancy-manager" element={<DiscrepancyManager />} />
                  <Route path="/user-management" element={<UserManagement />} />
                  <Route path="sashakt-users" element={<SashaktUsersIndex />} />
                  <Route path="logs" element={<LogViewer />} />
                  <Route path="opsdocs" element={<OpsDocs />} />
                  <Route path="pivc" element={<PIVC />} />
                  <Route path="amedment-form-A" element={<AmedementFormA />} />
                  <Route path="amedment-form-B" element={<AmedementFormB />} />
                  <Route path="zipnach" element={<Zipnach />} />
                  <Route path="zipnach-tracker" element={<ZipnachReport />} />
                  <Route path="discrepancy-tracker" element={<DiscrepancyTracker />} />
                  <Route path="discrepancy-customer-link" element={<DiscrepancyManagerCustomerLink />} />
                  <Route path="discrepancy-customer-upload" element={<DiscrepancyManagerCustomerUpload />} />
                  <Route path="qc-dashboard" element={<QcDashboard />} />
                  <Route path="branchScan" element={<BranchScan />} />
                  <Route path="MedicalStatus" element={< MedicalStatus />} />
                  <Route path="websocket-debug" element={<WebSocketDebug />} />
                  <Route path="release-manager" element={<ReleaseManager />} />
                  <Route path="launch-dashboard" element={<ProtectedLaunchPage />} />
                  <Route path="presentation-launch" element={<PresentationLaunchPanel />} />
                  <Route path="assigned-admin-request" element={<BTSPOCAdminRequest />} />
                  <Route path="admin-ticket-report" element={<TATReport />} />
                  <Route path="admin-ticket" element={<AdminTicketView />} />
                  <Route path="btspoc-management" element={<BTSPOCManagement />} />
                  <Route path="zone-management" element={<ZoneManagement />} />
                  <Route path="ops-data-correction" element={<OpsDataCorrectionPanel />} />
                  <Route path="enach-validation" element={<ROMEnachValidation />} />
                  <Route path="payment-mandate" element={<PaymentMandate />} />
                  <Route path="pan-verification" element={<PanVerification />} />
                  <Route path="bimarakshak" element={<BimaRakshakHome />} />
                  <Route path="bimarakshak/policy-view/:id" element={<BimaRakshakPolicyView />} />
                  <Route path="raise-admin-request" element={<AdminRaiseRequest />} />
                  <Route path="branch-admin-request" element={<BTSPOCAdminRequest />} />
                  <Route path="mail-room-status" element={<MailRoomStatusFilter />} />
                  <Route path="customer-details" element={<EquitasCustomerFetch />} />
                  <Route path="intermediary" element={<Intermediary />} />
                  <Route path="intermediary-dashboard" element={<Intermediarydops />} />
                  <Route path="discrepancy-manager-QC" element={<DiscrepancyManager />} />
                  <Route path="discrepancy-upload" element={<DiscrepancyManagerCustomerUpload />} />
                  <Route path="admin-approved-ticket" element={<AdminApprovedTicket />} />
                  <Route path="speedbiz-dashboard" element={<SpeedBizTicketDashboard />} />
                  <Route path="speedbiz-view-ticket/:id" element={<SpeedbizTicketbyId />} />
                  <Route path="speedbiz-reports" element={<SpeedbizReport />} />
                  {/* UW Routes */}
                  <Route path="NML" element={<NMLHome />} />
                  <Route path="scheduling" element={<MedicalSchedulingForm />} />
                  {/* <Route path="UW/pan-check" element={<PanCheck />} /> */}
                  <Route path="medical-status" element={<MedicalStatus />} />
                  <Route path="NML1" element={<NmlOne />} />
                  <Route path="bulk-experian-report" element={<BulkExperianReport />} />
                  <Route path="dops-upload-download" element={<DopsUploadDownload />} />
                  <Route path="financial" element={<NFLHome />} />
                  <Route path="copsqc-super" element={<COPSQCSuper />} />
                  <Route path="copsqc-user" element={<COPSQCUser />} />
                  {/* <Route path="create-user" element={<UserCreationPage />} /> */}

                  {/* AOB Routes */}
                  {/* <Route path="aob/dashboard" element={<AOBDashboard />} />
                  <Route path="aob/pan-validation" element={<PANValidation />} />
                  <Route path="aob/applications/new" element={<ApplicationForm />} />
                  <Route path="aob/applications" element={<ApplicationList />} />
                  <Route path="aob/documents" element={<DocumentUpload />} />
                  <Route path="aob/qc" element={<QCDashboard />} /> */}
                  {/* <Route path="aob/aob-dashboard" element={<AgentOnboarding />} /> */}
                  <Route path="cibil-score" element={<CibilScore />} />
                  {/* <Route path="agent-onboarding/create-agent" element={<CreateAgent />} />
                  <Route path="aob/update-application/:id" element={<Actions />} /> */}
                  <Route path="policy-cover" element={<PolicyCover />} />
                </Routes>
              </SashaktUserDash>
            </HasRole>
          }
        />
      </Routes>
      {/* </Routes> */}

    </BrowserRouter>
  );
};

export default AppRoutes;
