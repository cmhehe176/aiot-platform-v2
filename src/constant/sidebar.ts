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
    ],
  },
  {
    label: 'My Project',
    name: 'myproject',
    key: 'myproject',
    icon: 'myproject',
  },
  {
    label: 'Device',
    key: 'device',
    icon: 'device',
    items: [
      {
        label: 'Device',
        name: 'device',
        key: 'device',
        icon: 'device',
      },
      {
        label: 'Sub Device',
        name: 'sub-device',
        key: 'sub-device',
        icon: 'project',
      },
    ],
  },

  {
    label: 'Management Support',
    name: 'support',
    key: 'support',
    icon: 'letter',
    admin: true,
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
