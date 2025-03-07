import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import { FormEvent } from "react";

interface SignupFormProps {
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  username: string;
  setUsername: (value: string) => void;
  showPassword: boolean;
  setShowPassword: (value: boolean) => void;
  loading: boolean;
  errors: { email: string; password: string; username?: string };
  handleSubmit: (e: FormEvent) => void;
  toggleForm: () => void;
}

export const SignupForm = ({
  email,
  setEmail,
  password,
  setPassword,
  username,
  setUsername,
  showPassword,
  setShowPassword,
  loading,
  errors,
  handleSubmit,
  toggleForm,
}: SignupFormProps) => {
  return (
    <div className="auth-form-face auth-form-back">
      <div className="logo-container">
        <UserPlus className="h-10 w-10 text-primary" />
      </div>
      
      <div className="form-header">
        <h2 className="form-title">Create account</h2>
        <p className="form-description">
          Please sign up for an account
        </p>
      </div>

      <form onSubmit={handleSubmit} className="form-group">
        <div className="space-y-2">
          <Label htmlFor="signup-username">Username</Label>
          <Input
            id="signup-username"
            placeholder="johndoe"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={errors.username ? "border-destructive" : ""}
          />
          {errors.username && (
            <p className="text-sm text-destructive">{errors.username}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="signup-email">Email</Label>
          <Input
            id="signup-email"
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
          <Label htmlFor="signup-password">Password</Label>
          <div className="input-group">
            <Input
              id="signup-password"
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

        <Button className="w-full mt-6" type="submit" disabled={loading}>
          {loading ? (
            "Creating account..."
          ) : (
            <>
              Create account
              <UserPlus className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </form>

      <div className="form-footer">
        <p>
          Already have an account?{" "}
          <button onClick={toggleForm} className="form-link">
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
};