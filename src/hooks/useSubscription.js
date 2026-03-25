import { useCallback, useEffect, useState } from 'react'
import { getSubscription } from '../lib/supabase'

export function useSubscription(userId) {
  const [subscription, setSubscription] = useState(null)
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState(null)

  const fetch = useCallback(async () => {
    if (!userId) { setLoading(false); return }
    try {
      setLoading(true)
      const data = await getSubscription(userId)
      setSubscription(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => { fetch() }, [fetch])

  const isActive = subscription?.status === 'active'
  const daysLeft = subscription?.end_date
    ? Math.max(0, Math.ceil((new Date(subscription.end_date) - Date.now()) / 86400000))
    : 0

  return { subscription, loading, error, refetch: fetch, isActive, daysLeft }
}
