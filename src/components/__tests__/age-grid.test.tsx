import { render, screen, waitFor } from '@testing-library/react'
import { AgeGrid } from '@/components/age/age-grid'

// Mock the useAgeStats hook
jest.mock('@/hooks/use-age-stats', () => ({
  useAgeStats: jest.fn(),
}))

// Mock Next.js Link component
jest.mock('next/link', () => {
  return function MockLink({ children, href }: { children: React.ReactNode; href: string }) {
    return <a href={href}>{children}</a>
  }
})

// Mock AgeCard component
jest.mock('@/components/age/age-card', () => ({
  AgeCard: jest.fn(({ age, postCount, loading }) => (
    <div data-testid={`age-card-${age}`}>
      {loading ? 'Loading...' : `${age}岁 - ${postCount} 条消息`}
    </div>
  )),
}))

import { useAgeStats } from '@/hooks/use-age-stats'

describe('AgeGrid', () => {
  const mockAgeStats = [
    { target_age: 18, post_count: 5 },
    { target_age: 25, post_count: 10 },
    { target_age: 30, post_count: 8 },
    { target_age: 35, post_count: 3 },
    { target_age: 40, post_count: 7 },
    { target_age: 50, post_count: 2 },
  ]

  beforeEach(() => {
    useAgeStats.mockReturnValue({
      ageStats: mockAgeStats,
      loading: false,
      error: null,
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders featured ages when showAll is false', () => {
    render(<AgeGrid showAll={false} maxItems={6} />)
    
    // Should show featured ages (18, 25, 30, 35, 40, 50)
    expect(screen.getByTestId('age-card-18')).toBeInTheDocument()
    expect(screen.getByTestId('age-card-25')).toBeInTheDocument()
    expect(screen.getByTestId('age-card-30')).toBeInTheDocument()
    expect(screen.getByTestId('age-card-35')).toBeInTheDocument()
    expect(screen.getByTestId('age-card-40')).toBeInTheDocument()
    expect(screen.getByTestId('age-card-50')).toBeInTheDocument()
  })

  it('limits items when maxItems is specified', () => {
    render(<AgeGrid showAll={false} maxItems={3} />)
    
    // Should only show first 3 featured ages
    expect(screen.getByTestId('age-card-18')).toBeInTheDocument()
    expect(screen.getByTestId('age-card-25')).toBeInTheDocument()
    expect(screen.getByTestId('age-card-30')).toBeInTheDocument()
    expect(screen.queryByTestId('age-card-35')).not.toBeInTheDocument()
  })

  it('shows "查看所有年龄段" button when showAll is false', () => {
    render(<AgeGrid showAll={false} />)
    
    expect(screen.getByText('查看所有年龄段')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /查看所有年龄段/ })).toHaveAttribute('href', '/ages')
  })

  it('does not show "查看所有年龄段" button when showAll is true', () => {
    render(<AgeGrid showAll={true} />)
    
    expect(screen.queryByText('查看所有年龄段')).not.toBeInTheDocument()
  })

  it('renders loading state correctly', () => {
    useAgeStats.mockReturnValue({
      ageStats: [],
      loading: true,
      error: null,
    })

    render(<AgeGrid showAll={false} />)
    
    // Should show loading cards
    expect(screen.getAllByText('Loading...')).toHaveLength(6)
  })

  it('renders error state correctly', () => {
    useAgeStats.mockReturnValue({
      ageStats: [],
      loading: false,
      error: 'Failed to load data',
    })

    render(<AgeGrid showAll={false} />)
    
    expect(screen.getByText('数据加载失败: Failed to load data')).toBeInTheDocument()
    expect(screen.getByText('请刷新页面重试')).toBeInTheDocument()
  })

  it('passes correct post count to AgeCard components', () => {
    render(<AgeGrid showAll={false} />)
    
    expect(screen.getByText('18岁 - 5 条消息')).toBeInTheDocument()
    expect(screen.getByText('25岁 - 10 条消息')).toBeInTheDocument()
    expect(screen.getByText('30岁 - 8 条消息')).toBeInTheDocument()
  })

  it('handles missing age stats correctly', () => {
    useAgeStats.mockReturnValue({
      ageStats: [{ target_age: 18, post_count: 5 }], // Only one age has stats
      loading: false,
      error: null,
    })

    render(<AgeGrid showAll={false} />)
    
    // Ages without stats should show 0 count
    expect(screen.getByText('18岁 - 5 条消息')).toBeInTheDocument()
    expect(screen.getByText('25岁 - 0 条消息')).toBeInTheDocument()
  })

  it('applies correct grid classes', () => {
    const { container } = render(<AgeGrid showAll={false} />)
    
    const gridContainer = container.querySelector('.grid')
    expect(gridContainer).toHaveClass('gap-4')
  })

  it('memoizes correctly with same props', async () => {
    const { rerender } = render(<AgeGrid showAll={false} maxItems={6} />)
    
    await waitFor(() => {
      expect(screen.getByTestId('age-card-18')).toBeInTheDocument()
    })
    
    const firstRender = screen.getByTestId('age-card-18')
    
    // Re-render with same props
    rerender(<AgeGrid showAll={false} maxItems={6} />)
    
    const secondRender = screen.getByTestId('age-card-18')
    expect(firstRender).toBe(secondRender)
  })

  it('updates when props change', () => {
    const { rerender } = render(<AgeGrid showAll={false} maxItems={3} />)
    
    expect(screen.getAllByTestId(/age-card-/)).toHaveLength(3)
    
    // Change maxItems
    rerender(<AgeGrid showAll={false} maxItems={6} />)
    
    expect(screen.getAllByTestId(/age-card-/)).toHaveLength(6)
  })
})
