import { authService } from '@/service/auth'
import { useAuthStore } from '@/stores/auth'

export const useAuth = () => {
  const { setProfile } = useAuthStore()

  const fetchApiProfile = async () => {
    const response = await authService.getProfile()

    if (response.profile) setProfile(response.profile)

    return response
  }

  return {
    fetchApiProfile,
  }
}
