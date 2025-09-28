import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PostForm } from '@/components/posts/post-form'

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

describe('PostForm', () => {
  const mockOnPostCreated = jest.fn()
  const defaultProps = {
    targetAge: 25,
    onPostCreated: mockOnPostCreated,
  }

  beforeEach(() => {
    useAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
    })

    global.fetch = jest.fn()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders form elements correctly', () => {
    render(<PostForm {...defaultProps} />)
    
    expect(screen.getByPlaceholderText('嗨 25岁，')).toBeInTheDocument()
    expect(screen.getByText('您的当前年龄')).toBeInTheDocument()
    expect(screen.getByText('选择您的年龄')).toBeInTheDocument()
    expect(screen.getByText('匿名发布')).toBeInTheDocument()
    expect(screen.getByText('登录后发布')).toBeInTheDocument()
  })

  it('shows character count correctly', async () => {
    const user = userEvent.setup()
    render(<PostForm {...defaultProps} />)
    
    const textarea = screen.getByPlaceholderText('嗨 25岁，')
    await user.type(textarea, '这是测试内容')
    
    expect(screen.getByText('6/500')).toBeInTheDocument()
  })

  it('disables submit when content is empty', () => {
    render(<PostForm {...defaultProps} />)
    
    const anonymousButton = screen.getByText('匿名发布')
    expect(anonymousButton).toBeDisabled()
  })

  it('enables submit when content is provided and age is selected', async () => {
    const user = userEvent.setup()
    const { container } = render(<PostForm {...defaultProps} />)

    const textarea = screen.getByPlaceholderText('嗨 25岁，')
    await user.type(textarea, '这是测试内容')

    // Select age by using the hidden select element
    const hiddenSelect = container.querySelector('select[aria-hidden="true"]')
    fireEvent.change(hiddenSelect!, { target: { value: '30' } })

    const anonymousButton = screen.getByText('匿名发布')
    expect(anonymousButton).not.toBeDisabled()
  })

  it('validates content length', async () => {
    render(<PostForm {...defaultProps} />)

    const textarea = screen.getByPlaceholderText('嗨 25岁，')
    const longContent = 'A'.repeat(501) // Exceeds 500 character limit

    // Directly set the value to avoid slow typing
    fireEvent.change(textarea, { target: { value: longContent } })

    expect(screen.getByText('501/500')).toBeInTheDocument()

    const anonymousButton = screen.getByText('匿名发布')
    expect(anonymousButton).toBeDisabled()
  })

  it('handles anonymous submission correctly', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    })

    const user = userEvent.setup()
    const { container } = render(<PostForm {...defaultProps} />)

    const textarea = screen.getByPlaceholderText('嗨 25岁，')
    await user.type(textarea, '这是测试内容')

    // Select age first
    const hiddenSelect = container.querySelector('select[aria-hidden="true"]')
    fireEvent.change(hiddenSelect!, { target: { value: '30' } })

    const anonymousButton = screen.getByText('匿名发布')
    fireEvent.click(anonymousButton)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target_age: 25,
          content: '这是测试内容',
          author_age: 30,
          user_id: null,
          username: null,
        }),
      })
    })

    expect(mockOnPostCreated).toHaveBeenCalled()
  })

  it('handles authenticated submission correctly', async () => {
    // Mock authenticated user for this test
    useAuth.mockReturnValue({
      user: { id: 'user-123', username: 'testuser' },
      isAuthenticated: true,
    })

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    })

    const user = userEvent.setup()
    const { container } = render(<PostForm {...defaultProps} />)

    const textarea = screen.getByPlaceholderText('嗨 25岁，')
    await user.type(textarea, '这是测试内容')

    // Select author age
    const hiddenSelect = container.querySelector('select[aria-hidden="true"]')
    fireEvent.change(hiddenSelect!, { target: { value: '30' } })

    // For authenticated user, the button text should be '发布'
    const submitButton = screen.getByText('发布')
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target_age: 25,
          content: '这是测试内容',
          author_age: 30,
          user_id: 'user-123',
          username: 'testuser',
        }),
      })
    })

    expect(mockOnPostCreated).toHaveBeenCalled()
  })

  it('requires author age for authenticated submission', async () => {
    // Mock authenticated user for this test
    useAuth.mockReturnValue({
      user: { id: 'user-123', username: 'testuser' },
      isAuthenticated: true,
    })

    const user = userEvent.setup()
    render(<PostForm {...defaultProps} />)

    const textarea = screen.getByPlaceholderText('嗨 25岁，')
    await user.type(textarea, '这是测试内容')

    // For authenticated user, the button text should be '发布'
    const submitButton = screen.getByText('发布')
    expect(submitButton).toBeDisabled()
  })

  it('enables authenticated submission when author age is selected', async () => {
    // Mock authenticated user for this test
    useAuth.mockReturnValue({
      user: { id: 'user-123', username: 'testuser' },
      isAuthenticated: true,
    })

    const user = userEvent.setup()
    const { container } = render(<PostForm {...defaultProps} />)

    const textarea = screen.getByPlaceholderText('嗨 25岁，')
    await user.type(textarea, '这是测试内容')

    const hiddenSelect = container.querySelector('select[aria-hidden="true"]')
    fireEvent.change(hiddenSelect!, { target: { value: '30' } })

    // For authenticated user, the button text should be '发布'
    const submitButton = screen.getByText('发布')
    expect(submitButton).not.toBeDisabled()
  })

  it('handles submission error gracefully', async () => {
    ;(global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))

    const user = userEvent.setup()
    const { container } = render(<PostForm {...defaultProps} />)

    const textarea = screen.getByPlaceholderText('嗨 25岁，')
    await user.type(textarea, '这是测试内容')

    // Select age first
    const hiddenSelect = container.querySelector('select[aria-hidden="true"]')
    fireEvent.change(hiddenSelect!, { target: { value: '30' } })

    const anonymousButton = screen.getByText('匿名发布')
    fireEvent.click(anonymousButton)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled()
    })

    // Should not call onPostCreated on error
    expect(mockOnPostCreated).not.toHaveBeenCalled()
  })

  it('clears form after successful submission', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    })

    const user = userEvent.setup()
    const { container } = render(<PostForm {...defaultProps} />)

    const textarea = screen.getByPlaceholderText('嗨 25岁，')
    await user.type(textarea, '这是测试内容')

    // Select age first
    const hiddenSelect = container.querySelector('select[aria-hidden="true"]')
    fireEvent.change(hiddenSelect!, { target: { value: '30' } })

    const anonymousButton = screen.getByText('匿名发布')
    fireEvent.click(anonymousButton)

    await waitFor(() => {
      expect(mockOnPostCreated).toHaveBeenCalled()
    })

    // Form should be cleared
    expect(textarea).toHaveValue('')
    expect(screen.getByText('0/500')).toBeInTheDocument()
  })

  it('shows loading state during submission', async () => {
    ;(global.fetch as jest.Mock).mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve({
        ok: true,
        json: () => Promise.resolve({ success: true })
      }), 100))
    )

    const user = userEvent.setup()
    const { container } = render(<PostForm {...defaultProps} />)

    const textarea = screen.getByPlaceholderText('嗨 25岁，')
    await user.type(textarea, '这是测试内容')

    // Select age first
    const hiddenSelect = container.querySelector('select[aria-hidden="true"]')
    fireEvent.change(hiddenSelect!, { target: { value: '30' } })

    const anonymousButton = screen.getByText('匿名发布')
    fireEvent.click(anonymousButton)

    // Button should be disabled during submission
    expect(anonymousButton).toBeDisabled()
    // The "登录后发布" button should not be disabled as it's not the submit button
  })

  it('handles unauthenticated user correctly', () => {
    useAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
    })

    render(<PostForm {...defaultProps} />)
    
    // Should still show anonymous option
    expect(screen.getByText('匿名发布')).toBeInTheDocument()
    expect(screen.getByText('登录后发布')).toBeInTheDocument()
  })
})
