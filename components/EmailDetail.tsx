import { formatDistanceToNow } from 'date-fns'
import { Send, Trash2, User, Clock, Tag } from 'lucide-react'
import { Email } from '@/types/email'

interface EmailDetailProps {
  email: Email
  onSend: () => void
  onDiscard: () => void
}

const categoryColors = {
  'Invoice/Payment': 'bg-red-100 text-red-800',
  'Meeting': 'bg-blue-100 text-blue-800',
  'Lead': 'bg-green-100 text-green-800',
  'Recruitment': 'bg-purple-100 text-purple-800',
  'Customer Support': 'bg-orange-100 text-orange-800',
  'Internal': 'bg-gray-100 text-gray-800',
  'General': 'bg-yellow-100 text-yellow-800',
  'Other': 'bg-gray-100 text-gray-800',
}

export default function EmailDetail({ email, onSend, onDiscard }: EmailDetailProps) {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Email Details</h2>
          <span className={`
            inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
            ${categoryColors[email.category]}
          `}>
            <Tag className="h-3 w-3 mr-1" />
            {email.category}
          </span>
        </div>

        {/* Email Info */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-900">{email.sender}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            <p className="text-sm text-gray-900 font-medium">{email.subject}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Received</label>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">
                {formatDistanceToNow(email.timestamp, { addSuffix: true })}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-sm text-gray-700 leading-relaxed">{email.snippet}</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">AI Draft Reply</label>
            <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
              <p className="text-sm text-gray-700 leading-relaxed">{email.draftReply}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-3 mt-6 pt-6 border-t border-gray-200">
          <button
            onClick={onSend}
            className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Send className="h-4 w-4" />
            <span>Send Reply</span>
          </button>
          <button
            onClick={onDiscard}
            className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            <span>Discard</span>
          </button>
        </div>
      </div>
    </div>
  )
}
