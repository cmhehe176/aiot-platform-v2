export interface ISidebar {
  label: string
  name?: string
  key: string
  icon: string
  items?: ISidebar[]
  admin?: boolean
}
