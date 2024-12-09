import { cloneDeep } from 'lodash'

export const resetStore = ({ store }: any) => {
  const initialState = cloneDeep(store.$state)
  store.$reset = () => {
    store.$patch(($state: any) => {
      Object.assign($state, initialState)
    })
  }
}
