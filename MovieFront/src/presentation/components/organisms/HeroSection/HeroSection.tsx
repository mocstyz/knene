/**
 * @fileoverview 英雄区域轮播组件
 * @description 首页主要展示区域的轮播组件，支持自动轮播、手动切换、指示器导航等功能。
 * 使用所有heroes目录中的图片，提供流畅的视觉体验和用户交互。
 *
 * @author mosctz
 * @since 1.0.0
 * @version 1.1.0
 */

import { Icon } from '@components/atoms/Icon'
import { heroData } from '@data/home/heroData'
import React, { useState, useEffect } from 'react'

const HeroSection = React.forwardRef<HTMLElement>((_, ref) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentIndex(prevIndex => (prevIndex + 1) % heroData.length)
        setIsTransitioning(false)
      }, 50)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  // 使用当前索引获取英雄项
  const currentHero = heroData[currentIndex]

  const goToPrevious = () => {
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentIndex(
        prevIndex => (prevIndex - 1 + heroData.length) % heroData.length
      )
      setIsTransitioning(false)
    }, 50)
  }

  const goToNext = () => {
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % heroData.length)
      setIsTransitioning(false)
    }, 50)
  }

  const goToSlide = (index: number) => {
    if (index === currentIndex) return
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentIndex(index)
      setIsTransitioning(false)
    }, 50)
  }

  return (
    <section
      ref={ref}
      id="hero"
      className="relative -mt-16 flex h-[85vh] min-h-[600px] items-center"
    >
      <div className="absolute inset-0">
        <img
          alt={currentHero.title}
          className={`h-full w-full object-cover transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}
          src={currentHero.imageUrl}
        />
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-t from-background-light via-transparent to-transparent dark:from-background-dark"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-background-light via-background-light/50 to-transparent dark:from-background-dark dark:via-background-dark/50"></div>
        </div>
      </div>

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white md:text-5xl">
            {currentHero.title}
          </h1>
          <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">
            {currentHero.description}
          </p>
          <div className="mt-8 flex items-center space-x-4">
            <button className="flex items-center space-x-2 rounded-lg bg-[#6EE7B7] px-6 py-3 font-semibold text-black transition-colors hover:bg-opacity-80">
              <Icon name="play_arrow" />
              <span>Play</span>
            </button>
            <button className="flex items-center space-x-2 rounded-lg bg-gray-500/20 px-6 py-3 font-semibold text-gray-900 transition-colors hover:bg-gray-500/30 dark:bg-gray-400/20 dark:text-white dark:hover:bg-gray-400/30">
              <Icon name="info" />
              <span>More Info</span>
            </button>
          </div>
        </div>
      </div>

      {/* 左右切换按钮 */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm transition-all duration-300 group hover:scale-110 hover:bg-black/50"
        aria-label="Previous slide"
      >
        <Icon
          name="chevron_left"
          size="lg"
          className="text-2xl transition-transform duration-300 group-hover:-translate-x-0.5"
        />
      </button>

      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm transition-all duration-300 group hover:scale-110 hover:bg-black/50"
        aria-label="Next slide"
      >
        <Icon
          name="chevron_right"
          size="lg"
          className="text-2xl transition-transform duration-300 group-hover:translate-x-0.5"
        />
      </button>

      <div className="absolute bottom-8 right-8 flex space-x-2">
        {heroData.map((_, index) => (
          <span
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 cursor-pointer transition-all duration-300 ${
              index === currentIndex
                ? 'w-4 rounded-full bg-primary'
                : 'w-2 rounded-full bg-gray-400'
            }`}
          />
        ))}
      </div>
    </section>
  )
})

HeroSection.displayName = 'HeroSection'

export { HeroSection }
