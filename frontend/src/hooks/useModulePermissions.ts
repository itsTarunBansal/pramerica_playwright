import { useMemo } from 'react';
import SecureStorage from '../utils/SecureStorage';

export const useModulePermissions = () => {
  const user: any = SecureStorage.getItem('user');
  const modulePermissions = user?.modulePermissions || [];
  
  const hasPermission = useMemo(() => 
    function(moduleName: string, permission: string = 'read') {
      // Handle single parameter case (permission name only)
      if (arguments.length === 1) {
        return modulePermissions.some((mp: any) => 
          mp.moduleId?.name === moduleName
        );
      }
      // Handle two parameter case (module name and permission)
      return modulePermissions.some((mp: any) => 
        mp.moduleId?.name === moduleName && mp.permissions?.includes(permission)
      );
    }, [modulePermissions]
  );
  
  return { hasPermission, modulePermissions };
};
