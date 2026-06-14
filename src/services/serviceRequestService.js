import api from "../api/axios"

export const submitServiceRequest = async (data) => {
  const response = await api.post("/service-requests", data)
  return response.data
}
