const ServiceRequest = require('../models/ServiceRequest')

const createServiceRequest = async (req, res, next) => {
  try {
    const { name, phone, email, address, service_id, service_name, provider_id, provider_name, notes } = req.body

    if (!name || !phone || !email || !address || !service_id || !service_name) {
      res.status(400)
      throw new Error('All required fields must be provided')
    }

    if (phone.length > 11) {
      res.status(400)
      throw new Error('Phone number must not exceed 11 digits')
    }

    const serviceRequest = await ServiceRequest.create({
      name, phone, email, address, service_id, service_name,
      provider_id: provider_id || null,
      provider_name: provider_name || null,
      notes: notes || '',
    })

    res.status(201).json({ success: true, data: serviceRequest })
  } catch (error) {
    next(error)
  }
}

const getServiceRequests = async (req, res, next) => {
  try {
    const requests = await ServiceRequest.find().sort('-createdAt')
    res.json({ success: true, data: requests })
  } catch (error) {
    next(error)
  }
}

const getServiceRequestById = async (req, res, next) => {
  try {
    const request = await ServiceRequest.findById(req.params.id)
    if (!request) {
      res.status(404)
      throw new Error('Service request not found')
    }
    res.json({ success: true, data: request })
  } catch (error) {
    next(error)
  }
}

const updateServiceRequestStatus = async (req, res, next) => {
  try {
    const { status } = req.body
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      res.status(400)
      throw new Error('Invalid status value')
    }
    const request = await ServiceRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    )
    if (!request) {
      res.status(404)
      throw new Error('Service request not found')
    }
    res.json({ success: true, data: request })
  } catch (error) {
    next(error)
  }
}

module.exports = { createServiceRequest, getServiceRequests, getServiceRequestById, updateServiceRequestStatus }
