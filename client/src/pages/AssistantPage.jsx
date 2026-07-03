import { Send } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import api from '../api/client'
import AppShell from '../components/AppShell'
import getApiErrorMessage from '../utils/getApiErrorMessage'

function AssistantPage() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        'Hi, I am NutriAI Assistant. Ask me about your meal plan, food logs, supplements, safer swaps, or symptoms to discuss with a doctor.',
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  async function sendMessage(event) {
    event.preventDefault()

    if (!input.trim()) return

    const question = input.trim()
    setMessages((current) => [...current, { role: 'user', content: question }])
    setInput('')
    setLoading(true)

    try {
      const { data } = await api.post('/assistant/ask', { message: question })
      setMessages((current) => [...current, { role: 'assistant', content: data.answer }])
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Assistant could not answer'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AppShell
      eyebrow="AI assistant"
      title="Clarify nutrition and meal questions"
      subtitle="Ask about meal planning, safer swaps, supplement cautions, and issues to raise with a doctor or dietitian."
      actions={<Link to="/dashboard" className="secondary-action">Dashboard</Link>}
    >
      <section className="panel mx-auto flex max-w-4xl flex-col rounded-lg">
        <div className="h-[60vh] space-y-4 overflow-y-auto p-5">
          {messages.map((message, index) => (
            <div key={`${message.role}-${index}`} className={message.role === 'user' ? 'ml-auto max-w-[80%]' : 'mr-auto max-w-[85%]'}>
              <div className={`rounded-lg p-4 text-sm leading-6 shadow-sm ${message.role === 'user' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700'}`}>
                {message.content}
              </div>
            </div>
          ))}
          {loading && <p className="text-sm text-slate-500">Assistant is thinking...</p>}
        </div>

        <form className="flex gap-3 border-t border-slate-200 p-5" onSubmit={sendMessage}>
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Ask about meals, conditions, supplements, or healthier swaps..."
            className="min-w-0 flex-1 rounded-md border border-slate-300 px-3 py-2.5 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
          />
          <button className="primary-action">
            <Send size={16} />
            Send
          </button>
        </form>
      </section>
    </AppShell>
  )
}

export default AssistantPage
