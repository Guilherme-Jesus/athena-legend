import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react'
import { IListBlocks } from './../../types/index'

export const blocksApi = createApi({
  reducerPath: 'blocksApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:7010' }),
  tagTypes: ['Blocks'],
  endpoints: (builder) => ({
    getBlocks: builder.query<IListBlocks[], void>({
      // propriedade query é a url que será chamada para capturar todos os usuários
      query: () => '/blocks',
      transformResponse: (
        response: IListBlocks[], // propriedade que permite a manipulação dos dados retornados por uma consulta ou mutação antes de atingir o cache.
      ) =>
        response.sort((a: IListBlocks, b: IListBlocks) =>
          a.name.localeCompare(b.name),
        ),

      providesTags: ['Blocks'],
    }),
    createBlocks: builder.mutation<IListBlocks, IListBlocks>({
      // propriedade mutation é a url que será chamada para criar um usuário novo, é usado mutation porque é uma alteração no banco de dados
      query: (user) => ({
        url: '/blocks',
        method: 'POST',
        body: user,
      }),
      invalidatesTags: ['Blocks'],
    }),
    updateBlocks: builder.mutation<void, IListBlocks>({
      // propriedade mutation é a url que será chamada para atualizar dados de um usuário.
      query: ({ blockId, ...rest }) => ({
        url: `/blocks/${blockId}`,
        method: 'PATCH',
        body: rest,
      }),
      invalidatesTags: ['Blocks'],
    }),
    deleteBlocks: builder.mutation<void, string>({
      // propriedade mutation é a url que será chamada para deletar um usuário.
      query: (blockId) => ({
        url: `/blocks/${blockId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Blocks'],
    }),
  }),
})
export const {
  useGetBlocksQuery,
  useCreateBlocksMutation,
  useUpdateBlocksMutation,
  useDeleteBlocksMutation,
} = blocksApi
