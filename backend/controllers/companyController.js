const Company = require('../models/Company')
const CompanyBranch = require('../models/CompanyBranch')
const Discount = require('../models/Discount')
const APIFeatures = require('../utils/apiFeatures')

const getCompanies = async (req, res, next) => {
  try {
    const features = new APIFeatures(Company.find().lean(), req.query).filter().search(['name', 'email']).sort().paginate()
    const companies = await features.query
    const pagination = await features.count()
    res.json({ success: true, data: companies, ...pagination })
  } catch (error) { next(error) }
}

const getCompany = async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id).select('-password').lean()
    if (!company) { res.status(404); throw new Error('Company not found') }
    res.json({ success: true, data: company })
  } catch (error) { next(error) }
}

const createCompany = async (req, res, next) => {
  try {
    const company = await Company.create(req.body)
    res.status(201).json({ success: true, data: company })
  } catch (error) { next(error) }
}

const updateCompany = async (req, res, next) => {
  try {
    const company = await Company.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).select('-password')
    if (!company) { res.status(404); throw new Error('Company not found') }
    res.json({ success: true, data: company })
  } catch (error) { next(error) }
}

const deleteCompany = async (req, res, next) => {
  try {
    await Company.findByIdAndDelete(req.params.id)
    res.json({ success: true, message: 'Company deleted' })
  } catch (error) { next(error) }
}

const approveCompany = async (req, res, next) => {
  try {
    const company = await Company.findByIdAndUpdate(req.params.id, { status: 'approved', approved_at: new Date() }, { new: true })
    if (!company) { res.status(404); throw new Error('Company not found') }
    res.json({ success: true, data: company })
  } catch (error) { next(error) }
}

const rejectCompany = async (req, res, next) => {
  try {
    const company = await Company.findByIdAndUpdate(req.params.id, { status: 'rejected' }, { new: true })
    if (!company) { res.status(404); throw new Error('Company not found') }
    res.json({ success: true, data: company })
  } catch (error) { next(error) }
}

const getCompanyStats = async (req, res, next) => {
  try {
    const stats = await Company.aggregate([
      {
        $facet: {
          total: [{ $count: 'count' }],
          pending: [{ $match: { status: 'pending' } }, { $count: 'count' }],
          approved: [{ $match: { status: 'approved' } }, { $count: 'count' }],
        },
      },
      {
        $project: {
          total: { $arrayElemAt: ['$total.count', 0] },
          pending: { $arrayElemAt: ['$pending.count', 0] },
          approved: { $arrayElemAt: ['$approved.count', 0] },
        },
      },
    ])
    const data = stats[0] || { total: 0, pending: 0, approved: 0 }
    res.json({ success: true, data })
  } catch (error) { next(error) }
}

// Branches
const getBranches = async (req, res, next) => {
  try {
    const branches = await CompanyBranch.find({ company_id: req.params.companyId }).lean()
    res.json({ success: true, data: branches })
  } catch (error) { next(error) }
}

const createBranch = async (req, res, next) => {
  try {
    const branch = await CompanyBranch.create({ company_id: req.params.companyId, ...req.body })
    res.status(201).json({ success: true, data: branch })
  } catch (error) { next(error) }
}

const updateBranch = async (req, res, next) => {
  try {
    const branch = await CompanyBranch.findByIdAndUpdate(req.params.branchId, req.body, { new: true })
    if (!branch) { res.status(404); throw new Error('Branch not found') }
    res.json({ success: true, data: branch })
  } catch (error) { next(error) }
}

const deleteBranch = async (req, res, next) => {
  try {
    await CompanyBranch.findByIdAndDelete(req.params.branchId)
    res.json({ success: true, message: 'Branch deleted' })
  } catch (error) { next(error) }
}

module.exports = { getCompanies, getCompany, createCompany, updateCompany, deleteCompany, approveCompany, rejectCompany, getCompanyStats, getBranches, createBranch, updateBranch, deleteBranch }
