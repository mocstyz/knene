import { User } from '@domain/entities/User'

export interface UserRepository {
  create(user: User): Promise<User>
  findById(id: string): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
  findAll(filters?: {
    role?: string
    status?: string
    search?: string
  }): Promise<User[]>
  update(user: User): Promise<User>
  delete(id: string): Promise<boolean>
  updateProfile(userId: string, profile: Partial<User>): Promise<User>
  updatePreferences(
    userId: string,
    preferences: Record<string, any>
  ): Promise<User>
  getUserStats(userId: string): Promise<{
    downloadsCount: number
    favoritesCount: number
    messagesCount: number
  }>
}
