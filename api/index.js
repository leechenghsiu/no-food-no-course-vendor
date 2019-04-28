import axios from 'axios';

export default axios.create({
  baseURL: 'https://no-food-no-course-user-api.azurewebsites.net/'
});