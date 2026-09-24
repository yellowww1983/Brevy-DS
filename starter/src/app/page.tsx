import { Button, Container } from "@brevy/ui"

export default function Page() {
  return (
    <main className="flex min-h-screen items-center bg-secondary py-24">
      <Container className="flex flex-col items-start gap-6">
        <h1 className="font-serif text-h2 text-foreground">
          Your page goes here
        </h1>
        <p className="max-w-xl text-body-lg text-muted-foreground">
          Tell Claude what page you want, and it will build it here out of
          Brevy&rsquo;s own blocks.
        </p>
        <Button>Get started</Button>
      </Container>
    </main>
  )
}
