'use client'
import React from 'react';
import { useApp, Wrapper } from '@hygraph/app-sdk-react';
import { useLogin } from '../../components/epic-login';

const USER = 'arvin.zhou';
const PASSWORD = 'arvin.zhou@hatchbetter.com';
const DOMAIN = 'https://epiccmsv2-website-cisandbox.ol.epicgames.net';

export default function Page() {
  const { isLogin } = useLogin({ username: USER, password: PASSWORD, domain: DOMAIN });

  if (!isLogin) {
    return 'Not allowed'
  }

  return 'Thanks'
}