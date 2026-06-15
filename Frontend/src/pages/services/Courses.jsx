import ServiceDetail from '../../components/ServiceDetail'
import { servicesData } from '../../data/servicesData'

export default function Courses() {
  const service = servicesData['courses']

  if (!service) return null

  return <ServiceDetail service={service} />
}
