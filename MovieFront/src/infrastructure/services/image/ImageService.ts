/**
 * @fileoverview 图片服务抽象接口
 * @description 提供统一的图片服务接口，支持多环境配置和自动fallback。
 * 遵循配置化图片服务规范，禁止硬编码图片URL。
 *
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

/**
 * 图片服务配置选项
 */
export interface ImageServiceConfig {
  /** 服务提供商 */
  provider: 'picsum' | 'custom' | 'cloudinary'
  /** 基础URL */
  baseUrl: string
  /** 默认图片质量 */
  quality: number
  /** 默认图片格式 */
  format: 'webp' | 'jpg' | 'png' | 'auto'
  /** 是否启用裁剪 */
  enableCrop: boolean
}

/**
 * 图片生成选项
 */
export interface ImageOptions {
  /** 宽度 */
  width?: number
  /** 高度 */
  height?: number
  /** 图片质量 */
  quality?: number
  /** 图片格式 */
  format?: 'webp' | 'jpg' | 'png' | 'auto'
  /** 裁剪模式 */
  crop?: 'cover' | 'contain' | 'fill'
  /** 随机种子（用于一致性） */
  seed?: string
}

/**
 * 图片服务接口
 */
export interface IImageService {
  /**
   * 获取图片URL
   * @param seed 图片种子或ID
   * @param options 图片选项
   * @returns 图片URL
   */
  getUrl(seed: string, options?: ImageOptions): string

  /**
   * 获取优化后的图片URL
   * @param seed 图片种子或ID
   * @param options 图片选项
   * @returns 优化后的图片URL
   */
  getOptimizedUrl(seed: string, options?: ImageOptions): string

  /**
   * 获取占位符图片URL
   * @param width 宽度
   * @param height 高度
   * @returns 占位符图片URL
   */
  getPlaceholder(width?: number, height?: number): string

  /**
   * 生成响应式图片srcset
   * @param seed 图片种子或ID
   * @param options 图片选项
   * @param sizes 断点配置
   * @returns srcset字符串
   */
  generateSrcSet(seed: string, options?: ImageOptions, sizes?: number[]): string
}

/**
 * 基础图片服务实现
 */
export abstract class BaseImageService implements IImageService {
  protected config: ImageServiceConfig

  constructor(config: ImageServiceConfig) {
    this.config = config
  }

  abstract getUrl(seed: string, options?: ImageOptions): string

  getOptimizedUrl(seed: string, options?: ImageOptions): string {
    const optimizedOptions: ImageOptions = {
      ...options,
      quality: options?.quality || this.config.quality,
      format: options?.format || this.config.format,
    }

    return this.getUrl(seed, optimizedOptions)
  }

  getPlaceholder(width = 400, height = 300): string {
    return this.getUrl('placeholder', { width, height })
  }

  generateSrcSet(
    seed: string,
    options?: ImageOptions,
    sizes = [320, 640, 960, 1280]
  ): string {
    return sizes
      .map(size => {
        const scaledOptions: ImageOptions = {
          ...options,
          width: size,
          height: options?.height
            ? Math.round((options.height * size) / (options.width || size))
            : undefined,
        }
        return `${this.getUrl(seed, scaledOptions)} ${size}w`
      })
      .join(', ')
  }
}

/**
 * Picsum图片服务实现
 * 开发环境使用，支持seed一致性
 */
export class PicsumImageService extends BaseImageService {
  getUrl(seed: string, options?: ImageOptions): string {
    const width = options?.width || 400
    const height = options?.height || 300

    // Picsum API格式: https://picsum.photos/seed/{seed}/{width}/{height}
    const baseUrl = `${this.config.baseUrl}/${seed}/${width}/${height}`

    // 添加查询参数（如果需要的话）
    const params = new URLSearchParams()

    // 注意：Picsum支持一些查询参数，但主要的宽高参数是路径的一部分
    if (options?.quality && options.quality !== 80) {
      params.append('q', options.quality.toString())
    }

    if (options?.format && options.format !== 'auto') {
      params.append('format', options.format)
    }

    const queryString = params.toString()
    return queryString ? `${baseUrl}?${queryString}` : baseUrl
  }
}

/**
 * 自定义CDN图片服务实现
 * 生产环境使用，支持参数化URL
 */
export class CustomImageService extends BaseImageService {
  getUrl(seed: string, options?: ImageOptions): string {
    const params = new URLSearchParams()

    // 自定义服务的参数映射
    if (options?.width) params.append('width', options.width.toString())
    if (options?.height) params.append('height', options.height.toString())
    if (options?.quality) params.append('quality', options.quality.toString())
    if (options?.format && options.format !== 'auto')
      params.append('format', options.format)
    if (options?.crop && this.config.enableCrop)
      params.append('crop', options.crop)

    const queryString = params.toString()
    const baseUrl = `${this.config.baseUrl}/${seed}`
    return queryString ? `${baseUrl}?${queryString}` : baseUrl
  }
}

/**
 * Cloudinary图片服务实现
 * 可选的高级图片处理服务
 */
export class CloudinaryImageService extends BaseImageService {
  getUrl(seed: string, options?: ImageOptions): string {
    const transformations = []

    if (options?.width) transformations.push(`w_${options.width}`)
    if (options?.height) transformations.push(`h_${options.height}`)
    if (options?.quality) transformations.push(`q_${options.quality}`)
    if (options?.format && options.format !== 'auto')
      transformations.push(`f_${options.format}`)
    if (options?.crop && this.config.enableCrop)
      transformations.push(`c_${options.crop}`)

    const transformationString =
      transformations.length > 0 ? transformations.join(',') : 'auto'
    return `${this.config.baseUrl}/image/upload/${transformationString}/${seed}`
  }
}

/**
 * 图片服务工厂
 */
export class ImageServiceFactory {
  private static instance: IImageService

  /**
   * 获取图片服务实例
   * @returns 图片服务实例
   */
  static getInstance(): IImageService {
    if (!this.instance) {
      this.instance = this.createService()
    }
    return this.instance
  }

  /**
   * 根据环境创建图片服务
   * @returns 图片服务实例
   */
  private static createService(): IImageService {
    const isDevelopment = import.meta.env.DEV
    const isProduction = import.meta.env.PROD

    if (isDevelopment) {
      // 开发环境使用Picsum服务
      return new PicsumImageService({
        provider: 'picsum',
        baseUrl: 'https://picsum.photos/seed',
        quality: 80,
        format: 'auto',
        enableCrop: true,
      })
    }

    if (isProduction) {
      // 生产环境使用自定义CDN服务
      return new CustomImageService({
        provider: 'custom',
        baseUrl:
          import.meta.env.VITE_IMAGE_CDN_URL ||
          'https://cdn.example.com/images',
        quality: 85,
        format: 'auto',
        enableCrop: true,
      })
    }

    // 默认使用Picsum服务
    return new PicsumImageService({
      provider: 'picsum',
      baseUrl: 'https://picsum.photos/seed',
      quality: 80,
      format: 'auto',
      enableCrop: true,
    })
  }

  /**
   * 重置服务实例（主要用于测试）
   */
  static resetInstance(): void {
    this.instance = null as any
  }
}
