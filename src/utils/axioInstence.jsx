import axios from 'axios';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL



const axioInstence = axios.create({
  baseURL:BACKEND_URL,
  withCredentials: true, 
})


axioInstence.interceptors.response.use(
  (response) => response, 
  async (error) => {
    const originalRequest = error.config;
    console.log('error form refrehsrequst',error);
    

    if (error.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true; 

      try {

        const refreshResponse = await axios.post(
          `${BACKEND_URL}/auth/refresh-token`,
          {}, // Pass any necessary payload
          { withCredentials: true }
        );

           console.log('frontend token',refreshResponse.data);
           
        const newAccessToken = refreshResponse.data.accessToken;
        console.log('newAccesstoken',newAccessToken);
        


        axioInstence.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;


        return axioInstence(originalRequest);
      } catch (refreshError) {
        console.error('Failed to refresh token:', refreshError);
        console.log('Error response:', error.response?.data || error.message);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error); 
  }
);

export default axioInstence;
