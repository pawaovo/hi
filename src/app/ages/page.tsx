import { AgeGrid } from '@/components/age/age-grid'

export default function AllAgesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-4">
          所有年龄段
        </h1>
        <p className="text-muted-foreground">
          从7岁到91岁，每个年龄都有独特的智慧
        </p>
      </div>

      <AgeGrid showAll={true} />
    </div>
  )
}
