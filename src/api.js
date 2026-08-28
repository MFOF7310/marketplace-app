import { supabase } from './supabase.js'

// ── CLOUDINARY UPLOAD ──
export const uploadImage = async (file) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET)
  formData.append('folder', 'woko')
  const res = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: formData
  })
  const data = await res.json()
  return data.secure_url
}

// ── VENDORS ──
export const getVendors = async () => {
  const { data, error } = await supabase
    .from('vendors')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export const getVendorByUserId = async (userId) => {
  const { data, error } = await supabase
    .from('vendors')
    .select('*')
    .eq('user_id', userId)
    .single()
  if (error && error.code !== 'PGRST116') throw error
  return data
}

export const createVendor = async (vendor) => {
  const { data, error } = await supabase
    .from('vendors')
    .insert(vendor)
    .select()
    .single()
  if (error) throw error
  return data
}

export const updateVendor = async (id, updates) => {
  const { data, error } = await supabase
    .from('vendors')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

// ── PRODUCTS ──
export const getProducts = async (vendorId = null) => {
  let query = supabase.from('products').select('*, vendors(*)').eq('available', true)
  if (vendorId) query = query.eq('vendor_id', vendorId)
  const { data, error } = await query.order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export const createProduct = async (product) => {
  const { data, error } = await supabase
    .from('products')
    .insert(product)
    .select()
    .single()
  if (error) throw error
  return data
}

export const updateProduct = async (id, updates) => {
  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export const deleteProduct = async (id) => {
  const { error } = await supabase
    .from('products')
    .update({ available: false })
    .eq('id', id)
  if (error) throw error
}

// ── ORDERS ──
export const createOrder = async (order) => {
  const { data, error } = await supabase
    .from('orders')
    .insert(order)
    .select()
    .single()
  if (error) throw error
  return data
}

export const getOrdersByVendor = async (vendorId) => {
  const { data, error } = await supabase
    .from('orders')
    .select('*, products(*)')
    .eq('products.vendor_id', vendorId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export const updateOrderStatus = async (id, status) => {
  const { data, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

// ── APPOINTMENTS ──
export const createAppointment = async (appt) => {
  const { data, error } = await supabase
    .from('appointments')
    .insert(appt)
    .select()
    .single()
  if (error) throw error
  return data
}

export const getAppointmentsByVendor = async (vendorId) => {
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .eq('vendor_id', vendorId)
    .order('appointment_date', { ascending: true })
  if (error) throw error
  return data
}

// ── USER ROLES ──
export const getUserRole = async (userId) => {
  const { data, error } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId)
    .single()
  if (error && error.code !== 'PGRST116') throw error
  return data?.role || 'buyer'
}

export const setUserRole = async (userId, role) => {
  const { data, error } = await supabase
    .from('user_roles')
    .upsert({ user_id: userId, role }, { onConflict: 'user_id' })
    .select()
    .single()
  if (error) throw error
  return data
}

// ── VENDOR REQUESTS ──
export const submitVendorRequest = async (request) => {
  const { data, error } = await supabase
    .from('vendor_requests')
    .insert(request)
    .select()
    .single()
  if (error) throw error
  return data
}

export const getVendorRequests = async () => {
  const { data, error } = await supabase
    .from('vendor_requests')
    .select('*, auth.users(*)')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export const reviewVendorRequest = async (id, status, reviewerId) => {
  // First get the request data
  const { data: requestData, error: fetchError } = await supabase
    .from('vendor_requests')
    .select('*')
    .eq('id', id)
    .single()
  if (fetchError) throw fetchError

  // Update status
  const { data, error } = await supabase
    .from('vendor_requests')
    .update({ status, reviewed_by: reviewerId, reviewed_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error

  // Si approuvé, créer le vendor et mettre à jour le rôle
  if (status === 'approved') {
    // Check if vendor already exists
    const { data: existing } = await supabase
      .from('vendors')
      .select('id')
      .eq('user_id', requestData.user_id)
      .single()
    
    if (!existing) {
      await supabase.from('vendors').insert({
        user_id: requestData.user_id,
        name: requestData.shop_name,
        description: requestData.description,
        phone: requestData.phone,
        city: requestData.city,
        certified: true
      })
    }
    await setUserRole(requestData.user_id, 'vendor')
  }
  return data
}

// ── ADMIN ──
export const getAllUsers = async () => {
  const { data, error } = await supabase
    .from('user_roles')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export const getPendingRequests = async () => {
  const { data, error } = await supabase
    .from('vendor_requests')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}
