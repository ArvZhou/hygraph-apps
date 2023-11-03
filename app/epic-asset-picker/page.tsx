'use client'
import React from 'react';
import { useApp, Wrapper } from '@hygraph/app-sdk-react';
import { useLogin } from '../../components/login';

export default function Page() {
  const { isLogin } = useLogin();

  if (!isLogin) {
    return 'Not allowed'
  }

  return 'Thanks'
}