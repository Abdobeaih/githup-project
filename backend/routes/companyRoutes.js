const express = require('express')
const router = express.Router()
const { getCompanies, getCompany, createCompany, updateCompany, deleteCompany, approveCompany, rejectCompany, getCompanyStats, getBranches, createBranch, updateBranch, deleteBranch } = require('../controllers/companyController')
const { protect, adminOnly, companyOnly } = require('../middleware/authMiddleware')

router.route('/').get(protect, getCompanies).post(protect, adminOnly, createCompany)
router.get('/stats', protect, adminOnly, getCompanyStats)
router.put('/:id/approve', protect, adminOnly, approveCompany)
router.put('/:id/reject', protect, adminOnly, rejectCompany)
router.route('/:id').get(protect, getCompany).put(protect, updateCompany).delete(protect, adminOnly, deleteCompany)

// Company branches nested
router.get('/:companyId/branches', protect, getBranches)
router.post('/:companyId/branches', protect, companyOnly, createBranch)
router.put('/:companyId/branches/:branchId', protect, updateBranch)
router.delete('/:companyId/branches/:branchId', protect, deleteBranch)

module.exports = router
