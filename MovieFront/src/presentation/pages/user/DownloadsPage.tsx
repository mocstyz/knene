import React from 'react'
import { useDownloads } from '@/application/hooks'
import { Button, Icon } from '@/components/atoms'
import { DownloadProgress } from '@/components/molecules'
import { UserTemplate } from '@/components/templates'

const DownloadsPage: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">我的下载</h1>
      <p className="text-gray-600">我的下载页面组件 - 待实现</p>
    </div>
  )
}

export default DownloadsPage