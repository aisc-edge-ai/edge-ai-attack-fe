import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';
import {
  Button,
  Checkbox,
  InputGroup,
  Intent,
  Spinner,
  SpinnerSize,
  Icon,
} from '@blueprintjs/core';
import { AppToaster } from '@/lib/toaster';
import { cn } from '@/lib/utils';

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
    <>
      {/* Logo */}
      <div className="neo-logo">
        <Icon icon="shield" size={32} className="neo-logo-icon" />
      </div>

      {/* Title */}
      <h1 className="neo-title">환영합니다!</h1>
      <p className="neo-subtitle">엣지 AI 취약성 분석 시스템에 로그인하세요.</p>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="neo-form">
        {/* Username */}
        <div className={cn('neo-input-wrapper', errors.username && 'has-error')}>
          <Controller
            name="username"
            control={control}
            render={({ field }) => (
              <InputGroup
                placeholder="아이디를 입력하세요"
                disabled={isLoading}
                {...field}
              />
            )}
          />
          {errors.username && (
            <div className="neo-error-text">{errors.username.message}</div>
          )}
        </div>

        {/* Password */}
        <div className={cn('neo-input-wrapper', errors.password && 'has-error')}>
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <InputGroup
                type="password"
                placeholder="비밀번호를 입력하세요"
                disabled={isLoading}
                {...field}
              />
            )}
          />
          {errors.password && (
            <div className="neo-error-text">{errors.password.message}</div>
          )}
        </div>

        {/* Checkbox */}
        <div className="neo-checkbox-row">
          <Checkbox
            checked={saveId}
            onChange={(e) => setSaveId((e.target as HTMLInputElement).checked)}
            label="아이디 저장"
          />
        </div>

        {/* Submit */}
        <Button
          type="submit"
          className="neo-btn-submit"
          fill
          loading={isLoading}
          icon={isLoading ? <Spinner size={SpinnerSize.SMALL} /> : undefined}
          text="로그인"
        />
      </form>

      {/* Footer */}
      <p className="neo-footer">
        신규 계정 생성 및 비밀번호 초기화는 관리자에게 문의하세요.
      </p>
    </>
  );
}
