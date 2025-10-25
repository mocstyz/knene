/**
 * @fileoverview 写真详情API服务
 * @description 提供写真详情页面所需的所有API调用
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import type { PhotoDetail } from '@/types/photo.types'

// 写真详情API服务类
export class PhotoDetailApiService {
  // 检查是否使用 Mock 数据
  private static get useMock(): boolean {
    return import.meta.env.VITE_ENABLE_MOCK === 'true'
  }

  // 获取 Mock 延迟时间
  private static get mockDelay(): number {
    return parseInt(import.meta.env.VITE_MOCK_DELAY || '300', 10)
  }

  // 获取写真详情
  static async getPhotoDetail(photoId: string): Promise<PhotoDetail> {
    if (this.useMock) {
      // 使用 Mock 数据
      await new Promise(resolve => setTimeout(resolve, this.mockDelay))

      const mockData: PhotoDetail = {
        id: photoId,
        title: 'Beautiful Sunset Photography Collection',
        type: 'Photo',
        year: 2024,
        imageUrl:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuDP3o5Q-52SV0tovTECoSdtE_jQ8MjAmKif6rwUE4hai4CvfNMgSVn3dLhY_6PvnLLb_4-UppvdXWdSjJYtjcacMJ9ojPhwaTNLtD3Muvp6hb848s8xncIEGtcstNhfLXq1sDX3BXHeA1aqsl0Kf3gB3pePZW9qkqA0IZ0c9Y8rLBsgMPz3xHNb69MaPnCmJEcmTFuy99OrAxWJEImCyOAV79BuaMkxgSGFmkn__PHiuuS_nGTxTvaT8P7cRfLSA-6X0ytu76LaBak',
        thankYouCount: 856,
        isFavorited: false,
        isThankYouActive: false,
        isVip: true, // 设置为VIP内容
        resource: {
          title: 'Beautiful Sunset Photography Collection 2024 4K HDR',
          tags: [
            { label: '高清', color: 'green' },
            { label: '4K', color: 'red' },
            { label: 'HDR', color: 'purple' },
            { label: '精选', color: 'blue' },
          ],
          stats: {
            views: 5200000,
            downloads: 1580,
            likes: 342,
            dislikes: 8,
          },
          uploader: {
            name: 'PhotoMaster',
            uploadTime: '3 days ago',
          },
        },
        screenshots: [
          {
            url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBX6qvZWkNcKikeJbkAp7YQgNhsR1BcQDIli2Hf7jKFzJHJ0_BLj-g8tRPar6-BlkAQbqDx3U1htrelvJdyUAzzr5oimgW04c6rXaRJkaM_nhvoNhBOjU6_RG4Vm8dLDnpQFEk-pLTpamnMISVGgLp-t56Gt41Pv_TMQ9qjxQBjqYAe8uYv898FESGMUfcFcfdojimgM9U_8hM5lof8JN4q9gfyXvYdtfXb6YV6sJfwoAW44dK9HMF4w48u6gtzsSlBZPqw-LJIIMQ',
            alt: 'Sunset photo 1',
          },
          {
            url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBO-qiKUfleSwZiDhdYZI34BG_bsDApfxh9okan-xDh3BLWH7nqoUOjO1sqEJjwLWB452VS98eyKHkgubk8g8KxEmzNkUjgJWlrJFg7CjaKX1NtX9HKLuEI1_DbdH8GR90W5Eu0XLo0pEErlXgmNuf1FuEe0bd-P21FjVjns1pJr2rtTloX-XHLGQCGJIeiaz8co79FuqnH7iBpwWD2H1HX7Tmo__r5wrnY_Imlhhp7iUb7s_WPVOMFNzAD8bneXlHzG9L0Iscyke0',
            alt: 'Sunset photo 2',
          },
          {
            url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDfbolD7-R8XArSBSItTGKpauVQ7eXj_pB_ycIStiaUC6otqbzaQ6ECCHvpVSjXp5lB6TJBacgVZUYfHc9lo2iftpSaIwoOdttfmDZCFPiQEWUPCVK5sBUqP4M8khYUUURKG_3l5bdMYDRQjaeaS34xc1kBuXXyBeWTLX6CgDEFGucBpa2nviI9JWosiVx100FrBKoZbXCieVdo_es2ypsET9LnIPCIm0iJuLzQG2dzYcI1ZiBAw4mOEqt9t-PCK_RXQJ124em5tUY',
            alt: 'Sunset photo 3',
          },
          {
            url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCl12ox6bBigD7JruU_uetzricohXQ70ARoMT_Nh_Q5JzYXU7ZxRfV9FVde-CZU8Yhy3b07zk4LxXMOyZzHbqRqaYQzHwlxPWcp6kplAr8yY5EJSV1z1DNb92-GIAshs951_kJEjgfvYT5sb6TsUH--9XfHHgChSjkxecv9h14Gol2M24Yv61fEYN7vXpCdL_igQMOEAg-vFwkjmOcxb7X-D7RhBzOE9THvgF2D5LukfFNOJuG2nCOBVGCa5jDvqnB_Jn-96vh8YyI',
            alt: 'Sunset photo 4',
          },
          {
            url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDfl89Jd23b0rgP3Fcyd384u4wf0ChE5_BzrVmDSvme16jd_llzBCI6nogfIJc_hsXutrh3O0W_msygu2yVvzTcTpUBxImPX5fFHNeaaL3iBVbflK1ibdok4QH229cchj68F8T1N7o9JP52a4kgeZ89CVBw28CF5W4z8Uhkuu1WVlucKvs-tTsU7iTDDM0N9VU7aMCOZtCi5Hr7bAriCwhOJ9Ed_DScohozWID8PZ567vcxZMtYgFMhww8DArhnrs6EylXlYUoDyRA',
            alt: 'Sunset photo 5',
          },
          {
            url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDLeupeZ-pu4BlYJJP_8gLkfwiuOikAWV2898FBcILMy_8SLa20oUVJc4-La17MEeCr8m52MB6PglIxnnZgEsmiwkq43Qm1jThzkW33rCQkW1khqWxOrrU99ntQtCJxRduLYzT1ZHXDDLuN9lUJ9EhcreALxrBDFDpyf-Ks3gyrzM-UM2GuvgvQkUlDRe4ncjwerr8euO-ayy2p53rA5ONUCZfsp99NTmKzQjwojPLZyLclQn-m7KC4LnJ7b0fqrGcfqb1D_ZTm2Tg',
            alt: 'Sunset photo 6',
          },
        ],
      }

      return mockData
    } else {
      // 真实 API 调用
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/photos/${photoId}`
      )
      if (!response.ok) {
        throw new Error('Failed to fetch photo detail')
      }
      return await response.json()
    }
  }

  // 切换收藏状态
  static async toggleFavorite(
    photoId: string,
    currentState: boolean
  ): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 300))
    // 模拟API调用，返回切换后的状态
    return !currentState
  }

  // 增加感谢计数
  static async incrementThankYou(photoId: string): Promise<number> {
    await new Promise(resolve => setTimeout(resolve, 300))
    return 857
  }
}

export const photoDetailApi = PhotoDetailApiService
