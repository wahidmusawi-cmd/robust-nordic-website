"use client"

import { useActionState } from "react"
import { Loader2, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { login, type LoginState } from "@/app/adminlog/kirjaudu/actions"

const initialState: LoginState = { error: null }

export function LoginForm({ nextPath }: { nextPath: string }) {
  const [state, formAction, pending] = useActionState(login, initialState)

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="seuraava" value={nextPath} />
      <div className="space-y-2">
        <Label htmlFor="salasana">Salasana</Label>
        <Input
          id="salasana"
          name="salasana"
          type="password"
          required
          autoFocus
          autoComplete="current-password"
          placeholder="••••••••"
        />
      </div>
      {state.error && (
        <p role="alert" className="text-destructive text-sm">
          {state.error}
        </p>
      )}
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? (
          <Loader2 className="size-4 animate-spin" aria-hidden />
        ) : (
          <Lock className="size-4" aria-hidden />
        )}
        Kirjaudu sisään
      </Button>
    </form>
  )
}
