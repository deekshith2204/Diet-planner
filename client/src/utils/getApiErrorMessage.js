export default function getApiErrorMessage(error, fallbackMessage) {
  if (!error.response) {
    return 'Cannot connect to the NutriAI API. Please wait a few seconds and try again.'
  }

  return error.response.data?.message || fallbackMessage
}
