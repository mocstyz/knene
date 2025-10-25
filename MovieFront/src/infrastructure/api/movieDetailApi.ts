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

  // 获取影片详情
  static async getMovieDetail(movieId: string): Promise<MovieDetail> {
    if (this.useMock) {
      // 使用 Mock 数据
      await new Promise(resolve => setTimeout(resolve, this.mockDelay))

      const mockData: MovieDetail = {
        id: movieId,
        title: 'Uncut Gems',
        type: 'Movie',
        year: 2019,
        imageUrl:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuDP3o5Q-52SV0tovTECoSdtE_jQ8MjAmKif6rwUE4hai4CvfNMgSVn3dLhY_6PvnLLb_4-UppvdXWdSjJYtjcacMJ9ojPhwaTNLtD3Muvp6hb848s8xncIEGtcstNhfLXq1sDX3BXHeA1aqsl0Kf3gB3pePZW9qkqA0IZ0c9Y8rLBsgMPz3xHNb69MaPnCmJEcmTFuy99OrAxWJEImCyOAV79BuaMkxgSGFmkn__PHiuuS_nGTxTvaT8P7cRfLSA-6X0ytu76LaBak',
        // 多平台评分
        rating: '6.3', // Douban评分（继承自MediaRatingItem，字符串格式）- 显示灰色（<7.0）
        doubanRating: '6.3', // Douban评分（明确命名）- 显示灰色（<7.0）
        ratingColor: 'purple',
        votes: 1500000,
        imdbRating: 9.2, // IMDb高分 - 显示红色（≥9.0）
        tmdbRating: 8.5, // TMDb优秀 - 显示紫色（≥8.0）
        description:
          'A charismatic New York City jeweler always on the lookout for the next big score makes a series of high-stakes bets that could lead to the windfall of a lifetime. He must perform a precarious high-wire act, balancing business, family, and encroaching adversaries on all sides in his relentless pursuit of the ultimate win.',
        cast: ['Adam Sandler', 'Julia Fox', 'Idina Menzel'],
        director: 'Safdie Brothers',
        country: 'USA',
        language: 'English',
        duration: 135,
        genres: ['Drama', 'Thriller', 'Crime'],
        quality: '1080p',
        isVip: true, // 设置为VIP内容
        thankYouCount: 1200,
        isFavorited: false,
        isThankYouActive: false,
        resource: {
          title:
            'Uncut Gems (2019) Criterion 1080p BluRay x265 10bit DDP Atmos 7.1 English',
          tags: [
            { label: '特效字幕', color: 'green' },
            { label: 'DIY', color: 'blue' },
            { label: '首发', color: 'green' },
            { label: '中字', color: 'yellow' },
            { label: '国配', color: 'purple' },
            { label: '高码', color: 'red' },
            { label: '合集', color: 'indigo' },
          ],
          stats: {
            views: 8700000,
            downloads: 200,
            likes: 24,
            dislikes: 0,
          },
          uploader: {
            name: 'mosctz',
            uploadTime: '18 hours ago',
          },
        },
        fileInfo: {
          format: 'MKV',
          size: '8.71 GiB',
          duration: '2h 15m',
          video: {
            codec: 'Main 10@L5@High',
            resolution: '1920x804',
            fps: '23.976 fps',
          },
          audio: {
            codec: 'E-AC-3 JOC',
            channels: '6 channels',
            sampleRate: '48.0 kHz',
          },
          subtitles: [
            { language: 'Chinese', isHighlighted: true },
            { language: 'Danish', isHighlighted: false },
            { language: 'Dutch', isHighlighted: false },
            { language: 'English', isHighlighted: false },
            { language: 'Finnish', isHighlighted: false },
            { language: 'French', isHighlighted: false },
            { language: 'German', isHighlighted: false },
            { language: 'Norwegian', isHighlighted: false },
            { language: 'Portuguese', isHighlighted: false },
            { language: 'Spanish', isHighlighted: false },
            { language: 'Swedish', isHighlighted: false },
            { language: 'Thai', isHighlighted: false },
          ],
          rawInfo: `General
Unique ID                                : 116435251082536248413025948031447276097 (0x57989D191901E9A3AC807613BC5D1A41)
Complete name                            : Uncut.Gems.2019.1080p.BluRay.x265.10bit.DDP.Atmos.7.1.mkv
Format                                   : Matroska
Format version                           : Version 4
File size                                : 8.71 GiB
Duration                                 : 2 h 15 min
Overall bit rate                         : 9 234 kb/s
Movie name                               : Uncut Gems (2019)
Encoded date                             : UTC 2024-01-15 08:30:22
Writing application                      : mkvmerge v70.0.0
Writing library                          : libebml v1.4.2 + libmatroska v1.6.4

Video
ID                                       : 1
Format                                   : HEVC
Format/Info                              : High Efficiency Video Coding
Format profile                           : Main 10@L5@High
Codec ID                                 : V_MPEGH/ISO/HEVC
Duration                                 : 2 h 15 min
Bit rate                                 : 7 845 kb/s
Width                                    : 1 920 pixels
Height                                   : 804 pixels
Display aspect ratio                     : 2.40:1
Frame rate mode                          : Constant
Frame rate                               : 23.976 FPS
Color space                              : YUV
Chroma subsampling                       : 4:2:0
Bit depth                                : 10 bits
Bits/(Pixel*Frame)                       : 0.212
Stream size                              : 6.21 GiB (71%)
Writing library                          : x265 3.5
Encoding settings                        : cpuid=1111039 / frame-threads=4 / wpp / pmode / pme / no-psnr / no-ssim / log-level=2

Audio
ID                                       : 2
Format                                   : E-AC-3 JOC
Format/Info                              : Enhanced AC-3 with Joint Object Coding
Commercial name                          : Dolby Digital Plus with Dolby Atmos
Codec ID                                 : A_EAC3
Duration                                 : 2 h 15 min
Bit rate mode                            : Constant
Bit rate                                 : 1 024 kb/s
Channel(s)                               : 6 channels
Channel layout                           : L R C LFE Ls Rs
Sampling rate                            : 48.0 kHz
Frame rate                               : 31.250 FPS (1536 SPF)
Compression mode                         : Lossy
Stream size                              : 987 MiB (11%)
Language                                 : English
Service kind                             : Complete Main
Default                                  : Yes
Forced                                   : No

Text #1
ID                                       : 3
Format                                   : UTF-8
Codec ID                                 : S_TEXT/UTF8
Codec ID/Info                            : UTF-8 Plain Text
Duration                                 : 2 h 10 min
Bit rate                                 : 45 b/s
Count of elements                        : 1847
Stream size                              : 70.8 KiB (0%)
Title                                    : 简体中文
Language                                 : Chinese
Default                                  : Yes
Forced                                   : No

Text #2
ID                                       : 4
Format                                   : UTF-8
Codec ID                                 : S_TEXT/UTF8
Codec ID/Info                            : UTF-8 Plain Text
Duration                                 : 2 h 10 min
Bit rate                                 : 47 b/s
Count of elements                        : 1847
Stream size                              : 73.2 KiB (0%)
Title                                    : English
Language                                 : English
Default                                  : No
Forced                                   : No`,
          rawInfoType: 'mediainfo',
        },
        screenshots: [
          {
            url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBX6qvZWkNcKikeJbkAp7YQgNhsR1BcQDIli2Hf7jKFzJHJ0_BLj-g8tRPar6-BlkAQbqDx3U1htrelvJdyUAzzr5oimgW04c6rXaRJkaM_nhvoNhBOjU6_RG4Vm8dLDnpQFEk-pLTpamnMISVGgLp-t56Gt41Pv_TMQ9qjxQBjqYAe8uYv898FESGMUfcFcfdojimgM9U_8hM5lof8JN4q9gfyXvYdtfXb6YV6sJfwoAW44dK9HMF4w48u6gtzsSlBZPqw-LJIIMQ',
            alt: 'Screenshot from the movie Uncut Gems',
          },
          {
            url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBO-qiKUfleSwZiDhdYZI34BG_bsDApfxh9okan-xDh3BLWH7nqoUOjO1sqEJjwLWB452VS98eyKHkgubk8g8KxEmzNkUjgJWlrJFg7CjaKX1NtX9HKLuEI1_DbdH8GR90W5Eu0XLo0pEErlXgmNuf1FuEe0bd-P21FjVjns1pJr2rtTloX-XHLGQCGJIeiaz8co79FuqnH7iBpwWD2H1HX7Tmo__r5wrnY_Imlhhp7iUb7s_WPVOMFNzAD8bneXlHzG9L0Iscyke0',
            alt: 'Screenshot from the movie Uncut Gems',
          },
          {
            url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDfbolD7-R8XArSBSItTGKpauVQ7eXj_pB_ycIStiaUC6otqbzaQ6ECCHvpVSjXp5lB6TJBacgVZUYfHc9lo2iftpSaIwoOdttfmDZCFPiQEWUPCVK5sBUqP4M8khYUUURKG_3l5bdMYDRQjaeaS34xc1kBuXXyBeWTLX6CgDEFGucBpa2nviI9JWosiVx100FrBKoZbXCieVdo_es2ypsET9LnIPCIm0iJuLzQG2dzYcI1ZiBAw4mOEqt9t-PCK_RXQJ124em5tUY',
            alt: 'Screenshot from the movie Uncut Gems',
          },
          {
            url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCl12ox6bBigD7JruU_uetzricohXQ70ARoMT_Nh_Q5JzYXU7ZxRfV9FVde-CZU8Yhy3b07zk4LxXMOyZzHbqRqaYQzHwlxPWcp6kplAr8yY5EJSV1z1DNb92-GIAshs951_kJEjgfvYT5sb6TsUH--9XfHHgChSjkxecv9h14Gol2M24Yv61fEYN7vXpCdL_igQMOEAg-vFwkjmOcxb7X-D7RhBzOE9THvgF2D5LukfFNOJuG2nCOBVGCa5jDvqnB_Jn-96vh8YyI',
            alt: 'Screenshot from the movie Uncut Gems',
          },
          {
            url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDfl89Jd23b0rgP3Fcyd384u4wf0ChE5_BzrVmDSvme16jd_llzBCI6nogfIJc_hsXutrh3O0W_msygu2yVvzTcTpUBxImPX5fFHNeaaL3iBVbflK1ibdok4QH229cchj68F8T1N7o9JP52a4kgeZ89CVBw28CF5W4z8Uhkuu1WVlucKvs-tTsU7iTDDM0N9VU7aMCOZtCi5Hr7bAriCwhOJ9Ed_DScohozWID8PZ567vcxZMtYgFMhww8DArhnrs6EylXlYUoDyRA',
            alt: 'Screenshot from the movie Uncut Gems',
          },
          {
            url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDLeupeZ-pu4BlYJJP_8gLkfwiuOikAWV2898FBcILMy_8SLa20oUVJc4-La17MEeCr8m52MB6PglIxnnZgEsmiwkq43Qm1jThzkW33rCQkW1khqWxOrrU99ntQtCJxRduLYzT1ZHXDDLuN9lUJ9EhcreALxrBDFDpyf-Ks3gyrzM-UM2GuvgvQkUlDRe4ncjwerr8euO-ayy2p53rA5ONUCZfsp99NTmKzQjwojPLZyLclQn-m7KC4LnJ7b0fqrGcfqb1D_ZTm2Tg',
            alt: 'Screenshot from the movie Uncut Gems',
          },
        ],
      }

      return mockData
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
