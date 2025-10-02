import React from 'react'
import { useCurrentUser } from '@/application/hooks'
import { Button, Icon } from '@/components/atoms'
import { UserProfile } from '@/components/molecules'
import { UserTemplate } from '@/components/templates'

const ProfilePage: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">个人资料</h1>
      <p className="text-gray-600">个人资料页面组件 - 待实现</p>
    </div>
  )
}

export default ProfilePage