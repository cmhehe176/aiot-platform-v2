import type { ISidebar } from '@/component/Sidebar/type'

export const sidebars: ISidebar[] = [
  {
    label: 'Dashboard',
    key: 'dashboard',
    icon: 'house',
    items: [
      {
        label: 'Alert',
        name: 'alert',
        key: 'alert',
        icon: 'alert',
      },
      {
        label: 'Chart',
        name: 'chart',
        key: 'chart',
        icon: 'chart',
      },
      {
        label: 'Project Management',
        name: 'project',
        key: 'project',
        icon: 'project',
      },
    ],
  },
  {
    label: 'My Project',
    name: 'myproject',
    key: 'myproject',
    icon: 'myproject',
  },
  {
    label: 'Management Support',
    name: 'support',
    key: 'support',
    icon: 'letter',
    admin: true,
  },
  {
    label: 'Device',
    name: 'device',
    key: 'device',
    icon: 'device',
  },
]

const removeAdminItems = (sidebars: ISidebar[]): ISidebar[] => {
  return sidebars
    .filter((sidebar) => !sidebar.admin)
    .map((sidebar) => ({
      ...sidebar,
      items: sidebar.items ? removeAdminItems(sidebar.items) : undefined,
    }))
}

export const sidebarsForUser = removeAdminItems(sidebars)
