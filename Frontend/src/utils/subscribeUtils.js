export function buildSubscribeParams(service, provider, providerName) {
  const params = new URLSearchParams()
  params.set('service', service)
  if (provider) params.set('provider', provider)
  if (providerName) params.set('providerName', encodeURIComponent(providerName))
  return params
}

export function handleSubscribe(navigate, isAuthenticated, { service, provider, providerName }) {
  const params = buildSubscribeParams(service, provider, providerName)
  const target = '/services/register'
  if (isAuthenticated) {
    navigate(`${target}?${params.toString()}`)
  } else {
    navigate(`/join?redirect=${target.slice(1)}&${params.toString()}`)
  }
}
