import api from './client'
export const getTickets = (params) => api.get('/tickets/', { params })
export const getTicket = (id) => api.get(`/tickets/${id}/`)
export const createTicket = (data) => api.post('/tickets/', data)
export const updateTicket = (id, data) => api.patch(`/tickets/${id}/`, data)
export const deleteTicket = (id) => api.delete(`/tickets/${id}/`)
