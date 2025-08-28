import { formatDistanceToNow } from 'date-fns'
import { Send, Trash2, User } from 'lucide-react'
import { Email } from '@/types/email'
import { clsx } from 'clsx'

interface EmailCardProps {
  email: Email
  isSelected: boolean
  onClick: () => void
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

export default function EmailCard({ email, isSelected, onClick, onSend, onDiscard }: EmailCardProps) {
  return (
    <div
      className={clsx(
        'p-4 hover:bg-gray-50 cursor-pointer transition-colors',
        isSelected && 'bg-blue-50 border-l-4 border-blue-500'
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-2">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-900 truncate">
                {email.sender}
              </span>
            </div>
            <span className="text-xs text-gray-500">
              {formatDistanceToNow(email.timestamp, { addSuffix: true })}
            </span>
          </div>
          
          <h3 className={clsx(
            'text-sm font-medium mb-1 truncate',
            !email.isRead && 'font-semibold'
          )}>
            {email.subject}
          </h3>
          
          <p className="text-sm text-gray-600 line-clamp-2 mb-2">
            {email.snippet}
          </p>
          
          <div className="flex items-center space-x-2">
            <span className={clsx(
              'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
              categoryColors[email.category]
            )}>
              {email.category}
            </span>
            {!email.isRead && (
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-1 ml-4">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onSend()
            }}
            className="p-1 text-green-600 hover:text-green-700 hover:bg-green-50 rounded"
            title="Send Reply"
          >
            <Send className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDiscard()
            }}
            className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded"
            title="Discard"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
