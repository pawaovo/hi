import { render, screen } from '@testing-library/react'
import { AgeCard } from '@/components/age/age-card'

// Mock Next.js Link component
jest.mock('next/link', () => {
  return function MockLink({ children, href }: { children: React.ReactNode; href: string }) {
    return <a href={href}>{children}</a>
  }
})

describe('AgeCard', () => {
  const defaultProps = {
    age: 25,
    postCount: 10,
    loading: false,
  }

  it('renders age and post count correctly', () => {
    render(<AgeCard {...defaultProps} />)
    
    expect(screen.getByText('25岁')).toBeInTheDocument()
    expect(screen.getByText('10 条消息')).toBeInTheDocument()
  })

  it('renders loading state correctly', () => {
    render(<AgeCard {...defaultProps} loading={true} />)
    
    // Should show skeleton loaders instead of content
    expect(screen.queryByText('25岁')).not.toBeInTheDocument()
    expect(screen.queryByText('10 条消息')).not.toBeInTheDocument()
  })

  it('renders zero post count correctly', () => {
    render(<AgeCard {...defaultProps} postCount={0} />)
    
    expect(screen.getByText('25岁')).toBeInTheDocument()
    expect(screen.getByText('暂无消息')).toBeInTheDocument()
  })

  it('renders single post count correctly', () => {
    render(<AgeCard {...defaultProps} postCount={1} />)
    
    expect(screen.getByText('25岁')).toBeInTheDocument()
    expect(screen.getByText('1 条消息')).toBeInTheDocument()
  })

  it('renders large post count correctly', () => {
    render(<AgeCard {...defaultProps} postCount={999} />)
    
    expect(screen.getByText('25岁')).toBeInTheDocument()
    expect(screen.getByText('999 条消息')).toBeInTheDocument()
  })

  it('has correct link href', () => {
    render(<AgeCard {...defaultProps} />)
    
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/age/25')
  })

  it('applies hover styles correctly', () => {
    render(<AgeCard {...defaultProps} />)

    const link = screen.getByRole('link')
    expect(link).toBeInTheDocument()

    // The hover styles are applied to the Card component inside the Link
    const cardElement = link.querySelector('.hover\\:shadow-md')
    expect(cardElement).toBeInTheDocument()
  })

  it('handles edge case ages correctly', () => {
    // Test minimum age
    const { rerender } = render(<AgeCard {...defaultProps} age={7} />)
    expect(screen.getByText('7岁')).toBeInTheDocument()
    
    // Test maximum age
    rerender(<AgeCard {...defaultProps} age={91} />)
    expect(screen.getByText('91岁')).toBeInTheDocument()
  })

  it('is accessible', () => {
    render(<AgeCard {...defaultProps} />)
    
    const link = screen.getByRole('link')
    expect(link).toBeInTheDocument()
    
    // Should have meaningful text content
    expect(link).toHaveTextContent('25岁')
    expect(link).toHaveTextContent('10 条消息')
  })

  it('memoizes correctly with same props', () => {
    const { rerender } = render(<AgeCard {...defaultProps} />)
    const firstRender = screen.getByText('25岁')
    
    // Re-render with same props
    rerender(<AgeCard {...defaultProps} />)
    const secondRender = screen.getByText('25岁')
    
    // Component should be memoized (same instance)
    expect(firstRender).toBe(secondRender)
  })
})
