"use client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { registerUser } from "@/app/actions/register"
import { toast } from "sonner"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import Link from "next/link"

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget as HTMLFormElement)
    if (formData.get("password") !== formData.get("confirm-password")) {
      toast.error("Passwords do not match")
      return
    }
    setLoading(true)
    const result = await registerUser(formData)
    if (result.error) {
      toast.error(result.error)
      setLoading(false)
    } else {
      if (result.email && result.password) {
        const login = await signIn("credentials", {
          email: result.email,
          password: result.password,
          redirect: false,
        })
        if (login?.error) {
          toast.error("Account created but failed to log in, please try logging in manually")
          setLoading(false)
        } else {
          toast.success("Logged in successfully")
          setLoading(false)
          router.push("/dashboard")
          router.refresh()

        }
      }
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create your account</CardTitle>
          <CardDescription>
            Enter your email below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">Full Name</FieldLabel>
                <Input id="name" name="name" type="text" placeholder="John Doe" required />
              </Field>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="m@example.com"
                  required
                />
              </Field>
              <Field>
                <Field className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input id="password" name="password" type="password" placeholder="********" required />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="confirm-password">
                      Confirm Password
                    </FieldLabel>
                    <Input id="confirm-password" name="confirm-password" type="password" placeholder="********" required />
                  </Field>
                </Field>
                <FieldDescription>
                  Must be at least 8 characters long.
                </FieldDescription>
              </Field>
              <Field>
                <Button type="submit" disabled={loading}>{loading ? "Creating..." : "Create Account"}</Button>
                <FieldDescription className="text-center">
                  Already have an account? <Link href="/api/auth/login">Sign in</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  )
}

