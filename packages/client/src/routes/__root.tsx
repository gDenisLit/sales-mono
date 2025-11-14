import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import type { QueryClient } from '@tanstack/react-query'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <main className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
        <header>
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-400">
            Org Chart Builder
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">
            Map the teams inside any company
          </h1>
          <p className="mt-2 text-base text-slate-300">
            Start by searching for a company. Choose a quick preview or view the full list of
            matches to build its organization map.
          </p>
        </header>
        <Outlet />
      </main>
    </div>
  ),
})
