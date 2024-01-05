import axios from 'axios'
const BASE_URL = import.meta.env.VITE_APP_BASE_URL

export const GetData = async (url, token) => {
  try {
    const { data } = await axios.get(`${BASE_URL}/${url}`, {
      headers: {
        Authorization: ` Bearer ${token}`,
      },
    })
    return data
  } catch (error) {
    console.log(error)
  }
}

export const postData = async (url, post, token) => {
  try {
    const { data } = await axios.post(`${BASE_URL}/${url}`, post, {
      headers: {
        Authorization: ` Bearer ${token}`,
      },
    })
    return data
  } catch (error) {
    const { data } = error.response
    console.log(data)
    return data
  }
}
export const PatchData = async (url, patch, token) => {
  try {
    const { data } = await axios.patch(`${BASE_URL}/${url}`, patch, {
      headers: {
        Authorization: ` Bearer ${token}`,
      },
    })
    return data
  } catch (error) {
    const { data } = error.response
    return data
  }
}
export const putData = async (url, put, token) => {
  try {
    const { data } = await axios.put(`${BASE_URL}/${url}`, put, {
      headers: {
        Authorization: ` Bearer ${token}`,
      },
    })
    return data
  } catch (error) {
    const { data } = error.response
    return data
  }
}

export const deleteData = async (url, token) => {
  try {
    const { data } = await axios.delete(`${BASE_URL}/${url}`, {
      headers: {
        Authorization: ` Bearer ${token}`,
      },
    })
    return data
  } catch (error) {
    const { data } = error.response
  }
}
