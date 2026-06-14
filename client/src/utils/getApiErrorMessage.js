export default function getApiErrorMessage(error, fallbackMessage) {
  if (!error.response) {
    return 'Cannot connect to the NutriAI API. Make sure the backend server is running on port 5000.'
  }

  return error.response.data?.message || fallbackMessage
}
