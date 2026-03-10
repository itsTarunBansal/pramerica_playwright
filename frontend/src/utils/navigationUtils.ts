import SecureStorage from './SecureStorage';

export interface NavigationItem {
  id: string;
  name: string;
  path: string;
  icon: React.ReactNode;
  permission: string;
  children?: NavigationItem[];
  order?: number;
}

export const getOrderedNavigationItems = (navigationItems: NavigationItem[]): NavigationItem[] => {
  const user: any = SecureStorage.getItem('user');
  const modulePermissions = user?.modulePermissions || [];

  // Create a map of module names to their order
  const moduleOrderMap = new Map<string, number>();
  modulePermissions.forEach((mp: any, index: number) => {
    const moduleName = mp.moduleId?.name;
    if (moduleName) {
      moduleOrderMap.set(moduleName, index);
    }
  });

  // Filter and sort navigation items based on module permission order
  const filteredItems = navigationItems.filter(item => {
    // For items with children, check if any child has permission
    if (item.children && item.children.length > 0) {
      return item.children.some(child => 
        modulePermissions.some((mp: any) => 
          mp.moduleId?.name === child.permission && mp.permissions?.includes('read')
        )
      );
    }
    
    // For regular items, check if user has permission
    return modulePermissions.some((mp: any) => 
      mp.moduleId?.name === item.permission && mp.permissions?.includes('read')
    );
  });

  // Sort items based on the earliest permission order found
  const sortedItems = filteredItems.sort((a, b) => {
    const getEarliestOrder = (item: NavigationItem) => {
      if (item.children && item.children.length > 0) {
        // For parent items, find the earliest order among children
        const childOrders = item.children
          .map(child => moduleOrderMap.get(child.permission))
          .filter(order => order !== undefined) as number[];
        return childOrders.length > 0 ? Math.min(...childOrders) : 999;
      }
      return moduleOrderMap.get(item.permission) ?? 999;
    };

    const orderA = getEarliestOrder(a);
    const orderB = getEarliestOrder(b);
    return orderA - orderB;
  });

  return sortedItems;
};

export const hasModulePermission = (moduleName: string, permission: string = 'read'): boolean => {
  const user: any = SecureStorage.getItem('user');
  const modulePermissions = user?.modulePermissions || [];
  
  return modulePermissions.some((mp: any) => 
    mp.moduleId?.name === moduleName && mp.permissions?.includes(permission)
  );
};