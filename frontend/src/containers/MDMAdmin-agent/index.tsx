import React from "react";
import MDMAdminDashboardLeft from '../../pages/MDMAdmin-Panel/dashboard-left/index';
import MDMAdminDashboardRight from '../../pages/MDMAdmin-Panel/dashboard-right/index';
import DashboardHeader from '../../components/Dashboard/header';
import DashboardFooter from '../../components/Dashboard/footer';
import { makeStyles } from '@mui/styles';
const useStyles = makeStyles({
    container: {
        display: 'flex',
        padding: "20px"
    }
});

interface Props {
    children: any;
}

const MDMAdminDash: React.FC<Props> = ({ children }) => {
    const [navOpen, setNavOpen] = React.useState(false);
    return (
        <div className="dashboard-wrapper agent-dashboard-wrapper" >
            <MDMAdminDashboardLeft  setNavOpen={setNavOpen} navOpen={navOpen}/>
            <DashboardHeader setNavOpen={setNavOpen} navOpen={navOpen} />
            <MDMAdminDashboardRight>{children && children}</MDMAdminDashboardRight>
            <DashboardFooter />
        </div>
    );
};

export default MDMAdminDash;

