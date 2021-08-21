import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import routes from '../../routes.js';

export const chatApi = createApi({
  reducerPath: 'chatApi',
  baseQuery: fetchBaseQuery({
    baseUrl: routes.rtkBaseUrl(),
  }),
  endpoints: (builder) => ({
    getChatData: builder.query({
      query(user) {
        const myHeaders = new Headers();
        myHeaders.append('Authorization', `Bearer ${user.token}`);

        return {
          url: routes.chatDataPath(),
          method: 'GET',
          headers: myHeaders,
        };
      },
    }),
  }),
});

export const { useGetChatDataQuery } = chatApi;
