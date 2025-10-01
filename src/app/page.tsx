import { RegistrationForm } from "@/components/registration-form"

export default function Home() {
  return (
    <main className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2 text-balance">New Converts Form</h1>
          <p className="text-muted-foreground text-lg">Please fill in the details for the new convert</p>
        </div>
        
        <RegistrationForm />
      </div>
    </main>
  )
}
