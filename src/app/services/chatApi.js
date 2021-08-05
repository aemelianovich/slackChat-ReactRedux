import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { rtkRoutes } from '../../routes.js';

export const chatApi = createApi({
  reducerPath: 'chatApi',
  baseQuery: fetchBaseQuery({
    baseUrl: rtkRoutes.baseUrl(),
  }),
  entityTypes: ['Counter'],
  endpoints: (builder) => ({
    getChatData: builder.query({
      query(user) {
        const myHeaders = new Headers();
        myHeaders.append('Authorization', `Bearer ${user.token}`);

        return {
          url: rtkRoutes.chatDataPath(),
          method: 'GET',
          headers: myHeaders,
        };
      },
    }),
  }),
});

export const { useGetChatDataQuery } = chatApi;
