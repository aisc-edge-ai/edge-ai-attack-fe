import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const loginSchema = z.object({
  username: z.string().min(1, '아이디를 입력해주세요'),
  password: z.string().min(1, '비밀번호를 입력해주세요'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginPage() {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [saveId, setSaveId] = useState(() => {
    return localStorage.getItem('savedUsername') !== null;
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: localStorage.getItem('savedUsername') || '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      if (saveId) {
        localStorage.setItem('savedUsername', data.username);
      } else {
        localStorage.removeItem('savedUsername');
      }
      await login(data);
    } catch {
      toast.error('로그인 실패', {
        description: '아이디 또는 비밀번호를 확인해주세요.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">모의 공격 시스템</CardTitle>
          <CardDescription className="text-base">
            (엣지 AI 취약성 분석)
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">아이디 입력</Label>
              <Input
                id="username"
                type="text"
                placeholder="ID"
                className="h-10"
                {...register('username')}
              />
              {errors.username && (
                <p className="text-sm text-destructive">
                  {errors.username.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">비밀번호 입력</Label>
              <Input
                id="password"
                type="password"
                placeholder="Password"
                className="h-10"
                {...register('password')}
              />
              {errors.password && (
                <p className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex-col gap-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  로그인 중...
                </>
              ) : (
                '로그인'
              )}
            </Button>

            <div className="flex items-center gap-2 self-start">
              <Checkbox
                id="saveId"
                checked={saveId}
                onCheckedChange={(checked) => setSaveId(checked === true)}
              />
              <Label htmlFor="saveId" className="cursor-pointer">
                아이디 저장
              </Label>
            </div>

            <p className="text-sm text-muted-foreground text-center">
              신규 계정 생성 및 비밀번호 초기화는 관리자에게 문의하세요.
            </p>
          </CardFooter>
        </form>
      </Card>

      <Card size="sm" className="fixed bottom-8 left-8">
        <CardContent>
          <h3 className="font-bold text-foreground">관리자 페이지</h3>
          <p className="text-sm text-muted-foreground">- 개발팀 만 로그인 가능</p>
        </CardContent>
      </Card>
    </>
  );
}
