import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Container } from "./ui/container"
import { Section } from "./ui/section"
import Image from "next/image"
import Link from "next/link"

const categories = [
  {
    name: "Web Development",
    description: "Build modern web applications.",
    image: "https://images.unsplash.com/photo-1526925539332-aa3b66e35444?q=80&w=765&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    link: "/courses?category=web-development",
  },
  {
    name: "Data Science",
    description: "Analyze data and build predictive models.",
    image: "https://plus.unsplash.com/premium_vector-1737111429317-5b4916de2417?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    link: "/courses?category=data-science",
  },
  {
    name: "Mobile Development",
    description: "Create apps for iOS and Android.",
    image: "https://plus.unsplash.com/premium_vector-1731404277862-009db5c3848f?q=80&w=715&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    link: "/courses?category=mobile-development",
  },
  {
    name: "UI/UX Design",
    description: "Design intuitive and beautiful interfaces.",
    image: "https://plus.unsplash.com/premium_vector-1725984427567-a4f3c4483449?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    link: "/courses?category=ui-ux-design",
  },
  {
    name: "Digital Marketing",
    description: "Master online marketing strategies.",
    image: "https://images.unsplash.com/vector-1745065955144-6d0d06905350?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    link: "/courses?category?",
  },
  {
    name: "Business & Entrepreneurship",
    description: "Start and grow your own business.",
    image: "https://plus.unsplash.com/premium_vector-1732191809247-6f7e71aff7fc?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    link: "/courses?category=business",
  },
]

export function CourseCategories() {
  return (
    <Section className="bg-muted">
      <Container>
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Explore Course Categories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link href={category.link} key={category.name}>
              <Card className="group overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
                <div className="relative w-full h-40 overflow-hidden">
                  <Image
                    src={category.image || "/placeholder.svg"}
                    alt={category.name}
                    layout="fill"
                    objectFit="cover"
                    className="transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-xl">{category.name}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-muted-foreground">{category.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </Container>
    </Section>
  )
}
