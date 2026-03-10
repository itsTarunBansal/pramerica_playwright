import React from "react";
import MDMApproverDashboardLeft from '../../pages/MDMApprover-Panel/dashboard-left/index';
import MDMApproverDashboardRight from '../../pages/MDMApprover-Panel/dashboard-right/index';
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

const MDMApproverDash: React.FC<Props> = ({ children }) => {
    const [navOpen, setNavOpen] = React.useState(false);
    return (
        <div className="dashboard-wrapper agent-dashboard-wrapper" >
            <MDMApproverDashboardLeft  setNavOpen={setNavOpen} navOpen={navOpen}/>
            <DashboardHeader setNavOpen={setNavOpen} navOpen={navOpen} />
            <MDMApproverDashboardRight>{children && children}</MDMApproverDashboardRight>
            <DashboardFooter />
        </div>
    );
};

export default MDMApproverDash;

