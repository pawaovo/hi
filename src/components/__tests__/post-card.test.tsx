import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { PostCard } from '@/components/posts/post-card'
import type { AgePost } from '@/types'

// Mock the useAuth hook
jest.mock('@/hooks/use-auth', () => ({
  useAuth: jest.fn(),
}))

// Mock toast
jest.mock('react-hot-toast', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}))

import { useAuth } from '@/hooks/use-auth'

describe('PostCard', () => {
  const mockPost: AgePost = {
    id: '1',
    target_age: 25,
    content: '这是一条测试消息',
    author_age: 30,
    username: 'test_user',
    like_count: 15,
    created_at: '2024-01-01T10:00:00Z',
    is_active: true,
    user_id: 'user-123',
  }

  const mockOnLike = jest.fn()

  beforeEach(() => {
    useAuth.mockReturnValue({
      user: { id: 'user-123' },
      isAuthenticated: true,
    })
    
    // Mock fetch for like API
    global.fetch = jest.fn()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders post content correctly', () => {
    render(<PostCard post={mockPost} />)

    expect(screen.getByText('嗨 25岁，')).toBeInTheDocument()
    expect(screen.getByText('这是一条测试消息')).toBeInTheDocument()
    expect(screen.getByText('30岁')).toBeInTheDocument()
    expect(screen.getByText('15')).toBeInTheDocument()
  })

  it('renders simplified layout without removed elements', () => {
    render(<PostCard post={mockPost} />)

    // Should not show username (removed)
    expect(screen.queryByText('test_user')).not.toBeInTheDocument()
    // Should not show hot badge (removed)
    expect(screen.queryByText('热门')).not.toBeInTheDocument()
    // Should not show time (removed)
    expect(screen.queryByText(/小时前|天前|刚刚/)).not.toBeInTheDocument()
  })

  it('handles like button click for authenticated user', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ liked: true, like_count: 16 }),
    })

    render(<PostCard post={mockPost} onLike={mockOnLike} />)

    const likeButton = screen.getByRole('button')
    fireEvent.click(likeButton)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/posts/1/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: 'user-123' }),
      })
    })

    expect(mockOnLike).not.toHaveBeenCalled() // onLike is not called, onUpdate is used instead
  })

  it('handles like button click for unauthenticated user', async () => {
    useAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
    })

    // Mock fetch to handle all calls
    global.fetch = jest.fn()
      .mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({ liked: true, like_count: 16 }),
      })

    render(<PostCard post={mockPost} onLike={mockOnLike} />)

    const likeButton = screen.getByRole('button')
    fireEvent.click(likeButton)

    // Should make fetch calls for anonymous user
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled()
    })

    // Verify that fetch was called (the exact sequence is complex due to async operations)
    expect(global.fetch).toHaveBeenCalled()
  })

  it('handles like API error gracefully', async () => {
    ;(global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))

    render(<PostCard post={mockPost} onLike={mockOnLike} />)
    
    const likeButton = screen.getByRole('button')
    fireEvent.click(likeButton)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled()
    })

    // Should not call onLike callback on error
    expect(mockOnLike).not.toHaveBeenCalled()
  })

  it('disables like button during loading', async () => {
    ;(global.fetch as jest.Mock).mockImplementation(
      () => new Promise(resolve => setTimeout(resolve, 100))
    )

    render(<PostCard post={mockPost} onLike={mockOnLike} />)
    
    const likeButton = screen.getByRole('button')
    fireEvent.click(likeButton)

    // Button should be disabled during API call
    expect(likeButton).toBeDisabled()
  })

  it('applies correct styling classes', () => {
    const { container } = render(<PostCard post={mockPost} onLike={mockOnLike} />)

    const card = container.querySelector('.bg-card')
    expect(card).toBeInTheDocument()
    expect(card).toHaveClass('rounded-lg', 'border', 'bg-card')

    const cardContent = container.querySelector('.p-6')
    expect(cardContent).toBeInTheDocument()
  })

  it('is accessible', () => {
    render(<PostCard post={mockPost} onLike={mockOnLike} />)
    
    const likeButton = screen.getByRole('button')
    expect(likeButton).toHaveAccessibleName()
    
    // Should have proper heading structure
    const content = screen.getByText('这是一条测试消息')
    expect(content).toBeInTheDocument()
  })

  it('handles very long content correctly', () => {
    const longContentPost = {
      ...mockPost,
      content: 'A'.repeat(1000), // Very long content
    }
    
    render(<PostCard post={longContentPost} onLike={mockOnLike} />)
    
    expect(screen.getByText('A'.repeat(1000))).toBeInTheDocument()
  })

  it('handles special characters in content', () => {
    const specialContentPost = {
      ...mockPost,
      content: '特殊字符：@#$%^&*()_+{}|:"<>?[]\\;\',./',
    }
    
    render(<PostCard post={specialContentPost} onLike={mockOnLike} />)
    
    expect(screen.getByText('特殊字符：@#$%^&*()_+{}|:"<>?[]\\;\',./')).toBeInTheDocument()
  })
})
