import React from "react"

// Mock sidebar components to avoid React hook errors

interface SidebarContextValue {
  state: "expanded" | "collapsed"
  open: boolean
  setOpen: (open: boolean) => void
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
  isMobile: boolean
  toggleSidebar: () => void
}

const SidebarContext = React.createContext<SidebarContextValue | null>(null)

function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.")
  }
  return context
}

const SidebarProvider = ({ children, ...props }: { children: React.ReactNode; [key: string]: any }) => {
  // Mock implementation without hooks
  const contextValue: SidebarContextValue = {
    state: "expanded",
    open: true,
    setOpen: () => {},
    openMobile: false,
    setOpenMobile: () => {},
    isMobile: false,
    toggleSidebar: () => {}
  }

  return (
    <SidebarContext.Provider value={contextValue}>
      <div {...props}>
        {children}
      </div>
    </SidebarContext.Provider>
  )
}

const Sidebar = ({ children, ...props }: { children: React.ReactNode; [key: string]: any }) => {
  return <div {...props}>{children}</div>
}

const SidebarContent = ({ children, ...props }: { children: React.ReactNode; [key: string]: any }) => {
  return <div {...props}>{children}</div>
}

const SidebarGroup = ({ children, ...props }: { children: React.ReactNode; [key: string]: any }) => {
  return <div {...props}>{children}</div>
}

const SidebarGroupContent = ({ children, ...props }: { children: React.ReactNode; [key: string]: any }) => {
  return <div {...props}>{children}</div>
}

const SidebarGroupLabel = ({ children, ...props }: { children: React.ReactNode; [key: string]: any }) => {
  return <div {...props}>{children}</div>
}

const SidebarHeader = ({ children, ...props }: { children: React.ReactNode; [key: string]: any }) => {
  return <div {...props}>{children}</div>
}

const SidebarFooter = ({ children, ...props }: { children: React.ReactNode; [key: string]: any }) => {
  return <div {...props}>{children}</div>
}

const SidebarInset = ({ children, ...props }: { children: React.ReactNode; [key: string]: any }) => {
  return <div {...props}>{children}</div>
}

const SidebarInput = (props: any) => {
  return <input {...props} />
}

const SidebarMenu = ({ children, ...props }: { children: React.ReactNode; [key: string]: any }) => {
  return <div {...props}>{children}</div>
}

const SidebarMenuAction = ({ children, ...props }: { children: React.ReactNode; [key: string]: any }) => {
  return <div {...props}>{children}</div>
}

const SidebarMenuBadge = ({ children, ...props }: { children: React.ReactNode; [key: string]: any }) => {
  return <div {...props}>{children}</div>
}

const SidebarMenuButton = ({ children, ...props }: { children: React.ReactNode; [key: string]: any }) => {
  return <button {...props}>{children}</button>
}

const SidebarMenuItem = ({ children, ...props }: { children: React.ReactNode; [key: string]: any }) => {
  return <div {...props}>{children}</div>
}

const SidebarMenuSkeleton = ({ children, ...props }: { children?: React.ReactNode; [key: string]: any }) => {
  return <div {...props}>{children}</div>
}

const SidebarMenuSub = ({ children, ...props }: { children: React.ReactNode; [key: string]: any }) => {
  return <div {...props}>{children}</div>
}

const SidebarMenuSubButton = ({ children, ...props }: { children: React.ReactNode; [key: string]: any }) => {
  return <button {...props}>{children}</button>
}

const SidebarMenuSubItem = ({ children, ...props }: { children: React.ReactNode; [key: string]: any }) => {
  return <div {...props}>{children}</div>
}

const SidebarRail = ({ children, ...props }: { children?: React.ReactNode; [key: string]: any }) => {
  return <div {...props}>{children}</div>
}

const SidebarSeparator = ({ children, ...props }: { children?: React.ReactNode; [key: string]: any }) => {
  return <div {...props}>{children}</div>
}

const SidebarTrigger = ({ children, ...props }: { children?: React.ReactNode; [key: string]: any }) => {
  return <button {...props}>{children}</button>
}

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarInput,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
}