'use client'

import { Crown, Shield, ExternalLink } from 'lucide-react'
import { GuildMember, Guild } from '@/types'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface TeamMembersProps {
  members: GuildMember[]
  guild: Guild
  maxDisplay?: number
}

// X (Twitter) icon component
function XIcon({ className }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      className={className}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

export function TeamMembers({ members, guild, maxDisplay = 6 }: TeamMembersProps) {
  // Filter to show only admins and moderators
  const teamMembers = members.filter(m => m.role === 'admin' || m.role === 'moderator')
  const displayMembers = teamMembers.slice(0, maxDisplay)
  const remainingCount = teamMembers.length - maxDisplay

  const getRoleStyles = (role: GuildMember['role']) => {
    if (role === 'admin') {
      return {
        icon: <Crown className="h-3.5 w-3.5" />,
        label: 'Admin',
        color: guild.accentColor,
        bgColor: `${guild.accentColor}15`,
      }
    }
    if (role === 'moderator') {
      return {
        icon: <Shield className="h-3.5 w-3.5" />,
        label: 'Moderator',
        color: '#60a5fa',
        bgColor: '#60a5fa15',
      }
    }
    return null
  }

  if (teamMembers.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">
        Team Members
      </h3>
      
      <div className="flex flex-col gap-3">
        {displayMembers.map((member) => {
          const roleStyles = getRoleStyles(member.role)
          const twitterUrl = member.twitterHandle 
            ? `https://x.com/${member.twitterHandle}` 
            : null
          
          return (
            <div
              key={member.id}
              className="group flex items-center gap-4 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/50 hover:bg-zinc-900/80 hover:border-zinc-700/70 transition-all duration-300"
            >
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <Avatar className="h-12 w-12 ring-2 ring-zinc-800 group-hover:ring-zinc-700 transition-all">
                  <AvatarImage src={member.avatar} alt={member.username} />
                  <AvatarFallback className="bg-zinc-800 text-sm font-medium">
                    {member.username[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {member.isOnline && (
                  <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-zinc-900 shadow-lg shadow-emerald-500/30" />
                )}
              </div>
              
              {/* Name and Role */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-zinc-100 truncate group-hover:text-white transition-colors">
                  {member.username}
                </p>
                {roleStyles && (
                  <div 
                    className="inline-flex items-center gap-1.5 mt-1 px-2 py-0.5 rounded-full text-xs font-medium"
                    style={{ 
                      backgroundColor: roleStyles.bgColor,
                      color: roleStyles.color 
                    }}
                  >
                    {roleStyles.icon}
                    <span>{roleStyles.label}</span>
                  </div>
                )}
              </div>
              
              {/* X Link */}
              {twitterUrl && (
                <a
                  href={twitterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center h-9 w-9 rounded-lg bg-zinc-800/50 text-zinc-500 hover:bg-zinc-700 hover:text-white transition-all duration-200 group/x"
                  title={`@${member.twitterHandle}`}
                >
                  <XIcon className="h-4 w-4" />
                </a>
              )}
            </div>
          )
        })}
      </div>
      
      {remainingCount > 0 && (
        <button className="w-full py-2.5 text-sm text-zinc-500 hover:text-zinc-300 transition-colors rounded-lg hover:bg-zinc-800/30">
          +{remainingCount} more team member{remainingCount > 1 ? 's' : ''}
        </button>
      )}
    </div>
  )
}
