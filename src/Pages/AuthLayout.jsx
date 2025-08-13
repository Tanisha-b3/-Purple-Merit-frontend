
import { Card, CardHeader, CardTitle, CardContent } from '../Components/ui/card';
import { Button } from '../Components/ui/Button';
import { Input } from '../Components/ui/Input';

export const AuthLayout = ({ 
  title, 
  onSubmit, 
  email, 
  setEmail, 
  password, 
  setPassword, 
  errors, 
  buttonText,
  footerContent 
}) => {
  return (
    <Card className="w-full max-w-md mx-auto mt-10">
      <CardHeader>
        <CardTitle className="text-center">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={errors.password ? 'border-red-500' : ''}
            />
            {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
          </div>
          
          <Button type="submit" className="w-full">
            {buttonText}
          </Button>
        </form>
        
        <div className="mt-4 text-center text-sm">
          {footerContent}
        </div>
      </CardContent>
    </Card>
  );
};