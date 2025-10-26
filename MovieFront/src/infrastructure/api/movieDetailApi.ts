/**
 * @fileoverview 影片详情API服务
 * @description 提供影片详情页面所需的所有API调用，包括影片详情、评论、字幕下载源等功能
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import type {
  MovieDetail,
  Comment,
  SubtitleSource,
} from '@types-movie'

// 后端API方式：直接从数据源获取VIP状态，不进行前端计算
// VIP状态由后端API直接提供，前端只负责数据传递和展示

// 影片详情API服务类
export class MovieDetailApiService {
  // 检查是否使用 Mock 数据
  private static get useMock(): boolean {
    return import.meta.env.VITE_ENABLE_MOCK === 'true'
  }

  // 获取 Mock 延迟时间
  private static get mockDelay(): number {
    return parseInt(import.meta.env.VITE_MOCK_DELAY || '300', 10)
  }

// 注释：当有了真实后端API后，这里应该直接调用后端API
// 当前使用MockDataService模拟后端返回MovieDetail格式的数据
// VIP状态由后端API直接提供，前端只负责数据传递和展示
// 后端上线后，应该替换下面的getMovieDetail方法为真实的API调用

  // 获取影片详情
  static async getMovieDetail(movieId: string): Promise<MovieDetail> {
    if (this.useMock) {
      // 使用 Mock 数据 - 后端API方式：直接从MockDataService获取完整数据
      await new Promise(resolve => setTimeout(resolve, this.mockDelay))

      // 从MockDataService获取影片详情（模拟后端API返回）
      const { mockDataService } = await import('@application/services/MockDataService')
      const movieData = mockDataService.getMockMovieDetail(movieId)

      console.log('🎬 [movieDetailApi] 获取影片详情:', {
        movieId,
        isVip: movieData.isVip,
        source: 'MockDataService (模拟后端API)'
      })

      // 直接返回从MockDataService获取的完整数据
      return movieData
    } else {
      // 真实 API 调用
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/movies/${movieId}`
      )
      if (!response.ok) {
        throw new Error('Failed to fetch movie detail')
      }
      return await response.json()
    }
  }

  // 获取影片评论列表
  static async getMovieComments(movieId: string): Promise<Comment[]> {
    await new Promise(resolve => setTimeout(resolve, 400))

    const mockComments: Comment[] = [
      {
        id: 'comment_1',
        userId: 'user_1',
        userName: 'Sarah Connor',
        userAvatar:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuC8luGytBNoWitjazWn283Z1qteXg47JwTxpTk5piEfnLzqkRGM2GyNXTNpPAfT1qWRetHmJD1yoryS7qS8cg9gj2U7ywCmSkmrZuOgThuajLq-BSD61neNQzymfgxYyxHA57z8u_JC21q5XXbHRlqfQaIrCu5QORNFzBo2mXVkM2LsVr7Elc_DmMV7GVOphCxGqF4fu-oRKwVCQ4Mi8cZ8st6IGBrwSM49NnAPdXh3RXCFxpsybCGtUqChHEgp8QcrkG2sK5DgwNs',
        content:
          "This movie was a rollercoaster of emotions! Adam Sandler's performance was outstanding.",
        timestamp: '2 hours ago',
        likes: 15,
        dislikes: 3,
        replies: [
          {
            id: 'comment_1_1',
            userId: 'user_2',
            userName: 'John Doe',
            userAvatar:
              'https://lh3.googleusercontent.com/aida-public/AB6AXuBSoRyLsKigpnk57fBrbrZ53PILi3o0-6QtE-_koe4I2OSe0KtfwDyPq3TsGGSUvBuKau2rJ7dlkj_xQaDqE8bB4x4UXnYFWd8QY69rrxgfuAVz2DeEyXoDRHsfF_EWxl2yhVZC0ptQrqhbm8BxOB2z2aVIT8XYwcN5L0dEq-neXi6zBHMWs-K0opojDVDaYx-RYOP3kQ8AJeu0rt8gvMjDzRxsMimErOO11IqfYzFh-lawKQq1-ScTxoSylIvdDUaTr4d-4Bu1HSw',
            content:
              'Totally agree! I was on the edge of my seat the entire time.',
            timestamp: '1 hour ago',
            likes: 1,
            dislikes: 0,
          },
          {
            id: 'comment_1_2',
            userId: 'user_3',
            userName: 'Kyle Reese',
            userAvatar:
              'https://lh3.googleusercontent.com/aida-public/AB6AXuCBVnileFLGiJWFoNlduoDw5YBNCl74KWCVX4s4LzIumlZsBsJMKdDoMmCnCL8BbANp-MDOR398fXFqywHDPj9AK9GoSlR75cNDdCvm9-OpKX2-D8XvCFnFt8uQxGVe0g4_3utwSfOfIfzboMzPf-c7vD32mwO4QYNJ2o65BFuNjPGiMVjxFJa05LndHRD22_FBpEZaLe0VXDDbephFzRwHLq6sXDNXvFjkuCORP9EhIuD7jsflqBMXIFL-xmaCQemAbBuhulhqT7Q',
            content:
              'The Safdie brothers are masters of anxiety-inducing cinema.',
            timestamp: '30 minutes ago',
            likes: 2,
            dislikes: 0,
            replies: [
              {
                id: 'comment_1_2_1',
                userId: 'user_1',
                userName: 'Sarah Connor',
                userAvatar:
                  'https://lh3.googleusercontent.com/aida-public/AB6AXuC8luGytBNoWitjazWn283Z1qteXg47JwTxpTk5piEfnLzqkRGM2GyNXTNpPAfT1qWRetHmJD1yoryS7qS8cg9gj2U7ywCmSkmrZuOgThuajLq-BSD61neNQzymfgxYyxHA57z8u_JC21q5XXbHRlqfQaIrCu5QORNFzBo2mXVkM2LsVr7Elc_DmMV7GVOphCxGqF4fu-oRKwVCQ4Mi8cZ8st6IGBrwSM49NnAPdXh3RXCFxpsybCGtUqChHEgp8QcrkG2sK5DgwNs',
                content: "100%! Their style is unmistakable.",
                timestamp: '15 minutes ago',
                likes: 0,
                dislikes: 0,
              },
            ],
          },
        ],
      },
      {
        id: 'comment_2',
        userId: 'user_4',
        userName: 'T-800',
        userAvatar:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuBJWmnMd8HuPBGxLq5CLJc4MlNnySIbLTVuH5vVh8xyTgGmYT_qNxRrAopAyDj6mjfJS0Koz4PpIAu2uy_0OdmwQnSzB6dH3XyM3J5tqjPE1aSwtFh91msVIbzphZy366hhhiE6hKNcqYS8_90fck_bj3OCYdgvLpKqzHrpKKrrknvnqb0OFgbPHATwzRRT-lE0_FJxBqC5W7afwyx6hOC7Z56xIwDgIWtx9mPcBY_OwvO0kRqxnPJat5pRF57rEyfaQ5c8bftx2gk',
        content: 'The ending was... unexpected. Still processing it.',
        timestamp: '5 hours ago',
        likes: 22,
        dislikes: 5,
      },
    ]

    return mockComments
  }

  // 获取字幕下载源列表
  static async getSubtitleSources(): Promise<SubtitleSource[]> {
    await new Promise(resolve => setTimeout(resolve, 200))

    const mockSources: SubtitleSource[] = [
      {
        name: 'SubHD',
        description: '高质量字幕下载网站',
        url: 'https://subhd.tv',
      },
      {
        name: '字幕库 (Zimuku)',
        description: '射手网替代品，资源丰富',
        url: 'https://zimuku.org',
      },
      {
        name: 'OpenSubtitles',
        description: '全球最大的多语言字幕库',
        url: 'https://www.opensubtitles.org',
      },
      {
        name: '字幕天堂',
        description: '国内老牌字幕分享网站',
        url: 'https://www.zimutiantang.com',
      },
    ]

    return mockSources
  }

  // 提交评论
  static async submitComment(
    movieId: string,
    content: string
  ): Promise<Comment> {
    await new Promise(resolve => setTimeout(resolve, 500))

    const newComment: Comment = {
      id: `comment_${Date.now()}`,
      userId: 'current_user',
      userName: 'Current User',
      userAvatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDTEqR1YQqerF5AOEqMhsLZEhx7X3qpkwWHaFihPsgdANEIU9xlzXEidjxxUzTFmLfEBdnbJR9RPASUfRrxoNIDT56Me2T3FSY_AcdKAqTFVcIa56OBe8ihk50aoEsj2zY7gQX5Uh0fCSSPYjpgR6yYfGdzzghlqO9Q8lO_QTEbAyCcou5Pn6aqUdjiEqA0j5AQXac6GQXOWydrLISNhlsBy-5bLcLY9KJH2YflHryVQhIV7jVOQwF29_8Y0COBwiGK1MmUOkZQVUg',
      content,
      timestamp: 'Just now',
      likes: 0,
      dislikes: 0,
    }

    return newComment
  }

  // 提交回复
  static async submitReply(
    commentId: string,
    content: string
  ): Promise<Comment> {
    await new Promise(resolve => setTimeout(resolve, 500))

    const newReply: Comment = {
      id: `reply_${Date.now()}`,
      userId: 'current_user',
      userName: 'Current User',
      userAvatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDTEqR1YQqerF5AOEqMhsLZEhx7X3qpkwWHaFihPsgdANEIU9xlzXEidjxxUzTFmLfEBdnbJR9RPASUfRrxoNIDT56Me2T3FSY_AcdKAqTFVcIa56OBe8ihk50aoEsj2zY7gQX5Uh0fCSSPYjpgR6yYfGdzzghlqO9Q8lO_QTEbAyCcou5Pn6aqUdjiEqA0j5AQXac6GQXOWydrLISNhlsBy-5bLcLY9KJH2YflHryVQhIV7jVOQwF29_8Y0COBwiGK1MmUOkZQVUg',
      content,
      timestamp: 'Just now',
      likes: 0,
      dislikes: 0,
    }

    return newReply
  }

  // 切换收藏状态
  static async toggleFavorite(movieId: string, currentState: boolean): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 300))
    // 模拟API调用，返回切换后的状态
    return !currentState
  }

  // 增加感谢计数
  static async incrementThankYou(movieId: string): Promise<number> {
    await new Promise(resolve => setTimeout(resolve, 300))
    return 1201
  }

  // 点赞评论
  static async likeComment(commentId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 200))
  }

  // 点踩评论
  static async dislikeComment(commentId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 200))
  }
}

export const movieDetailApi = MovieDetailApiService