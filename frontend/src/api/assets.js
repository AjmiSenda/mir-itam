import api from './client'
export const getAssets = (params) => api.get('/assets/', { params })
export const getAsset = (id) => api.get(`/assets/${id}/`)
export const createAsset = (data) => api.post('/assets/', data)
export const updateAsset = (id, data) => api.patch(`/assets/${id}/`, data)
export const deleteAsset = (id) => api.delete(`/assets/${id}/`)
export const getAssetStats = () => api.get('/assets/stats/')
export const getCategories = () => api.get('/categories/')
export const getLocations = () => api.get('/locations/')
