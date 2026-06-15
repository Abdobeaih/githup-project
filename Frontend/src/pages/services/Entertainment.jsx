import { useState, useEffect } from 'react'
import ServiceDetail from '../../components/ServiceDetail'
import LoadingSpinner from '../../components/LoadingSpinner'
import { servicesData } from '../../data/servicesData'
import { getAllEntertainmentVenues } from '../../data/db'

export default function Entertainment() {
  const [venues, setVenues] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const data = getAllEntertainmentVenues()
      setVenues(data || [])
    } catch {
      setVenues([])
    } finally {
      setLoading(false)
    }
  }, [])

  const service = servicesData['entertainment']

  if (!service) return null
  if (loading) return <LoadingSpinner />

  return <ServiceDetail service={service} venues={venues} />
}
