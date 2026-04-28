---
paths:
  - "**/queries/**/*.ts"
  - "**/mutations/**/*.ts"
---

## TanStack Query — Factory Pattern

Define query/mutation hooks in `packages/core` using factory helpers from `@vtrip/lib/react-query`.

### Query keys

```tsx
import { queryKeysFactory } from "@vtrip/lib/react-query"

const recommendationKeys = queryKeysFactory<"recommendation">("recommendation")
// recommendationKeys.all / .lists() / .list(query) / .details() / .detail(id)
```

### Query hook

```tsx
export const useGetRecommendationQuery = (
  params: RecommendationParams,
  options?: UseQueryOptionsWrapper<RecommendationResponse, FetchError>
) =>
  useQuery({
    queryKey: recommendationKeys.all,
    queryFn: () => api.searchAvailability.recommendation.getRecommendation(params),
    ...options,
  })
```

`UseQueryOptionsWrapper` omits `queryKey` and `queryFn` — callers can only pass `enabled`, `staleTime`, etc.

### Mutation hook

```tsx
export const useClearTicketHistoriesMutation = (
  options?: UseMutationOptionsWrapper<void, DataResponse<null>, FetchError>
) => {
  const queryClient = useQueryClient()

  return useMutation({
    ...options,
    mutationFn: () => api.ticket.search.clearHistories(),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: ticketHistoriesKeys.all })
      options?.onSuccess?.(...args)
    },
  })
}
```

`UseMutationOptionsWrapper<TVariables, TData, TError>` — spread `...options` first, then override `mutationFn` and `onSuccess`. Always call `options?.onSuccess?.(...args)` after invalidation so callers' callbacks still fire.

### Rules

- Error type is always `FetchError` from `@vtrip/api`
- Do not use inline string keys (`["recommendation"]`) or define `queryKey`/`queryFn` in components
- **All query hooks** live in `packages/core/src/shared/queries/` — NOT in domain directories
- **All mutation hooks** live in `packages/core/src/shared/mutations/`
- Import path: `@vtrip/core/shared/queries/<file-name>` (e.g. `@vtrip/core/shared/queries/hotel-detail`)
- Do NOT create `queries/` directories inside `domains/*/` — domain directories contain only constants, hooks, schemas, and utils
