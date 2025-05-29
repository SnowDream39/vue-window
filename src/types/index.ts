export interface WindowOptions {
  title: string
  content: any
  minimized: boolean
  padding?: string
  minSize?: { width: number; height: number }
  size?: { width: number; height: number }
  allowResize?: boolean
  // 我连事件钩子也设计了
  beforeMinimize?: () => void
  afterMinimize?: () => void
  beforeMaximize?: () => void
  afterMaximize?: () => void
  beforeClose?: () => void
  afterClose?: () => void
}

export interface IconOptions {
  name: string
  windowOptions: WindowOptions
}

export interface WindowSystemOptions {
  [key: string]: IconOptions
}
