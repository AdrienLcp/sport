import type React from 'react'

import { ShellNotices } from './shell-notices'

import './app-shell.sass'

type AppShellProps = {
  children: React.ReactNode
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => (
  <div className='app-shell'>
    <div className='notices'>
      <ShellNotices />
    </div>
    <div className='stage'>{children}</div>
  </div>
)
