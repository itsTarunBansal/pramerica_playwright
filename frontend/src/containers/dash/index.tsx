import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CheckRoles from './checkRoles';
import ModulePermissionRouter from './ModulePermissionRouter';
import { checkUser } from '../../features/auth/authActions';
import { AppDispatch, RootState } from '../../redux/store';
 
interface Props {
  path: string;
  query: string;
}
 
const Dash: React.FC<Props> = ({ path, query }) => {
  const dispatch = useDispatch<AppDispatch>();
 
  // Fetch user details from Redux state
  const { user, loading, error } = useSelector(
    (state: RootState) => state.auth,
  );
 
  useEffect(() => {
    dispatch(checkUser());
  }, [dispatch]);
 
  console.log(user, '=====> user');
 
  if (loading) {
    return <div>Loading...</div>; // Show a loading state while checking the user
  }
 
  if (error) {
    return <div>Error: {error}</div>; // Handle any errors in the state
  }
console.log(user, 'user userRole check')
  return (
    <div>
      {user && user.userRole === 'SashaktUser' ? (
        <ModulePermissionRouter path={path} query={query} />
      ) : user && user.userRole ? (
        <CheckRoles role={user.userRole} path={path} query={query} />
      ) : (
        <div style={{ width: '32px', height: '32px' }}>
          No user found
        </div>
      )}
    </div>
  );
};
 
export default Dash;