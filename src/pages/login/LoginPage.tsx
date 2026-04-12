import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';
import {
  Card,
  Elevation,
  FormGroup,
  InputGroup,
  Button,
  Checkbox,
  Intent,
  Icon,
} from '@blueprintjs/core';
import { AppToaster } from '@/lib/toaster';

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
    control,
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
      const toaster = await AppToaster;
      toaster.show({
        message: '로그인 실패: 아이디 또는 비밀번호를 확인해주세요.',
        intent: Intent.DANGER,
        icon: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-form-container">
      <Icon icon="shield" size={28} className="login-logo-icon" />
      <h2 className="bp6-heading login-title">환영합니다</h2>
      <p className="bp6-text-muted login-subtitle">
        엣지 AI 취약성 분석 시스템에 로그인하세요.
      </p>

      <Card elevation={Elevation.ZERO} className="login-card">
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormGroup
            label="아이디"
            labelFor="username"
            intent={errors.username ? Intent.DANGER : Intent.NONE}
            helperText={errors.username?.message}
          >
            <Controller
              name="username"
              control={control}
              render={({ field }) => (
                <InputGroup
                  id="username"
                  large
                  placeholder="ID를 입력하세요"
                  disabled={isLoading}
                  intent={errors.username ? Intent.DANGER : Intent.NONE}
                  {...field}
                />
              )}
            />
          </FormGroup>

          <FormGroup
            label="비밀번호"
            labelFor="password"
            intent={errors.password ? Intent.DANGER : Intent.NONE}
            helperText={errors.password?.message}
          >
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <InputGroup
                  id="password"
                  type="password"
                  large
                  placeholder="비밀번호를 입력하세요"
                  disabled={isLoading}
                  intent={errors.password ? Intent.DANGER : Intent.NONE}
                  {...field}
                />
              )}
            />
          </FormGroup>

          <Checkbox
            checked={saveId}
            onChange={(e) => setSaveId((e.target as HTMLInputElement).checked)}
            label="아이디 저장"
            style={{ marginBottom: 16 }}
          />

          <Button
            type="submit"
            intent={Intent.PRIMARY}
            large
            fill
            loading={isLoading}
            text="로그인"
          />
        </form>
      </Card>

      <p className="bp6-text-muted login-footer">
        신규 계정 생성 및 비밀번호 초기화는 관리자에게 문의하세요.
      </p>
    </div>
  );
}
