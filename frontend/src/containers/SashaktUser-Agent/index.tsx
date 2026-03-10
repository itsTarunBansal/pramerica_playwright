import React from 'react';
import SashaktUserDashboardLeft from '../../pages/SashaktUser-Panel/dashboard-left';
import SashaktUserDashboardRight from '../../pages/SashaktUser-Panel/dashboard-right';
import DashboardHeader from '../../components/Dashboard/header';
import DashboardFooter from '../../components/Dashboard/footer';
import FeatureLaunchBanner from '../../components/Shared/FeatureLaunchBanner';
import { makeStyles } from '@mui/styles';
const useStyles = makeStyles({
  container: {
    display: 'flex',
    padding: '20px',
  },
});

interface Props {
  children: any;
}

const SashaktUserDash: React.FC<Props> = ({ children }) => {
  const [navOpen, setNavOpen] = React.useState(false);
  const [isLaunched, setIsLaunched] = React.useState(() => {
    return localStorage.getItem('adminTicketFeatureLaunched') === 'true';
  });

  const handleDismissBanner = () => {
    setIsLaunched(true);
    localStorage.setItem('adminTicketFeatureLaunched', 'true');
  };

  return (
    <div className="dashboard-wrapper agent-dashboard-wrapper">
      <FeatureLaunchBanner onDismiss={()=> console.log("Launched")}/>
      <SashaktUserDashboardLeft setNavOpen={setNavOpen} navOpen={navOpen} />
      <DashboardHeader setNavOpen={setNavOpen} navOpen={navOpen} />
      <SashaktUserDashboardRight>{children && children}</SashaktUserDashboardRight>
      <DashboardFooter />
    </div>
  );
};

export default SashaktUserDash;