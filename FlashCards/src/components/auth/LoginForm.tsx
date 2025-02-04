import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { FormEvent } from "react";

interface LoginFormProps {
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  showPassword: boolean;
  setShowPassword: (value: boolean) => void;
  loading: boolean;
  errors: { email: string; password: string };
  handleSubmit: (e: FormEvent) => void;
  toggleForm: () => void;
}

export const LoginForm = ({
  email,
  setEmail,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  loading,
  errors,
  handleSubmit,
  toggleForm,
}: LoginFormProps) => {
  return (
    <div className="auth-form-face">
      <div className="logo-container">
        <LogIn className="h-10 w-10 text-primary" />
      </div>
      
      <div className="form-header">
        <h2 className="form-title">Welcome back</h2>
        <p className="form-description">
          Please sign in to your account
        </p>
      </div>

      <form onSubmit={handleSubmit} className="form-group">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            placeholder="name@example.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={errors.email ? "border-destructive" : ""}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="input-group">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={errors.password ? "border-destructive" : ""}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="password-toggle"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-sm text-destructive">{errors.password}</p>
          )}
        </div>

        <div className="text-right mt-2">
          <a href="#" className="form-link text-sm">
            Forgot your password?
          </a>
        </div>

        <Button className="w-full mt-6" type="submit" disabled={loading}>
          {loading ? (
            "Signing in..."
          ) : (
            <>
              Sign in
              <LogIn className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </form>

      <div className="form-footer">
        <p>
          Don't have an account?{" "}
          <button onClick={toggleForm} className="form-link">
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
};